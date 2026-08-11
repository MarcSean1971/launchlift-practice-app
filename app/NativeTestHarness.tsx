"use client";

import { useEffect, useRef, useState } from "react";
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
  push: "Push registration",
  location: "Location",
  bluetooth: "Bluetooth readiness",
  nfc: "NFC readiness",
  video: "Video capture",
  network: "Network awareness",
  appLauncher: "Open email app",
  browser: "Trusted browser",
  files: "Private file round trip",
  barcode: "QR and barcode scan",
  localNotifications: "Local reminder",
  maps: "Native maps",
  keyboard: "Software keyboard",
  deviceInfo: "Device context",
  privacyScreen: "Privacy screen",
  screenReader: "Screen reader",
};

// Every passed probe must leave a physical, native acknowledgement on the
// handset. Some probes already do that through a system UI (camera, keyboard,
// share sheet, biometric prompt, etc.); quiet read/write/readiness probes use
// this dedicated native confirmation instead of asking a tester to trust the
// WebView result card.
const successEvidenceMessages: Record<NativeHarnessCapabilityId, string> = {
  camera: "Camera test completed",
  media: "Photo library test completed",
  share: "Native share test completed",
  clipboard: "Clipboard test completed",
  haptics: "Touch feedback test completed",
  toast: "Native toast test passed",
  sensors: "Motion sensor test completed",
  biometrics: "Biometric unlock test completed",
  deepLinks: "App links test completed",
  offline: "Offline storage test completed",
  background: "Background runner test completed",
  voice: "Microphone test completed",
  push: "Push registration test completed",
  location: "Location test completed",
  bluetooth: "Bluetooth readiness test completed",
  nfc: "NFC readiness test completed",
  video: "Video capture test completed",
  network: "Network awareness test completed",
  appLauncher: "Open email app test completed",
  browser: "Trusted browser test completed",
  files: "Private file round trip completed",
  barcode: "QR and barcode scan completed",
  localNotifications: "Local reminder test completed",
  maps: "Native maps test completed",
  keyboard: "Software keyboard test completed",
  deviceInfo: "Device context test completed",
  privacyScreen: "Privacy screen test completed",
  screenReader: "Screen reader test completed",
};

type NativeGoogleMap = { destroy: () => Promise<void> };

async function destroyNativeMap(map: NativeGoogleMap | null) {
  if (map) await map.destroy().catch(() => undefined);
}

async function showNativeSuccessFeedback(capability: NativeHarnessCapabilityId, result: NativeHarnessResult) {
  // A completed test must be perceptible on the handset, not merely reflected
  // in a WebView status card. The Toast test itself owns its physical feedback.
  if (result.status !== "passed" || capability === "toast") return;
  try {
    const { Toast } = await import("@capacitor/toast");
    await Toast.show({ text: successEvidenceMessages[capability], duration: "short", position: "bottom" });
  } catch {
    // Do not turn a proven native action into a failure only because its
    // optional confirmation surface is unavailable on this device.
  }
}

export function NativeTestHarness() {
  const [native, setNative] = useState(false);
  // The installed Practice APK is a bounded device-test surface. Opening this
  // section by default removes the remote-WebView-style entry dependency while
  // the native-platform guard below keeps the public source page unchanged.
  const [open, setOpen] = useState(true);
  const [results, setResults] = useState(idleNativeHarnessResults);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nativeMapVisible, setNativeMapVisible] = useState(false);
  const nativeMapHost = useRef<HTMLDivElement>(null);
  const nativeMap = useRef<NativeGoogleMap | null>(null);

  useEffect(() => {
    setNative(Capacitor.isNativePlatform());
    return () => {
      const activeMap = nativeMap.current;
      nativeMap.current = null;
      void destroyNativeMap(activeMap);
    };
  }, []);

  if (!native) return null;

  const resultEntries = Object.values(results);
  const passedCount = resultEntries.filter((result) => result.status === "passed").length;
  const attentionCount = resultEntries.filter((result) => result.status === "blocked").length;

  const run = async (capability: NativeHarnessCapabilityId, action: () => Promise<NativeHarnessResult>) => {
    setResults((current) => ({ ...current, [capability]: { status: "running", message: "Waiting for the phone…" } }));
    try {
      const result = await action();
      await showNativeSuccessFeedback(capability, result);
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
    push: async () => {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      let permission = await PushNotifications.checkPermissions();
      if (permission.receive !== "granted") permission = await PushNotifications.requestPermissions();
      if (permission.receive !== "granted") throw new Error("Push notification permission denied.");

      return new Promise<NativeHarnessResult>((resolve, reject) => {
        let settled = false;
        let handles: Array<{ remove: () => Promise<void> }> = [];
        let timer: number | undefined;

        async function cleanup() {
          if (timer !== undefined) window.clearTimeout(timer);
          await Promise.all(handles.map((handle) => handle.remove()));
        }
        async function finish(result: NativeHarnessResult) {
          if (settled) return;
          settled = true;
          await cleanup();
          resolve(result);
        }
        async function fail(error: Error) {
          if (settled) return;
          settled = true;
          await cleanup();
          reject(error);
        }

        void Promise.all([
          PushNotifications.addListener("registration", ({ value }) => {
            if (!value) return;
            void finish(passedNativeHarnessResult("The device returned a push registration token. Backend storage, FCM delivery, tap routing, and notification preferences remain unverified."));
          }),
          PushNotifications.addListener("registrationError", (error) => {
            void fail(new Error(error.error || "Push registration failed."));
          }),
        ]).then(async (registeredHandles) => {
          handles = registeredHandles;
          timer = window.setTimeout(() => void fail(new Error("Push registration unavailable or timed out.")), 15_000);
          await PushNotifications.register();
        }).catch((error: unknown) => {
          void fail(error instanceof Error ? error : new Error("Push registration failed."));
        });
      });
    },
    location: async () => {
      const { Geolocation } = await import("@capacitor/geolocation");
      let permission = await Geolocation.checkPermissions();
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        permission = await Geolocation.requestPermissions({ permissions: ["location", "coarseLocation"] });
      }
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        throw new Error("Location permission denied.");
      }
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 });
      if (!Number.isFinite(position.coords.latitude) || !Number.isFinite(position.coords.longitude)) {
        throw new Error("Location result unavailable.");
      }
      return passedNativeHarnessResult("The phone returned a current position. Coordinates were not displayed, stored, or transmitted by this harness.");
    },
    bluetooth: async () => {
      const { BluetoothLe } = await import("@capacitor-community/bluetooth-le");
      await BluetoothLe.initialize({ androidNeverForLocation: true });
      const enabled = await BluetoothLe.isEnabled();
      if (!enabled.value) {
        return { status: "blocked", message: "Bluetooth is available but disabled. Enable it in phone settings before testing scan, pairing, or reconnect behavior." };
      }
      return passedNativeHarnessResult("The native BLE adapter initialized and is enabled. No devices were scanned, paired, connected, or queried.");
    },
    nfc: async () => {
      const { CapacitorNfc } = await import("@capgo/capacitor-nfc");
      const support = await CapacitorNfc.isSupported();
      if (!support.supported) return { status: "blocked", message: "This phone does not report NFC hardware support." };
      const { status } = await CapacitorNfc.getStatus();
      if (status !== "NFC_OK") {
        return { status: "blocked", message: `NFC hardware is present but not ready (${status}). Enable NFC before testing a real tag.` };
      }
      return passedNativeHarnessResult("The native NFC adapter reports ready. No tag was scanned, trusted, parsed, written, or acted upon.");
    },
    video: async () => {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Video capture is unavailable in this converted build.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 600));
      } finally {
        stream.getTracks().forEach((track) => track.stop());
      }
      return passedNativeHarnessResult("The front camera video stream opened, then stopped. No frame, recording, audio, call, or upload was retained.");
    },
    network: async () => {
      const { Network } = await import("@capacitor/network");
      const current = await Network.getStatus();
      const listener = await Network.addListener("networkStatusChange", () => undefined);
      await listener.remove();
      return passedNativeHarnessResult(`The native network plugin reported ${current.connected ? "connected" : "offline"} and accepted a change listener. Retry and no-data-loss behavior remain unverified.`);
    },
    appLauncher: async () => {
      const { AppLauncher } = await import("@capacitor/app-launcher");
      const url = "mailto:?subject=LaunchLift%20Practice%20App%20test";
      const available = await AppLauncher.canOpenUrl({ url });
      if (!available.value) {
        return { status: "blocked", message: "No email app is available for this safe external-app handoff." };
      }
      const opened = await AppLauncher.openUrl({ url });
      if (!opened.completed) throw new Error("The email app did not open.");
      return passedNativeHarnessResult("The system opened an email draft target after your tap. No recipient, body, message, or send action was supplied.");
    },
    browser: async () => {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({
        url: "https://launchliftai.com/privacy",
        presentationStyle: "popover",
        toolbarColor: "#06141d",
      });
      return passedNativeHarnessResult("The trusted LaunchLiftAI privacy page opened in the system browser surface. No form, login, permission, or submission was performed.");
    },
    files: async () => {
      const { Directory, Encoding, Filesystem } = await import("@capacitor/filesystem");
      const path = `launchlift-practice/evidence-${Date.now()}.json`;
      const data = JSON.stringify({ kind: "native-file-round-trip", retained: false });
      await Filesystem.writeFile({ path, data, directory: Directory.Cache, encoding: Encoding.UTF8, recursive: true });
      try {
        const read = await Filesystem.readFile({ path, directory: Directory.Cache, encoding: Encoding.UTF8 });
        if (read.data !== data) throw new Error("Native file contents did not match the test payload.");
      } finally {
        await Filesystem.deleteFile({ path, directory: Directory.Cache });
      }
      return passedNativeHarnessResult("A non-sensitive JSON fixture was written, read, verified, and deleted from app cache. Persistent export, open, share, and user deletion flows remain unverified.");
    },
    barcode: async () => {
      const {
        CapacitorBarcodeScanner,
        CapacitorBarcodeScannerAndroidScanningLibrary,
        CapacitorBarcodeScannerCameraDirection,
        CapacitorBarcodeScannerScanOrientation,
        CapacitorBarcodeScannerTypeHint,
      } = await import("@capacitor/barcode-scanner");
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
        scanInstructions: "Scan a non-sensitive Practice test code",
        scanButton: false,
        cancelButtonAccessibilityLabel: "Cancel barcode scan",
        torchButtonOnAccessibilityLabel: "Turn torch on",
        torchButtonOffAccessibilityLabel: "Turn torch off",
        android: { scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING },
      });
      if (!result.ScanResult) return { status: "idle", message: "Scan canceled safely. No code data was kept." };
      return passedNativeHarnessResult(`A code was detected (${result.ScanResult.length} characters). Its content was not displayed, stored, trusted, opened, or acted upon.`);
    },
    localNotifications: async () => {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      let permission = await LocalNotifications.checkPermissions();
      if (permission.display !== "granted") permission = await LocalNotifications.requestPermissions();
      if (permission.display !== "granted") throw new Error("Local notification permission denied.");
      const id = 810_021;
      await LocalNotifications.schedule({
        notifications: [{
          id,
          title: "LaunchLift Practice reminder",
          body: "Temporary schedule/cancel test",
          schedule: { at: new Date(Date.now() + 60_000) },
          autoCancel: true,
          extra: { targetPath: "/#native-test-harness", practiceOnly: true },
        }],
      });
      const pending = await LocalNotifications.getPending();
      if (!pending.notifications.some((notification) => notification.id === id)) {
        throw new Error("The temporary local notification was not scheduled.");
      }
      await LocalNotifications.cancel({ notifications: [{ id }] });
      const afterCancel = await LocalNotifications.getPending();
      if (afterCancel.notifications.some((notification) => notification.id === id)) {
        throw new Error("The temporary local notification was not canceled.");
      }
      return passedNativeHarnessResult("A temporary local reminder was scheduled, found, and canceled before display. Delivery, tap routing, edits, and user timing choices remain unverified.");
    },
    maps: async () => {
      const { GoogleMap } = await import("@capacitor/google-maps");
      if (!GoogleMap || !Capacitor.isPluginAvailable("GoogleMaps")) {
        return { status: "blocked", message: "The native Google Maps bridge is unavailable in this converted build." };
      }
      const previousMap = nativeMap.current;
      nativeMap.current = null;
      await destroyNativeMap(previousMap);
      setNativeMapVisible(true);
      // Let React commit the visible host before Capacitor measures it for the
      // native MapView. A zero-sized/hidden host must never be accepted.
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())));
      const host = nativeMapHost.current;
      const bounds = host?.getBoundingClientRect();
      if (!host || !host.isConnected || !bounds || bounds.width < 80 || bounds.height < 80) {
        throw new Error("Native map display host was not visible.");
      }
      // Android obtains provider credentials from the installed native
      // configuration. Do not embed or expose a key in this web source.
      const mapId = "launchlift-practice-native-map-probe";
      try {
        await new Promise<void>((resolve, reject) => {
          const timer = window.setTimeout(() => reject(new Error("Native map did not report ready on this phone.")), 8_000);
          void GoogleMap.create({
            id: mapId,
            element: host,
            apiKey: "",
            forceCreate: true,
            config: {
              center: { lat: 0, lng: 0 },
              zoom: 2,
              androidLiteMode: false,
            },
          }, ({ mapId: readyMapId }) => {
            if (readyMapId !== mapId) return;
            window.clearTimeout(timer);
            resolve();
          }).then((map) => {
            nativeMap.current = map;
          }).catch((error: unknown) => {
            window.clearTimeout(timer);
            reject(error instanceof Error ? error : new Error("Native map creation failed."));
          });
        });
      } catch (error) {
        const failedMap = nativeMap.current;
        nativeMap.current = null;
        await destroyNativeMap(failedMap);
        setNativeMapVisible(false);
        throw error;
      }
      return passedNativeHarnessResult("A native Google Map view reported ready in the visible panel below and remains on screen for inspection. This proves only this rendered map on this phone; provider policy, credentials, tiles, location, routes, and production map workflows remain separate evidence.");
    },
    keyboard: async () => {
      const { Keyboard } = await import("@capacitor/keyboard");
      const input = document.getElementById("native-keyboard-probe");
      if (!(input instanceof HTMLInputElement)) throw new Error("Keyboard test input unavailable.");

      let resolveShown: (height: number) => void = () => undefined;
      const shown = new Promise<number>((resolve) => { resolveShown = resolve; });
      const handle = await Keyboard.addListener("keyboardDidShow", ({ keyboardHeight }) => resolveShown(keyboardHeight));
      const timer = window.setTimeout(() => resolveShown(-1), 4_000);
      try {
        input.focus();
        input.select();
        await Keyboard.show();
        const height = await shown;
        if (height < 0) throw new Error("Software keyboard event unavailable.");
        await new Promise((resolve) => window.setTimeout(resolve, 350));
        return passedNativeHarnessResult(`The software keyboard emitted a show event (${Math.round(height)} px) and was then hidden. Form resize, focus order, scroll behavior, and the device matrix remain unverified.`);
      } finally {
        window.clearTimeout(timer);
        await handle.remove();
        await Keyboard.hide().catch(() => undefined);
        input.blur();
      }
    },
    deviceInfo: async () => {
      const { Device } = await import("@capacitor/device");
      const info = await Device.getInfo();
      if (!info.platform || !info.operatingSystem) throw new Error("Non-identifying device context unavailable.");
      return passedNativeHarnessResult(`The native device plugin returned ${info.platform}/${info.operatingSystem} runtime context. No device name, model, identifier, memory, or battery data was displayed, stored, or transmitted.`);
    },
    privacyScreen: async () => {
      const { PrivacyScreen } = await import("@capacitor/privacy-screen");
      const initial = await PrivacyScreen.isEnabled();
      if (initial.enabled) {
        return passedNativeHarnessResult("Secure-window protection was already enabled, was confirmed, and was left enabled. Screenshot and app-switcher behavior across real devices remains unverified.");
      }
      let changed = false;
      try {
        const enableResult = await PrivacyScreen.enable();
        if (!enableResult.success) throw new Error("Privacy screen did not enable.");
        changed = true;
        const active = await PrivacyScreen.isEnabled();
        if (!active.enabled) throw new Error("Privacy screen state was not confirmed.");
        await new Promise((resolve) => window.setTimeout(resolve, 350));
      } finally {
        if (changed) await PrivacyScreen.disable().catch(() => undefined);
      }
      const restored = await PrivacyScreen.isEnabled();
      if (restored.enabled) throw new Error("Privacy screen did not return to its original disabled state.");
      return passedNativeHarnessResult("Secure-window protection was enabled, confirmed, and disabled. Screenshot and app-switcher behavior across real devices remains unverified.");
    },
    screenReader: async () => {
      const { ScreenReader } = await import("@capacitor/screen-reader");
      const state = await ScreenReader.isEnabled();
      if (!state.value) {
        return { status: "blocked", message: "The Android screen reader is disabled. Enable it in accessibility settings, then run this test again." };
      }
      await ScreenReader.speak({ value: "LaunchLift Practice screen reader test", language: "en" });
      return passedNativeHarnessResult("The native screen reader reported enabled and accepted one spoken test phrase. TalkBack navigation, focus order, labels, gestures, and the device matrix remain unverified.");
    },
  };

  return (
    <section className="native-harness" id="native-test-harness" aria-labelledby="native-harness-heading">
      <div className="native-harness-heading">
        <div>
          <span className="panel-kicker">Interactive device demo</span>
          <h2 id="native-harness-heading">Test your converted app</h2>
        </div>
        <button className="button-secondary" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Close native tests" : "Open native tests"}
        </button>
      </div>
      <p className="native-harness-boundary">Try the device features in this downloadable demo. Each action runs only after you press it. A passed action proves that single interaction on this phone—not that every production workflow for the capability is complete.</p>
      <div className="native-harness-progress" aria-live="polite">
        <div><span className="panel-kicker">Device checklist</span><strong>{passedCount} of {Object.keys(capabilityLabels).length} tests passed on this phone</strong></div>
        <span className={attentionCount ? "native-progress-attention" : "native-progress-ready"}>
          {attentionCount ? `${attentionCount} need phone setup` : "No setup blockers reported"}
        </span>
      </div>
      {open ? (
        <div className="native-harness-checks">
          <div className="native-harness-checks-heading">
            <div><span className="panel-kicker">Guided device checks</span><strong>Choose a feature to try on this phone</strong></div>
            <span>Every result stays visible below.</span>
          </div>
          <div className="native-harness-grid">
            {(Object.keys(capabilityLabels) as NativeHarnessCapabilityId[]).map((capability) => {
            const result = results[capability];
            return (
              <article className="native-test-card" key={capability}>
                <div><strong>{capabilityLabels[capability]}</strong><span className={`native-result ${result.status}`}>{result.status}</span></div>
                <p id={`native-result-${capability}`} role="status" aria-live="polite">{result.message}</p>
                {capability === "keyboard" ? (
                  <input id="native-keyboard-probe" className="native-keyboard-probe" type="text" defaultValue="Practice keyboard test" aria-label="Practice keyboard test field" />
                ) : null}
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
            {nativeMapVisible ? (
              <article className="native-map-preview-card" aria-label="Native Google map test surface">
                <div><strong>Native Google map</strong><span>Keep this panel visible while inspecting the rendered map.</span></div>
                <div id="native-google-map-probe" ref={nativeMapHost} className="native-google-map-probe" aria-label="Native Google map rendering surface" />
              </article>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
