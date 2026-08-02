"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const REVISION = "1.2.0";
const STORAGE_KEY = "launchlift-practice-runs-v1";

type TestKey = "camera" | "location" | "notifications" | "share" | "clipboard" | "vibration" | "export";
type TestState = "ready" | "passed" | "blocked";
type NativeKey = "camera" | "location" | "notifications" | "share" | "clipboard" | "haptics";
type AuthorityMode = "guided" | "full-safe";

type PracticeRun = {
  id: string;
  name: string;
  createdAt: string;
  revision: string;
  tests: Partial<Record<TestKey, TestState>>;
  nativeSelections?: NativeKey[];
  authorityMode?: AuthorityMode;
};

const labItems: Array<{ key: TestKey; icon: string; title: string; description: string; action: string }> = [
  { key: "camera", icon: "01", title: "Camera", description: "Capture a real photo so wrapper permissions and upload behavior can be checked.", action: "Open camera" },
  { key: "location", icon: "02", title: "Location", description: "Request coordinates and confirm the app explains permission outcomes clearly.", action: "Test location" },
  { key: "notifications", icon: "03", title: "Notifications", description: "Exercise the browser permission path before native push credentials are connected.", action: "Request permission" },
  { key: "share", icon: "04", title: "Native share", description: "Open the phone share sheet when available and fall back safely on desktop.", action: "Share practice app" },
  { key: "clipboard", icon: "05", title: "Clipboard", description: "Copy a practice-run reference for support, QA or a LaunchLiftAI handoff.", action: "Copy run reference" },
  { key: "vibration", icon: "06", title: "Haptics", description: "Use vibration as a lightweight proxy before a native haptics plugin is packaged.", action: "Test vibration" },
  { key: "export", icon: "07", title: "File export", description: "Download a JSON evidence file without sending personal or production data anywhere.", action: "Export evidence" },
];

const nativeOptions: Array<{ key: NativeKey; label: string }> = [
  { key: "camera", label: "Camera" },
  { key: "location", label: "Location" },
  { key: "notifications", label: "Notifications" },
  { key: "share", label: "Native share" },
  { key: "clipboard", label: "Clipboard" },
  { key: "haptics", label: "Haptics" },
];

const expectedOutputs = [
  ["PWA", "Installable web app"],
  ["Android APK", "Real-device testing"],
  ["Android AAB", "Play delivery package"],
  ["Chrome extension", "Browser package"],
  ["Firefox handoff", "Store-ready guidance"],
  ["Store assets", "Icons, screenshots and copy"],
] as const;

function makeRun(index: number): PracticeRun {
  return {
    id: crypto.randomUUID?.() ?? `run-${Date.now()}-${index}`,
    name: `Practice run ${index}`,
    createdAt: new Date().toISOString(),
    revision: REVISION,
    tests: {},
    nativeSelections: [],
    authorityMode: "guided",
  };
}

export function PracticeApp() {
  const [runs, setRuns] = useState<PracticeRun[]>([]);
  const [activeId, setActiveId] = useState("");
  const [compareOpen, setCompareOpen] = useState(false);
  const [message, setMessage] = useState("Choose any test. Nothing here touches a real store listing.");
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PracticeRun[];
      const requestedNewRun = new URLSearchParams(location.search).get("action") === "new-run";
      const initial = stored.length ? stored : [makeRun(1)];
      const next = requestedNewRun ? [makeRun(initial.length + 1), ...initial] : initial;
      // This effect intentionally hydrates state from the browser's persisted practice runs.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRuns(next);
      setActiveId(next[0].id);
      if (requestedNewRun) history.replaceState(null, "", location.pathname);
    } catch {
      const first = makeRun(1);
      setRuns([first]);
      setActiveId(first.id);
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    if (runs.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  }, [runs]);

  const active = useMemo(() => runs.find((run) => run.id === activeId) ?? runs[0], [runs, activeId]);
  const passed = active ? Object.values(active.tests).filter((value) => value === "passed").length : 0;
  const progress = Math.round((passed / labItems.length) * 100);
  const completedRuns = runs.filter((run) => Object.values(run.tests).some((value) => value === "passed")).length;

  function createRun() {
    const next = makeRun(runs.length + 1);
    setRuns((current) => [next, ...current]);
    setActiveId(next.id);
    setCompareOpen(false);
    setMessage(`${next.name} started from the untouched revision ${REVISION} template.`);
  }

  function updateTest(key: TestKey, state: TestState, nextMessage: string) {
    setRuns((current) => current.map((run) => run.id === active?.id ? { ...run, tests: { ...run.tests, [key]: state } } : run));
    setMessage(nextMessage);
  }

  function resetRun() {
    if (!active) return;
    setRuns((current) => current.map((run) => run.id === active.id ? { ...run, tests: {} } : run));
    setMessage(`${active.name} was reset. The original template and your other runs were not changed.`);
  }

  function toggleNativeSelection(key: NativeKey) {
    if (!active) return;
    setRuns((current) => current.map((run) => {
      if (run.id !== active.id) return run;
      const selected = run.nativeSelections ?? [];
      return {
        ...run,
        nativeSelections: selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key],
      };
    }));
  }

  function setAuthorityMode(authorityMode: AuthorityMode) {
    if (!active) return;
    setRuns((current) => current.map((run) => run.id === active.id ? { ...run, authorityMode } : run));
  }

  async function runTest(key: TestKey) {
    if (!active) return;
    try {
      if (key === "camera") {
        cameraRef.current?.click();
        return;
      }
      if (key === "location") {
        if (!navigator.geolocation) throw new Error("Location is unavailable in this browser.");
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => updateTest(key, "passed", `Location responded near ${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}.`),
          () => updateTest(key, "blocked", "Location permission was declined or unavailable. LaunchLiftAI should preserve this as a clear owner decision."),
          { timeout: 9000 },
        );
        return;
      }
      if (key === "notifications") {
        if (!("Notification" in window)) throw new Error("Notifications are unavailable in this browser.");
        const permission = await Notification.requestPermission();
        updateTest(key, permission === "granted" ? "passed" : "blocked", `Notification permission returned: ${permission}.`);
        return;
      }
      if (key === "share") {
        if (!navigator.share) throw new Error("The native share sheet is unavailable here.");
        await navigator.share({ title: "LaunchLift Practice App", text: "A safe LaunchLiftAI practice run", url: location.href });
        updateTest(key, "passed", "The native share sheet opened successfully.");
        return;
      }
      if (key === "clipboard") {
        await navigator.clipboard.writeText(`LaunchLift practice evidence: ${active.name} · revision ${active.revision}`);
        updateTest(key, "passed", "Practice-run reference copied to the clipboard.");
        return;
      }
      if (key === "vibration") {
        if (!navigator.vibrate) throw new Error("Vibration is unavailable on this device.");
        navigator.vibrate([60, 40, 60]);
        updateTest(key, "passed", "The vibration request was sent to the device.");
        return;
      }
      const evidence = JSON.stringify({ app: "LaunchLift Practice App", templateRevision: REVISION, run: active }, null, 2);
      const url = URL.createObjectURL(new Blob([evidence], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${active.name.toLowerCase().replaceAll(" ", "-")}-evidence.json`;
      link.click();
      URL.revokeObjectURL(url);
      updateTest(key, "passed", "A private practice evidence file was downloaded to this device.");
    } catch (error) {
      updateTest(key, "blocked", error instanceof Error ? error.message : "This capability is unavailable here.");
    }
  }

  return (
    <div className="practice-shell" data-practice-revision={REVISION}>
      <header className="practice-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">L</div>
          <div><strong>LaunchLift Practice App</strong><small>Reusable launch sandbox</small></div>
        </div>
        <span className="safe-badge">Original always preserved</span>
      </header>

      <main className="practice-main">
        <section className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Practice before you commit</span>
            <h1>Learn the launch flow safely.</h1>
            <p>Use a disposable copy to scan, improve, package and test. Repeat as often as you like. Your real app and the original practice template stay untouched.</p>
            <div className="hero-points" aria-label="Practice app guarantees">
              <span>No billing</span><span>No store submission</span><span>No real customer data</span><span>Reset anytime</span>
            </div>
          </div>

          <aside className="run-panel" aria-label="Practice run controls">
            <div><span className="panel-kicker">Your sandbox</span><h2>{active?.name ?? "Preparing run"}</h2></div>
            <div className="run-card">
              <div className="run-card-top">
                <div><strong>Revision {active?.revision ?? REVISION}</strong><small>{active ? new Date(active.createdAt).toLocaleString() : "Starting now"}</small></div>
                <span className="run-chip">{passed}/{labItems.length} passed</span>
              </div>
              <div className="progress-track" aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>
              <small>{message}</small>
            </div>
            <label className="run-picker">
              <span>Saved practice runs</span>
              <select value={active?.id ?? ""} onChange={(event) => setActiveId(event.currentTarget.value)}>
                {runs.map((run) => {
                  const runPassed = Object.values(run.tests).filter((value) => value === "passed").length;
                  return <option key={run.id} value={run.id}>{run.name} · {runPassed}/{labItems.length} passed</option>;
                })}
              </select>
              <small>{runs.length} reusable run{runs.length === 1 ? "" : "s"} saved on this device · {completedRuns} with evidence</small>
            </label>
            <div className="run-actions">
              <button className="button-primary" onClick={createRun}>Start new run</button>
              <button className="button-secondary" onClick={() => setCompareOpen((value) => !value)}>Compare original</button>
              <button className="text-button" onClick={resetRun}>Reset this run</button>
              <button className="text-button" onClick={() => setActiveId(runs.at(-1)?.id ?? activeId)}>Open first run</button>
            </div>
            {compareOpen ? <div className="compare-drawer"><strong>Immutable original · revision {REVISION}</strong><ul><li>No test results stored</li><li>No permissions granted</li><li>No generated assets attached</li><li>Ready to clone again</li></ul></div> : null}
          </aside>
        </section>

        <section className="guide-grid" aria-label="How practice works">
          <article className="guide-card"><span className="guide-number">1</span><h3>Clone a run</h3><p>LaunchLiftAI works on a fresh practice copy, never this preserved original.</p></article>
          <article className="guide-card"><span className="guide-number">2</span><h3>Try the workflow</h3><p>Scan, select phone features, generate assets, rerun and inspect every output.</p></article>
          <article className="guide-card"><span className="guide-number">3</span><h3>Build confidence</h3><p>Reset or start again until the steps make sense, then connect your real app.</p></article>
        </section>

        <section className="rehearsal-section" aria-labelledby="rehearsal-heading">
          <div className="section-heading"><div><span className="panel-kicker">Launch rehearsal</span><h2 id="rehearsal-heading">Choose what LaunchLiftAI should build</h2></div><p>These choices stay inside this saved practice run. They teach the packaging workflow without changing the immutable original.</p></div>
          <div className="rehearsal-grid">
            <article className="rehearsal-card">
              <span className="card-label">Native phone functions</span>
              <div className="choice-grid">
                {nativeOptions.map((option) => {
                  const selected = active?.nativeSelections?.includes(option.key) ?? false;
                  return <button key={option.key} className={`choice-button ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => toggleNativeSelection(option.key)}><span aria-hidden="true">{selected ? "✓" : "+"}</span>{option.label}</button>;
                })}
              </div>
              <small>{active?.nativeSelections?.length ?? 0} selected for this run</small>
            </article>
            <article className="rehearsal-card">
              <span className="card-label">AI Helper authority</span>
              <div className="authority-options" role="group" aria-label="AI Helper authority mode">
                <button aria-pressed={(active?.authorityMode ?? "guided") === "guided"} onClick={() => setAuthorityMode("guided")}><strong>Guided</strong><small>Explain actions and pause at owner gates.</small></button>
                <button aria-pressed={active?.authorityMode === "full-safe"} onClick={() => setAuthorityMode("full-safe")}><strong>Full safe authority</strong><small>Implement, rerun and verify routine work automatically.</small></button>
              </div>
              <p className="authority-note">Full safe authority never includes credentials, payments, signing, legal declarations, final submission or public rollout.</p>
            </article>
          </div>
          <article className="agent-cycle">
            <div><span>1</span><strong>Codex updates source</strong><small>Change the practice copy through the connected repository.</small></div>
            <div><span>2</span><strong>MCP or ACP reports activity</strong><small>Keep each change and tool result visible.</small></div>
            <div><span>3</span><strong>LaunchLiftAI reruns</strong><small>Rescan, regenerate assets and rebuild selected packages.</small></div>
            <div><span>4</span><strong>You inspect evidence</strong><small>Compare outputs, then repeat or reset safely.</small></div>
          </article>
          <div className="output-grid" aria-label="Expected LaunchLiftAI outputs">
            {expectedOutputs.map(([name, purpose]) => <article key={name}><span aria-hidden="true">→</span><div><strong>{name}</strong><small>{purpose}</small></div></article>)}
          </div>
        </section>

        <section className="lab-section" id="device-lab">
          <div className="section-heading"><div><span className="panel-kicker">Device lab</span><h2>Seven safe capability checks</h2></div><p>Each result becomes simple evidence that can be compared between the web app, packaged Android app and browser extension.</p></div>
          <div className="lab-grid">
            {labItems.map((item) => {
              const state = active?.tests[item.key] ?? "ready";
              return <article className="lab-card" key={item.key}>
                <div className="lab-card-top"><span className="lab-icon">{item.icon}</span><span className={`status-pill ${state}`}>{state}</span></div>
                <h3>{item.title}</h3><p>{item.description}</p>
                <button className="lab-action" onClick={() => runTest(item.key)}>{item.action}</button>
              </article>;
            })}
          </div>
          <input ref={cameraRef} className="hidden-file" type="file" accept="image/*" capture="environment" onChange={(event) => {
            const file = event.target.files?.[0];
            updateTest("camera", file ? "passed" : "blocked", file ? `Camera supplied ${file.name}. The image stays on this device.` : "No image was selected.");
          }} />
        </section>

        <section className="boundary-card">
          <span className="boundary-mark">!</span>
          <div><h3>Full authority has a clear safety boundary</h3><p>The practice Agent may change code, rerun scans, create assets and packages, and verify outputs. Account passwords, payments, signing keys, legal declarations, final submissions and public rollouts still pause for the owner.</p></div>
        </section>
        <p className="footer-note">Practice template {REVISION} · Codex update proof ready for a LaunchLiftAI rerun</p>
      </main>
    </div>
  );
}
