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
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
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
