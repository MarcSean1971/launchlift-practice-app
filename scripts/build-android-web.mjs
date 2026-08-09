import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const clientDirectory = path.join(root, "dist", "client");
const outputDirectory = path.join(root, ".launchlift", "web");
const sourceRunnerDirectory = path.join(root, "android", "runners");
const outputRunnerDirectory = path.join(outputDirectory, "runners");
const fontDirectory = path.join(root, ".vinext", "fonts");
const outputFontDirectory = path.join(outputDirectory, "fonts");

async function renderPracticeHtml() {
  const workerUrl = pathToFileURL(path.join(root, "dist", "server", "index.js"));
  workerUrl.searchParams.set("androidBundle", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    throw new Error(`Practice HTML render failed with ${response.status}.`);
  }
  return response.text();
}

function makeFontUrlsPortable(html) {
  return html.replace(
    /url\((?:file:\/\/)?[^)]*?\.vinext[\\/]fonts[\\/]([^)]+)\)/g,
    (_match, fontPath) => `url(/fonts/${fontPath.replaceAll("\\", "/")})`,
  );
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });
await cp(sourceRunnerDirectory, outputRunnerDirectory, { recursive: true });
await cp(fontDirectory, outputFontDirectory, { recursive: true });

const html = makeFontUrlsPortable(await renderPracticeHtml());
if (html.includes("launchlift-practice-app.seelenbinder.chatgpt.site/")) {
  throw new Error("Android bundle must not retain the remote redirect URL.");
}
if (/url\((?:file:\/\/)?[A-Za-z]:[\\/]/.test(html)) {
  throw new Error("Android bundle contains an unsafe absolute local path.");
}

await writeFile(path.join(outputDirectory, "index.html"), html, "utf8");
console.log(`Prepared reproducible Android web bundle at ${path.relative(root, outputDirectory)}.`);
