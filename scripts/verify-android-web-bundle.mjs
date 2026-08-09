import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const bundleDirectory = path.join(root, ".launchlift", "web");
const html = await readFile(path.join(bundleDirectory, "index.html"), "utf8");

function localFontReferences(document) {
  const cssUrls = Array.from(
    document.matchAll(/url\(\s*["']?([^\s)"']+\.woff2(?:[?#][^\s)"']*)?)["']?\s*\)/gi),
    ([, url]) => url,
  );
  const preloadUrls = Array.from(
    document.matchAll(/<link\b[^>]*\bhref=["']([^"']+\.woff2(?:[?#][^"']*)?)["'][^>]*\bas=["']font["'][^>]*>/gi),
    ([, url]) => url,
  );
  return [...new Set([...cssUrls, ...preloadUrls])];
}

function portableFontPath(url) {
  const decoded = decodeURIComponent(url);
  assert.doesNotMatch(decoded, /^(?:https?:)?\/\//i, `font must not use a remote URL: ${url}`);
  assert.doesNotMatch(decoded, /^(?:file:|[A-Za-z]:[\\/]|\\)/i, `font must not use an absolute local path: ${url}`);
  assert.match(
    decoded,
    /^\/(?:fonts|assets\/_vinext_fonts)\/[A-Za-z0-9._/-]+\.woff2$/,
    `font must be packaged beneath /fonts or /assets/_vinext_fonts: ${url}`,
  );
  assert.doesNotMatch(decoded, /(?:^|\/)\.\.(?:\/|$)/, `font path must not traverse directories: ${url}`);
  return decoded.slice(1);
}

assert.match(html, /LaunchLift Practice App/);
assert.match(html, /One safe app\. All 28 possibilities\./);
assert.doesNotMatch(html, /http-equiv="refresh"/i);
assert.doesNotMatch(html, /launchlift-practice-app\.seelenbinder\.chatgpt\.site\//);
assert.doesNotMatch(html, /url\((?:file:\/\/)?[A-Za-z]:[\\/]/);

const fontReferences = localFontReferences(html);
assert.ok(fontReferences.length > 0, "the Android bundle must reference packaged local fonts");
for (const fontReference of fontReferences) {
  await access(path.join(bundleDirectory, portableFontPath(fontReference)));
}

const assetNames = await readdir(path.join(bundleDirectory, "assets"));
const practiceAsset = assetNames.find((name) => /^PracticeApp-[\w-]+\.js$/.test(name));
assert.ok(practiceAsset, "the locally bundled Practice UI entry must exist");

for (const relativePath of [
  `assets/${practiceAsset}`,
  "runners/practice-background.js",
]) {
  await access(path.join(bundleDirectory, relativePath));
}

console.log("Android web bundle is local, portable, and contains the native Practice assets.");
