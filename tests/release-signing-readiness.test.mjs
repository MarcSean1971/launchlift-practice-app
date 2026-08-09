import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("..", import.meta.url);

test("keeps Android release signing opt-in, complete, and fail-closed", async () => {
  const gradle = await readFile(new URL("android/app/build.gradle", projectRoot), "utf8");
  const androidIgnore = await readFile(new URL("android/.gitignore", projectRoot), "utf8");
  const readme = await readFile(new URL("README.md", projectRoot), "utf8");

  for (const name of [
    "LAUNCHLIFT_UPLOAD_STORE_FILE",
    "LAUNCHLIFT_UPLOAD_STORE_PASSWORD",
    "LAUNCHLIFT_UPLOAD_KEY_ALIAS",
    "LAUNCHLIFT_UPLOAD_KEY_PASSWORD",
  ]) {
    assert.match(gradle, new RegExp(name));
    assert.match(readme, new RegExp(name));
  }

  assert.match(gradle, /releaseSigningPartiallyConfigured/);
  assert.match(gradle, /verifyReleaseSigning/);
  assert.match(gradle, /signingConfig signingConfigs\.release/);
  assert.match(androidIgnore, /\*\.jks/);
  assert.match(androidIgnore, /\*\.keystore/);
});
