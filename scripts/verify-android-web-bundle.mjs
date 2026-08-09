import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const bundleDirectory = path.join(root, ".launchlift", "web");
const html = await readFile(path.join(bundleDirectory, "index.html"), "utf8");

assert.match(html, /LaunchLift Practice App/);
assert.match(html, /One safe app\. All 28 possibilities\./);
assert.doesNotMatch(html, /http-equiv="refresh"/i);
assert.doesNotMatch(html, /launchlift-practice-app\.seelenbinder\.chatgpt\.site\//);
assert.doesNotMatch(html, /url\((?:file:\/\/)?[A-Za-z]:[\\/]/);
assert.match(html, /url\(\/fonts\//);

const assetNames = await readdir(path.join(bundleDirectory, "assets"));
const practiceAsset = assetNames.find((name) => /^PracticeApp-[\w-]+\.js$/.test(name));
assert.ok(practiceAsset, "the locally bundled Practice UI entry must exist");

for (const relativePath of [
  `assets/${practiceAsset}`,
  "runners/practice-background.js",
  "fonts/geist-8ac0455e797f/geist-98bbbccb.woff2",
]) {
  await access(path.join(bundleDirectory, relativePath));
}

console.log("Android web bundle is local, portable, and contains the native Practice assets.");
