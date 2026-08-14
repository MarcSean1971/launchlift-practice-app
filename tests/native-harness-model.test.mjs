import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  idleNativeHarnessResults,
  isTrustedPracticeAppLink,
  nativeHarnessCapabilityIds,
  nativeHarnessFailure,
  passedNativeHarnessResult,
} from "../app/nativeHarnessModel.ts";

test("covers all 28 bounded native probes without changing the canonical catalogue", () => {
  assert.deepEqual(nativeHarnessCapabilityIds, [
    "camera", "media", "share", "clipboard", "haptics", "toast",
    "sensors", "biometrics", "deepLinks", "offline", "background", "voice",
    "push", "location", "bluetooth", "nfc", "video", "network",
    "appLauncher", "browser", "files", "barcode", "localNotifications",
    "maps", "keyboard", "deviceInfo", "privacyScreen", "screenReader",
  ]);
  assert.equal(nativeHarnessCapabilityIds.length, 28);
  assert.equal(new Set(nativeHarnessCapabilityIds).size, 28);
  const results = idleNativeHarnessResults();
  assert.deepEqual(Object.keys(results), nativeHarnessCapabilityIds);
  assert.ok(Object.values(results).every((result) => result.status === "idle"));
});

test("accepts only the trusted HTTPS Practice App link", () => {
  assert.equal(isTrustedPracticeAppLink("https://launchlift-practice-app.seelenbinder.chatgpt.site/"), true);
  assert.equal(isTrustedPracticeAppLink("http://launchlift-practice-app.seelenbinder.chatgpt.site/"), false);
  assert.equal(isTrustedPracticeAppLink("https://example.com/"), false);
  assert.equal(isTrustedPracticeAppLink("not a url"), false);
});

test("publishes the Android association for the installed Practice package", () => {
  const assetLinks = JSON.parse(
    readFileSync(new URL("../public/.well-known/assetlinks.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(assetLinks, [{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "site.chatgpt.seelenbinder.launchliftpracticeapp.android",
      sha256_cert_fingerprints: [
        "F1:BC:72:4A:C7:2E:FD:7B:7A:48:F4:43:FB:5D:72:5E:8C:9A:C4:4D:AB:A7:79:C3:1D:09:BC:50:D4:50:79:47",
      ],
    },
  }]);
});

test("keeps the Android App Links intent contract aligned with the trusted public host", () => {
  const manifest = readFileSync(new URL("../android/app/src/main/AndroidManifest.xml", import.meta.url), "utf8");

  assert.match(manifest, /android:name="\.MainActivity"/u);
  assert.match(manifest, /android:launchMode="singleTask"/u);
  assert.match(manifest, /<intent-filter android:autoVerify="true">[\s\S]*?<action android:name="android\.intent\.action\.VIEW"\s*\/>[\s\S]*?<category android:name="android\.intent\.category\.DEFAULT"\s*\/>[\s\S]*?<category android:name="android\.intent\.category\.BROWSABLE"\s*\/>[\s\S]*?<data[\s\S]*?android:scheme="https"[\s\S]*?android:host="launchlift-practice-app\.seelenbinder\.chatgpt\.site"[\s\S]*?android:pathPrefix="\/"[\s\S]*?\/>[\s\S]*?<\/intent-filter>/u);
  assert.doesNotMatch(manifest, /android:scheme="http"/u);
});

test("fails closed before native Push registration when Firebase is not configured", () => {
  const harness = readFileSync(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8");
  const activity = readFileSync(new URL("../android/app/src/main/java/site/chatgpt/seelenbinder/launchliftpracticeapp/android/MainActivity.java", import.meta.url), "utf8");
  const plugin = readFileSync(new URL("../android/app/src/main/java/site/chatgpt/seelenbinder/launchliftpracticeapp/android/PushRuntimePlugin.java", import.meta.url), "utf8");

  assert.match(activity, /registerPlugin\(PushRuntimePlugin\.class\)/u);
  assert.match(plugin, /@CapacitorPlugin\(name = "PushRuntime"\)/u);
  assert.match(plugin, /getIdentifier\([\s\S]*?"google_app_id"[\s\S]*?getContext\(\)\.getPackageName\(\)/u);
  assert.doesNotMatch(plugin, /com\.google\.firebase/u, "the config-free debug build must not need Firebase classes to fail closed");
  assert.match(harness, /push: async \(\) => \{[\s\S]*?PushRuntime\.getRuntimeStatus\(\)[\s\S]*?!runtime\.firebaseConfigured[\s\S]*?Firebase is not configured[\s\S]*?PushNotifications\.register\(\)/u);
});

test("uses one native non-persistent microphone capture instead of the WebView permission path", () => {
  const harness = readFileSync(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8");
  const activity = readFileSync(new URL("../android/app/src/main/java/site/chatgpt/seelenbinder/launchliftpracticeapp/android/MainActivity.java", import.meta.url), "utf8");
  const plugin = readFileSync(new URL("../android/app/src/main/java/site/chatgpt/seelenbinder/launchliftpracticeapp/android/MicrophoneRuntimePlugin.java", import.meta.url), "utf8");

  assert.match(activity, /registerPlugin\(MicrophoneRuntimePlugin\.class\)/u);
  assert.ok(
    activity.indexOf("registerPlugin(MicrophoneRuntimePlugin.class)") < activity.indexOf("super.onCreate(savedInstanceState)"),
    "app-owned plugins must be registered before Capacitor initialises its bridge",
  );
  assert.match(plugin, /@Permission\(alias = "microphone", strings = \{ Manifest\.permission\.RECORD_AUDIO \}\)/u);
  assert.match(plugin, /getContext\(\)\.checkSelfPermission\(Manifest\.permission\.RECORD_AUDIO\)/u);
  assert.match(plugin, /PackageManager\.PERMISSION_GRANTED/u);
  assert.doesNotMatch(plugin, /getPermissionState\("microphone"\)/u);
  assert.match(plugin, /requestPermissionForAlias\("microphone", call, "runProbe"\)/u);
  assert.match(plugin, /AudioRecord\.getMinBufferSize/u);
  assert.match(plugin, /recorder\.startRecording\(\)/u);
  assert.match(plugin, /recorder\.stop\(\)/u);
  assert.match(plugin, /recorder\.release\(\)/u);
  assert.match(harness, /voice: async \(\) => \{[\s\S]*?MicrophoneRuntime\.probe\(\)[\s\S]*?audioCaptureStarted/u);
  assert.doesNotMatch(harness.match(/voice: async \(\) => \{[\s\S]*?\n    \},\n    push:/u)?.[0] ?? "", /getUserMedia/u);
});

test("keeps cancellation, permission denial, unsupported plugins, and success distinct", () => {
  assert.deepEqual(nativeHarnessFailure(new Error("User cancelled photos app")), {
    status: "idle",
    message: "Canceled safely. No device data was kept.",
  });
  assert.equal(nativeHarnessFailure(new Error("Permission denied")).status, "blocked");
  assert.equal(nativeHarnessFailure(new Error("Plugin not implemented")).status, "blocked");
  assert.deepEqual(passedNativeHarnessResult("One action passed."), { status: "passed", message: "One action passed." });
});

test("opens the installed native test surface without a WebView entry tap", () => {
  const source = readFileSync(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8");
  assert.match(source, /const \[open, setOpen\] = useState\(true\);/u);
  assert.match(source, /if \(!native\) return null;/u, "the public web source must remain free of the native-only harness");
});

test("makes every successful native probe perceptible on the handset", () => {
  const source = readFileSync(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8");
  assert.equal(nativeHarnessCapabilityIds.length, 28);
  for (const capability of nativeHarnessCapabilityIds) {
    assert.match(source, new RegExp(`^  ${capability}:`, "mu"), `${capability} must remain a real harness action`);
    assert.match(source, new RegExp(`^  ${capability}: "`, "mu"), `${capability} must retain visible native evidence text`);
  }
  assert.match(source, /async function showNativeSuccessFeedback/u);
  assert.match(source, /result\.status !== "passed" \|\| capability === "toast"/u);
  assert.match(source, /Toast\.show\(\{ text: successEvidenceMessages\[capability\]/u);
  assert.match(source, /await showNativeSuccessFeedback\(capability, result\);/u);
  assert.match(source, /MicrophoneRuntime\.probe\(\)/u);
  assert.match(source, /Native microphone capture opened and stopped\. No audio was recorded, retained, uploaded, or transcribed\./u);
  assert.match(source, /PushNotifications\.addListener\("registrationError", \(\) => \{[\s\S]*?new Error\("Push registration failed\."\)/u);
  assert.match(source, /handles\.map\(\(handle\) => handle\.remove\(\)\.catch\(\(\) => undefined\)\)/u);
  assert.doesNotMatch(source, /error\.error/u, "provider error details must not enter the Practice harness result");
  assert.match(source, /toast: async \(\) => \{[\s\S]*?Toast\.show\(\{ text: "Native toast test passed"/u);
  assert.match(source, /clipboard: async \(\) => \{[\s\S]*?const previous = await Clipboard\.read\(\);[\s\S]*?const verified = await Clipboard\.read\(\);[\s\S]*?Clipboard\.write\(\{ string: previous\.value \?\? "" \}\);/u);
  assert.match(source, /function settleNativePromptWithin<T>\(/u);
  assert.match(source, /biometrics: async \(\) => \{[\s\S]*?settleNativePromptWithin\([\s\S]*?BiometricAuth\.authenticate/u);
  assert.match(source, /Biometric confirmation did not complete\. Cancel or complete the phone prompt, then try again\./u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?setNativeMapVisible\(true\)/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?nativeMapHost\.current/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?bounds\.width < 80 \|\| bounds\.height < 80/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?GoogleMap\.create\(\{[\s\S]*?element: host,[\s\S]*?forceCreate: true/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?\(\{ mapId: readyMapId \}\) => \{[\s\S]*?readyMapId !== mapId/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?Native map did not report ready on this phone/u);
  assert.match(source, /Native map did not report ready on this phone\."\)\), 20_000\);/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?A native Google Map view reported ready in the visible panel below/u);
  assert.match(source, /type NativeGoogleMap = \{ destroy: \(\) => Promise<void> \}/u);
  assert.match(source, /async function destroyNativeMap\(map: NativeGoogleMap \| null\)/u);
  assert.match(source, /void destroyNativeMap\(activeMap\)/u);
  assert.match(source, /id="native-google-map-probe" ref=\{nativeMapHost\} className="native-google-map-probe"/u);
});

test("keeps downloadable native-demo actions visually separated from their explanation", () => {
  const harness = readFileSync(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(harness, /Interactive device demo/u);
  assert.match(harness, /Test your converted app/u);
  assert.match(harness, /Guided device checks/u);
  assert.match(harness, /const passedCount = resultEntries\.filter\(\(result\) => result\.status === "passed"\)\.length;/u);
  assert.match(harness, /className="native-harness-progress" aria-live="polite"/u);
  assert.match(harness, /\{passedCount\} of \{Object\.keys\(capabilityLabels\)\.length\} tests passed on this phone/u);
  assert.match(styles, /\.native-test-card \{ display: flex; flex-direction: column; min-height: 15rem;/u);
  assert.match(styles, /\.native-test-card p \{ flex: 1; color: var\(--muted\); min-height: 3rem; margin: \.9rem 0 0; line-height: 1\.5; \}/u);
  assert.match(styles, /\.native-test-card \.lab-action \{ margin-top: 1\.8rem; min-height: 2\.9rem; \}/u);
  assert.match(styles, /\.native-test-card \.lab-action:disabled \{ cursor: wait; opacity: \.58; border-color: rgba\(112,200,255,\.22\); background: rgba\(112,200,255,\.055\); \}/u);
  assert.match(styles, /\.native-harness-checks-heading \{ display: flex; align-items: end; justify-content: space-between;/u);
  assert.match(styles, /\.native-test-card > div \{ padding-bottom: \.8rem; border-bottom: 1px solid rgba\(171,225,229,\.11\); \}/u);
  assert.match(styles, /\.native-result\.passed \{ color: var\(--mint\); background: rgba\(121,242,192,\.12\); \}/u);
  assert.match(styles, /\.native-result\.blocked \{ color: var\(--amber\); background: rgba\(255,190,92,\.12\); \}/u);
  assert.match(styles, /@media \(max-width: 860px\) \{[\s\S]*?\.native-harness-grid \{ grid-template-columns: 1fr; \}[\s\S]*?\.native-test-card \{ min-height: 0; \}/u);
  assert.match(styles, /@media \(max-width: 580px\) \{[\s\S]*?\.native-test-card \{ padding: 1\.1rem; \}[\s\S]*?\.native-test-card \.lab-action \{ margin-top: 1\.35rem; \}/u);
  assert.match(styles, /\.native-harness-progress \{ display: flex; align-items: center; justify-content: space-between;/u);
  assert.match(styles, /\.native-progress-attention \{ color: var\(--amber\); background: rgba\(255,190,92,\.11\); \}/u);
});
