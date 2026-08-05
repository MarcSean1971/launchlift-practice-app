"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  idleNativeHarnessResults,
  isTrustedPracticeAppLink,
  nativeHarnessFailure,
  passedNativeHarnessResult,
  type NativeHarnessCapabilityId,
  type NativeHarnessResult,
} from "./nativeHarnessModel";

const capabilityLabels: Record<NativeHarnessCapabilityId, string> = {
  camera: "Camera",
  media: "Photo library",
  share: "Native share",
  clipboard: "Clipboard",
  haptics: "Touch feedback",
  toast: "Native toast",
  sensors: "Motion sensors",
  biometrics: "Biometric unlock",
  deepLinks: "App links",
  offline: "Offline storage",
  background: "Background runner",
  voice: "Microphone",
};

export function NativeTestHarness() {
  const [native, setNative] = useState(false);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(idleNativeHarnessResults);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setNative(Capacitor.isNativePlatform());
  }, []);

  if (!native) return null;

  const run = async (capability: NativeHarnessCapabilityId, action: () => Promise<NativeHarnessResult>) => {
    setResults((current) => ({ ...current, [capability]: { status: "running", message: "Waiting for the phone…" } }));
    try {
      const result = await action();
      setResults((current) => ({ ...current, [capability]: result }));
    } catch (error) {
      setResults((current) => ({ ...current, [capability]: nativeHarnessFailure(error) }));
    }
  };

  const actions: Record<NativeHarnessCapabilityId, () => Promise<NativeHarnessResult>> = {
    camera: async () => {
      const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        quality: 72,
        correctOrientation: true,
        saveToGallery: false,
      });
      setPreviewUrl(photo.webPath ?? null);
      return passedNativeHarnessResult("A photo was captured for this preview only. It was not uploaded or saved to the gallery.");
    },
    media: async () => {
      const { Camera } = await import("@capacitor/camera");
      const selection = await Camera.pickImages({ limit: 1, quality: 72 });
      const photo = selection.photos[0];
      if (!photo) return { status: "idle", message: "No photo selected. No device data was kept." };
      setPreviewUrl(photo.webPath);
      return passedNativeHarnessResult("One image was selected for this preview only. It was not uploaded.");
    },
    share: async () => {
      const { Share } = await import("@capacitor/share");
      await Share.share({
        title: "LaunchLift Practice App",
        text: "I tested the native share sheet in the LaunchLift Practice App.",
        url: "https://launchlift-practice-app.seelenbinder.chatgpt.site/",
        dialogTitle: "Share the Practice App",
      });
      return passedNativeHarnessResult("The phone share sheet opened with the expected public Practice App link.");
    },
    clipboard: async () => {
      const { Clipboard } = await import("@capacitor/clipboard");
      const reference = `launchlift-practice-${new Date().toISOString().slice(0, 10)}`;
      await Clipboard.write({ string: reference });
      return passedNativeHarnessResult(`Copied a non-sensitive test reference: ${reference}`);
    },
    haptics: async () => {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Light });
      return passedNativeHarnessResult("The phone was asked for one light, user-triggered vibration.");
    },
    toast: async () => {
      const { Toast } = await import("@capacitor/toast");
      await Toast.show({ text: "Native toast test passed", duration: "short", position: "bottom" });
      return passedNativeHarnessResult("A short native confirmation was shown. Important errors still remain visible here.");
    },
    sensors: async () => {
      const MotionEvent = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (!MotionEvent) throw new Error("Device motion is unavailable on this phone.");
      if (MotionEvent.requestPermission) {
        const permission = await MotionEvent.requestPermission();
        if (permission !== "granted") throw new Error("Motion sensor permission denied.");
      }
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(() => {
          window.removeEventListener("devicemotion", handleMotion);
          reject(new Error("Motion sensor event unavailable."));
        }, 4_000);
        const handleMotion = (event: DeviceMotionEvent) => {
          if (!event.acceleration && !event.accelerationIncludingGravity && !event.rotationRate) return;
          window.clearTimeout(timer);
          window.removeEventListener("devicemotion", handleMotion);
          resolve();
        };
        window.addEventListener("devicemotion", handleMotion);
      });
      return passedNativeHarnessResult("The WebView delivered one motion sample. No sensor stream was stored or transmitted.");
    },
    biometrics: async () => {
      const { BiometricAuth } = await import("@aparajita/capacitor-biometric-auth");
      const availability = await BiometricAuth.checkBiometry();
      if (!availability.deviceIsSecure) {
        return { status: "blocked", message: "This phone has no secure device credential configured, so the biometric test cannot run." };
      }
      if (!availability.isAvailable) {
        return { status: "blocked", message: availability.reason || "No enrolled biometric method is available on this phone." };
      }
      await BiometricAuth.authenticate({
        reason: "Unlock the Practice App test harness",
        cancelTitle: "Cancel",
        allowDeviceCredential: true,
        androidTitle: "Practice App unlock test",
        androidSubtitle: "No biometric data is stored by this app",
      });
      return passedNativeHarnessResult("The operating system confirmed device authentication. The app did not receive or store biometric data.");
    },
    deepLinks: async () => {
      const { App } = await import("@capacitor/app");
      const launch = await App.getLaunchUrl();
      if (!launch?.url) {
        return {
          status: "blocked",
          message: "No app-link launch was captured. Close the app, reopen the public Practice URL as an installed app link, then test again.",
        };
      }
      if (!isTrustedPracticeAppLink(launch.url)) {
        return { status: "blocked", message: "The captured launch URL was not the trusted HTTPS Practice App domain." };
      }
      return passedNativeHarnessResult("The installed app received the trusted HTTPS launch URL. Android domain association still requires published assetlinks certificate evidence.");
    },
    offline: async () => {
      const { Preferences } = await import("@capacitor/preferences");
      const key = "launchlift.practice.offline-probe";
      const value = `local-${Date.now()}`;
      await Preferences.set({ key, value });
      const stored = await Preferences.get({ key });
      await Preferences.remove({ key });
      if (stored.value !== value) throw new Error("Offline preference round-trip failed.");
      return passedNativeHarnessResult("A temporary native preference survived a write/read round trip and was deleted. Offline sync and conflict handling remain separate tests.");
    },
    background: async () => {
      const { BackgroundRunner } = await import("@capacitor/background-runner");
      const runId = `practice-${Date.now()}`;
      const response = await BackgroundRunner.dispatchEvent<{ acknowledged?: boolean; runId?: string }>({
        label: "site.chatgpt.seelenbinder.launchliftpracticeapp.background",
        event: "practiceBackgroundProbe",
        details: { runId },
      });
      if (!response?.acknowledged || response.runId !== runId) throw new Error("Background runner acknowledgement was invalid.");
      return passedNativeHarnessResult("The isolated runner acknowledged a manual event. OS-scheduled background execution and battery behavior are not yet proven.");
    },
    voice: async () => {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone capture is unavailable in this converted build.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 600));
      } finally {
        stream.getTracks().forEach((track) => track.stop());
      }
      return passedNativeHarnessResult("Microphone permission and capture opened, then stopped. No audio was recorded, retained, uploaded, or transcribed.");
    },
  };

  return (
    <section className="native-harness" id="native-test-harness" aria-labelledby="native-harness-heading">
      <div className="native-harness-heading">
        <div>
          <span className="panel-kicker">Converted app only</span>
          <h2 id="native-harness-heading">Native test harness</h2>
        </div>
        <button className="button-secondary" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Close native tests" : "Open native tests"}
        </button>
      </div>
      <p className="native-harness-boundary">Each action runs only after you press it. A passed action proves that single interaction on this device—not that every production workflow for the capability is complete.</p>
      {open ? (
        <div className="native-harness-grid">
          {(Object.keys(capabilityLabels) as NativeHarnessCapabilityId[]).map((capability) => {
            const result = results[capability];
            return (
              <article className="native-test-card" key={capability}>
                <div><strong>{capabilityLabels[capability]}</strong><span className={`native-result ${result.status}`}>{result.status}</span></div>
                <p id={`native-result-${capability}`} role="status" aria-live="polite">{result.message}</p>
                <button
                  className="lab-action"
                  type="button"
                  disabled={result.status === "running"}
                  aria-describedby={`native-result-${capability}`}
                  onClick={() => void run(capability, actions[capability])}
                >
                  {result.status === "running" ? "Waiting…" : `Test ${capabilityLabels[capability]}`}
                </button>
              </article>
            );
          })}
          {previewUrl ? (
            <article className="native-preview-card">
              <div><strong>Private preview</strong><button type="button" className="text-button" onClick={() => setPreviewUrl(null)}>Remove</button></div>
              {/* The selected URI remains local to this rendered preview and is never sent by this harness. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- Capacitor returns a device-local URI that must not pass through a web image optimizer. */}
              <img src={previewUrl} alt="Temporary camera or photo-library preview" />
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
