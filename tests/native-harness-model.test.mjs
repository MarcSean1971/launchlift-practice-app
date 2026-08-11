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
        "EF:C8:3E:B0:FA:E9:F4:C7:51:FF:41:BE:EB:9A:60:E4:4E:6B:9B:5A:F2:4F:BA:42:ED:79:E9:51:6C:53:6A:81",
      ],
    },
  }]);
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
  assert.match(source, /toast: async \(\) => \{[\s\S]*?Toast\.show\(\{ text: "Native toast test passed"/u);
  assert.match(source, /maps: async \(\) => \{[\s\S]*?cannot pass until it renders a real map/u);
});

test("keeps downloadable native-demo actions visually separated from their explanation", () => {
  const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.native-test-card \{ display: flex; flex-direction: column; min-height: 14\.5rem; \}/u);
  assert.match(styles, /\.native-test-card p \{ color: var\(--muted\); min-height: 3rem; margin: \.9rem 0 0; line-height: 1\.5; \}/u);
  assert.match(styles, /\.native-test-card \.lab-action \{ margin-top: 1\.2rem; min-height: 2\.9rem; \}/u);
});
