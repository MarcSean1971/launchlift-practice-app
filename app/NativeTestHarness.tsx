"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  idleNativeHarnessResults,
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
