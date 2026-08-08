import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageMetadata = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const practiceMetadata = JSON.parse(await readFile(new URL("../public/launchlift-practice.json", import.meta.url), "utf8"));
const retainedBuildMetadata = JSON.parse(await readFile(new URL("../.launchlift/android-build.json", import.meta.url), "utf8"));
const androidBuild = await readFile(new URL("../android/app/build.gradle", import.meta.url), "utf8");

test("keeps the current Android package version aligned and monotonic", () => {
  const versionName = androidBuild.match(/\bversionName\s+["']([^"']+)["']/)?.[1];
  const versionCodeText = androidBuild.match(/\bversionCode\s+(\d+)/)?.[1];

  assert.equal(versionName, packageMetadata.version);
  assert.equal(versionName, practiceMetadata.revision);
  assert.ok(versionCodeText, "Android versionCode must be declared as an integer");

  const versionCode = Number(versionCodeText);
  assert.ok(Number.isSafeInteger(versionCode) && versionCode > 0);
  assert.ok(
    versionCode > retainedBuildMetadata.versionCode,
    `Android versionCode ${versionCode} must advance beyond retained build ${retainedBuildMetadata.versionCode}`,
  );
});
