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
  assert.match(html, /Learn the launch flow safely\./);
  assert.match(html, /Original always preserved/);
  assert.match(html, /Start new run/);
  assert.match(html, /Seven safe capability checks/);
  assert.match(html, /Choose what LaunchLiftAI should build/);
  assert.match(html, /AI Helper authority/);
  assert.match(html, /Chrome extension/);
  assert.match(html, /Full authority has a clear safety boundary/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("declares an immutable template and repeatable disposable runs", async () => {
  const [metadataText, source] = await Promise.all([
    readFile(new URL("../public/launchlift-practice.json", import.meta.url), "utf8"),
    readFile(new URL("../app/PracticeApp.tsx", import.meta.url), "utf8"),
  ]);
  const metadata = JSON.parse(metadataText);

  assert.equal(metadata.immutableOriginal, true);
  assert.equal(metadata.repeatableRuns, true);
  assert.equal(metadata.revision, "1.2.0");
  assert.equal(metadata.sourceUpdateChannel, "codex-mcp-acp");
  assert.deepEqual(metadata.authorityModes, ["guided", "full-safe"]);
  assert.deepEqual(metadata.expectedOutputs, [
    "pwa",
    "android-apk",
    "android-aab",
    "chrome-extension",
    "firefox-handoff",
    "store-assets",
  ]);
  assert.match(source, /launchlift-practice-runs-v1/);
  assert.match(source, /function createRun\(\)/);
  assert.match(source, /untouched revision/);
  assert.match(source, /localStorage\.setItem/);
  assert.match(source, /nativeSelections/);
  assert.match(source, /authorityMode/);
  assert.match(source, /new URLSearchParams\(location\.search\)/);
});
