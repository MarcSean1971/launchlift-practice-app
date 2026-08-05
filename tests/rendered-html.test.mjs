import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the reusable Practice App", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /LaunchLift Practice App/);
  assert.match(html, /One safe app\. All 28 possibilities\./);
  assert.match(html, /Original preserved/);
  assert.match(html, /All 28 native functions/);
  assert.match(html, /No native functions selected here/);
  assert.match(html, /Everything else happens in LaunchLiftAI/);
  assert.doesNotMatch(html, /Choose generated outputs|Choose destinations|AI Helper authority|Prepare implementation brief/);
  assert.doesNotMatch(html, /Native test harness|Test Camera|Test Photo library/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps the interactive test slice native-only and user-triggered", async () => {
  const [practiceSource, harnessSource, modelSource, packageText] = await Promise.all([
    readFile(new URL("../app/PracticeApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/nativeHarnessModel.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const packageMetadata = JSON.parse(packageText);

  assert.match(practiceSource, /nativeCapabilities\.map/);
  assert.match(practiceSource, /<NativeTestHarness \/>/);
  assert.match(harnessSource, /Capacitor\.isNativePlatform\(\)/);
  assert.match(harnessSource, /if \(!native\) return null/);
  assert.match(harnessSource, /onClick=\{\(\) => void run\(capability, actions\[capability\]\)\}/);
  assert.match(harnessSource, /saveToGallery: false/);
  assert.match(harnessSource, /It was not uploaded/);
  assert.match(harnessSource, /not that every production workflow/);
  assert.match(modelSource, /Permission was denied/);
  assert.match(modelSource, /Canceled safely/);
  for (const dependency of ["@capacitor/camera", "@capacitor/share", "@capacitor/clipboard", "@capacitor/haptics", "@capacitor/toast"]) {
    assert.equal(typeof packageMetadata.dependencies[dependency], "string", `${dependency} must be installed`);
  }
});

test("wires the next six unimplemented native actions without claiming ordinal completion", async () => {
  const [harnessSource, modelSource, configSource, runnerSource, manifestSource, packageText] = await Promise.all([
    readFile(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/nativeHarnessModel.ts", import.meta.url), "utf8"),
    readFile(new URL("../capacitor.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.launchlift/web/runners/practice-background.js", import.meta.url), "utf8"),
    readFile(new URL("../android/app/src/main/AndroidManifest.xml", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const packageMetadata = JSON.parse(packageText);

  for (const capability of ["sensors", "biometrics", "deepLinks", "offline", "background", "voice"]) {
    assert.match(modelSource, new RegExp(`\\b${capability}\\b`));
  }
  for (const signal of ["DeviceMotionEvent", "BiometricAuth.authenticate", "App.getLaunchUrl", "Preferences.set", "BackgroundRunner.dispatchEvent", "getUserMedia"]) {
    assert.match(harnessSource, new RegExp(signal.replaceAll(".", "\\.")));
  }
  assert.match(harnessSource, /OS-scheduled background execution and battery behavior are not yet proven/);
  assert.match(harnessSource, /No audio was recorded, retained, uploaded, or transcribed/);
  assert.match(configSource, /autoStart: false/);
  assert.match(runnerSource, /user-triggered Practice run ID/);
  assert.match(manifestSource, /android\.intent\.action\.VIEW/);
  assert.match(manifestSource, /android\.permission\.RECORD_AUDIO/);
  assert.match(manifestSource, /android\.permission\.USE_BIOMETRIC/);
  assert.match(manifestSource, /ACCESS_BACKGROUND_LOCATION" tools:node="remove"/);
  for (const dependency of ["@capacitor/app", "@capacitor/background-runner", "@aparajita/capacitor-biometric-auth"]) {
    assert.equal(typeof packageMetadata.dependencies[dependency], "string", `${dependency} must be installed`);
  }
});

test("wires the following six device probes while retaining downstream evidence gates", async () => {
  const [harnessSource, modelSource, packageText] = await Promise.all([
    readFile(new URL("../app/NativeTestHarness.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/nativeHarnessModel.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const packageMetadata = JSON.parse(packageText);

  for (const capability of ["push", "location", "bluetooth", "nfc", "video", "network"]) {
    assert.match(modelSource, new RegExp(`\\b${capability}\\b`));
  }
  for (const signal of [
    "PushNotifications.register", "Geolocation.getCurrentPosition", "BluetoothLe.initialize",
    "CapacitorNfc.getStatus", "facingMode", "Network.getStatus",
  ]) {
    assert.match(harnessSource, new RegExp(signal.replaceAll(".", "\\.")));
  }
  assert.match(harnessSource, /Backend storage, FCM delivery, tap routing, and notification preferences remain unverified/);
  assert.match(harnessSource, /Coordinates were not displayed, stored, or transmitted/);
  assert.match(harnessSource, /No devices were scanned, paired, connected, or queried/);
  assert.match(harnessSource, /No tag was scanned, trusted, parsed, written, or acted upon/);
  assert.match(harnessSource, /No frame, recording, audio, call, or upload was retained/);
  assert.match(harnessSource, /Retry and no-data-loss behavior remain unverified/);
  for (const dependency of ["@capacitor/push-notifications", "@capacitor-community/bluetooth-le", "@capgo/capacitor-nfc"]) {
    assert.equal(typeof packageMetadata.dependencies[dependency], "string", `${dependency} must be installed`);
  }
});

test("declares an immutable 28-capability source owned by the LaunchLift workflow", async () => {
  const [metadataText, packageText, source, manifestText, iconBytes] = await Promise.all([
    readFile(new URL("../public/launchlift-practice.json", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/PracticeApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/icon-512.png", import.meta.url)),
  ]);
  const metadata = JSON.parse(metadataText);
  const packageMetadata = JSON.parse(packageText);
  const manifest = JSON.parse(manifestText);

  assert.equal(metadata.immutableOriginal, true);
  assert.equal(metadata.revision, "1.3.1");
  assert.equal(metadata.sourceUpdateChannel, "manual-mcp-acp");
  assert.equal(metadata.selectionOwner, "launchliftai");
  assert.equal(metadata.outputOwner, "launchliftai");
  assert.equal(metadata.capabilities.length, 28);
  assert.equal(new Set(metadata.capabilities).size, 28);
  assert.equal(packageMetadata.name, "launchlift-practice-app");
  assert.equal(packageMetadata.version, "1.3.1");
  assert.equal(packageMetadata.homepage, "https://launchlift-practice-app.seelenbinder.chatgpt.site/");
  assert.equal(packageMetadata.repository.url, "https://github.com/MarcSean1971/launchlift-practice-app.git");
  assert.match(source, /nativeCapabilities\.map/);
  assert.match(source, /manually, through MCP or ACP/);
  assert.doesNotMatch(source, /outputSelections|storeSelections|implementationChannel|authorityMode/);
  assert.deepEqual(manifest.icons.map((icon) => icon.src), ["/icon-192.png", "/icon-512.png"]);
  assert.deepEqual([...iconBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
