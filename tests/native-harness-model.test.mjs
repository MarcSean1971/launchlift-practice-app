import assert from "node:assert/strict";
import test from "node:test";
import {
  idleNativeHarnessResults,
  isTrustedPracticeAppLink,
  nativeHarnessCapabilityIds,
  nativeHarnessFailure,
  passedNativeHarnessResult,
} from "../app/nativeHarnessModel.ts";

test("covers the first two bounded native slices without changing the canonical catalogue", () => {
  assert.deepEqual(nativeHarnessCapabilityIds, [
    "camera", "media", "share", "clipboard", "haptics", "toast",
    "sensors", "biometrics", "deepLinks", "offline", "background", "voice",
  ]);
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

test("keeps cancellation, permission denial, unsupported plugins, and success distinct", () => {
  assert.deepEqual(nativeHarnessFailure(new Error("User cancelled photos app")), {
    status: "idle",
    message: "Canceled safely. No device data was kept.",
  });
  assert.equal(nativeHarnessFailure(new Error("Permission denied")).status, "blocked");
  assert.equal(nativeHarnessFailure(new Error("Plugin not implemented")).status, "blocked");
  assert.deepEqual(passedNativeHarnessResult("One action passed."), { status: "passed", message: "One action passed." });
});
