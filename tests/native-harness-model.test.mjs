import assert from "node:assert/strict";
import test from "node:test";
import {
  idleNativeHarnessResults,
  nativeHarnessCapabilityIds,
  nativeHarnessFailure,
  passedNativeHarnessResult,
} from "../app/nativeHarnessModel.ts";

test("covers exactly the first six interactive native capabilities", () => {
  assert.deepEqual(nativeHarnessCapabilityIds, ["camera", "media", "share", "clipboard", "haptics", "toast"]);
  const results = idleNativeHarnessResults();
  assert.deepEqual(Object.keys(results), nativeHarnessCapabilityIds);
  assert.ok(Object.values(results).every((result) => result.status === "idle"));
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
