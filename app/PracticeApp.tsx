"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  implementationChannels,
  nativeCapabilities,
  outputOptions,
  storeOptions,
  type ImplementationChannel,
  type NativeKey,
  type OutputKey,
  type StoreKey,
} from "./practiceCatalog";

const REVISION = "1.3.0";
const STORAGE_KEY = "launchlift-practice-runs-v2";

type TestKey = NativeKey;
type TestState = "ready" | "passed" | "handoff" | "blocked";
type AuthorityMode = "guided" | "full-safe";

type PracticeRun = {
  id: string;
  name: string;
  createdAt: string;
  revision: string;
  tests: Partial<Record<TestKey, TestState>>;
  nativeSelections?: NativeKey[];
  outputSelections?: OutputKey[];
  storeSelections?: StoreKey[];
  implementationChannel?: ImplementationChannel;
  authorityMode?: AuthorityMode;
};

const labItems = nativeCapabilities.map((capability, index) => ({
  ...capability,
  icon: String(index + 1).padStart(2, "0"),
}));

function makeRun(index: number): PracticeRun {
  return {
    id: crypto.randomUUID?.() ?? `run-${Date.now()}-${index}`,
    name: `Practice run ${index}`,
    createdAt: new Date().toISOString(),
    revision: REVISION,
    tests: {},
    nativeSelections: [],
    outputSelections: [],
    storeSelections: [],
    implementationChannel: "codex-mcp",
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
  const completed = active ? Object.values(active.tests).filter((value) => value === "passed" || value === "handoff").length : 0;
  const progress = Math.round((completed / labItems.length) * 100);
  const completedRuns = runs.filter((run) => Object.values(run.tests).some((value) => value === "passed" || value === "handoff")).length;

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

  function toggleOutputSelection(key: OutputKey) {
    if (!active) return;
    setRuns((current) => current.map((run) => {
      if (run.id !== active.id) return run;
      const selected = run.outputSelections ?? [];
      return { ...run, outputSelections: selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key] };
    }));
  }

  function toggleStoreSelection(key: StoreKey) {
    if (!active) return;
    setRuns((current) => current.map((run) => {
      if (run.id !== active.id) return run;
      const selected = run.storeSelections ?? [];
      return { ...run, storeSelections: selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key] };
    }));
  }

  function setImplementationChannel(implementationChannel: ImplementationChannel) {
    if (!active) return;
    setRuns((current) => current.map((run) => run.id === active.id ? { ...run, implementationChannel } : run));
  }

  function setAuthorityMode(authorityMode: AuthorityMode) {
    if (!active) return;
    setRuns((current) => current.map((run) => run.id === active.id ? { ...run, authorityMode } : run));
  }

  function prepareImplementationBrief() {
    if (!active) return;
    const channel = implementationChannels.find((option) => option.key === active.implementationChannel)?.label ?? "selected builder";
    setMessage(
      `${channel} brief prepared: ${active.nativeSelections?.length ?? 0}/28 native functions, ${active.outputSelections?.length ?? 0}/${outputOptions.length} outputs and ${active.storeSelections?.length ?? 0}/${storeOptions.length} destinations. Review scope before sending.`,
    );
  }

  async function runTest(key: TestKey) {
    if (!active) return;
    try {
      if (key === "camera") {
        cameraRef.current?.click();
        return;
      }
      if (key === "push") {
        const ready = "serviceWorker" in navigator && "Notification" in window;
        updateTest(key, ready ? "handoff" : "blocked", ready
          ? "Web push prerequisites are present. Firebase credentials, token registration and a real-device delivery test remain in the native implementation contract."
          : "This browser cannot preview push prerequisites; the native Firebase handoff was recorded.");
        return;
      }
      if (key === "media") {
        updateTest(key, "passed", "Browser media selection is available. Native photo-library permission and Android device evidence remain scoped to the selected implementation.");
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
      if (key === "bluetooth") {
        updateTest(key, "handoff", "Bluetooth capability was recorded without opening a pairing prompt. The native implementation must define devices, permissions and a real pairing test.");
        return;
      }
      if (key === "nfc") {
        updateTest(key, "handoff", "NFC capability was recorded. Android reader/writer behavior and device testing belong in the native implementation contract.");
        return;
      }
      if (key === "sensors") {
        const ready = "DeviceMotionEvent" in window || "DeviceOrientationEvent" in window;
        updateTest(key, ready ? "passed" : "handoff", ready ? "Motion or orientation sensor APIs are visible." : "Browser sensor APIs are unavailable; native sensor setup and device testing were recorded.");
        return;
      }
      if (key === "biometrics") {
        const available = typeof PublicKeyCredential !== "undefined" && typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
          ? await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          : false;
        updateTest(key, available ? "passed" : "handoff", available ? "A platform authenticator is available; no credential was created." : "A native biometric lock and secure fallback must be implemented and tested on-device.");
        return;
      }
      if (key === "localNotifications") {
        if (!("Notification" in window)) throw new Error("Notifications are unavailable in this browser.");
        const permission = await Notification.requestPermission();
        updateTest(key, permission === "granted" ? "passed" : "blocked", `Local notification permission returned: ${permission}. Native scheduling still requires an Android device check.`);
        return;
      }
      if (key === "share") {
        if (!navigator.share) throw new Error("The native share sheet is unavailable here.");
        await navigator.share({ title: "LaunchLift Practice App", text: "A safe LaunchLiftAI practice run", url: location.href });
        updateTest(key, "passed", "The native share sheet opened successfully.");
        return;
      }
      if (key === "deepLinks") {
        history.replaceState(null, "", `${location.pathname}${location.search}#device-lab`);
        updateTest(key, "passed", "The HTTPS practice route resolved. Android intent filters and assetlinks verification remain part of the native package test.");
        return;
      }
      if (key === "offline") {
        const ready = "serviceWorker" in navigator && typeof localStorage !== "undefined";
        updateTest(key, ready ? "passed" : "blocked", ready ? "Practice-run state and the service-worker path are available for offline recovery." : "Offline prerequisites are unavailable in this browser.");
        return;
      }
      if (key === "background") {
        updateTest(key, "handoff", "The service-worker handoff is recorded. Native background work still needs a bounded task, retry policy, battery review and device proof.");
        return;
      }
      if (key === "voice") {
        const ready = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
        updateTest(key, ready ? "passed" : "handoff", ready ? "Speech recognition is supported; microphone access was not requested automatically." : "Voice input requires a native or provider-specific implementation and permission test.");
        return;
      }
      if (key === "video") {
        const ready = Boolean(navigator.mediaDevices?.getUserMedia);
        updateTest(key, ready ? "passed" : "handoff", ready ? "Video capture APIs are available; recording was not started automatically." : "Video capture requires a native implementation and device permission test.");
        return;
      }
      if (key === "network") {
        updateTest(key, "passed", `Network state is ${navigator.onLine ? "online" : "offline"}. The native build must verify reconnect and retry behavior.`);
        return;
      }
      if (key === "appLauncher") {
        updateTest(key, "handoff", "An external-app launch was not triggered. The implementation brief must name allowed schemes, fallbacks and owner-approved destinations.");
        return;
      }
      if (key === "browser") {
        updateTest(key, "handoff", "The trusted-browser handoff is ready to implement. OAuth return URLs, allowed domains and resume behavior require packaged-app evidence.");
        return;
      }
      if (key === "clipboard") {
        await navigator.clipboard.writeText(`LaunchLift practice evidence: ${active.name} · revision ${active.revision}`);
        updateTest(key, "passed", "Practice-run reference copied to the clipboard.");
        return;
      }
      if (key === "haptics") {
        if (!navigator.vibrate) throw new Error("Vibration is unavailable on this device.");
        navigator.vibrate([60, 40, 60]);
        updateTest(key, "passed", "The vibration request was sent to the device.");
        return;
      }
      if (key === "files") {
        const evidence = JSON.stringify({ app: "LaunchLift Practice App", templateRevision: REVISION, run: active }, null, 2);
        const url = URL.createObjectURL(new Blob([evidence], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${active.name.toLowerCase().replaceAll(" ", "-")}-evidence.json`;
        link.click();
        URL.revokeObjectURL(url);
        updateTest(key, "passed", "A private practice evidence file was downloaded to this device.");
        return;
      }
      if (key === "barcode") {
        const ready = "BarcodeDetector" in window;
        updateTest(key, ready ? "passed" : "handoff", ready ? "Barcode detection is available; the camera was not opened automatically." : "Native QR/barcode scanning and camera permission evidence were added to the handoff.");
        return;
      }
      if (key === "maps") {
        updateTest(key, "passed", "A safe maps handoff can be generated from selected coordinates; no external maps app was opened.");
        return;
      }
      if (key === "keyboard") {
        updateTest(key, window.visualViewport ? "passed" : "handoff", window.visualViewport ? "Visual viewport support is available for mobile-keyboard layout checks." : "Native keyboard resize and focus behavior require packaged-app testing.");
        return;
      }
      if (key === "deviceInfo") {
        updateTest(key, "passed", `Safe device context recorded: ${navigator.platform || "platform unavailable"}, ${navigator.language}. No persistent fingerprint was created.`);
        return;
      }
      if (key === "privacyScreen") {
        updateTest(key, "handoff", "Visibility handling is present, but screenshot blocking is native-only and must be verified on the sensitive Android screens selected by the owner.");
        return;
      }
      if (key === "screenReader") {
        const ready = Boolean(document.querySelector("main") && document.querySelector('[aria-live="polite"]'));
        updateTest(key, ready ? "passed" : "blocked", ready ? "Main landmarks, labels and a polite live status region are present." : "Accessibility landmarks or live status content are missing.");
        return;
      }
      updateTest(key, "passed", "Practice confirmation shown. The packaged app can map this interaction to a native toast.");
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
                <span className="run-chip">{completed}/{labItems.length} checked</span>
              </div>
              <div className="progress-track" aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>
              <small aria-live="polite">{message}</small>
            </div>
            <label className="run-picker">
              <span>Saved practice runs</span>
              <select value={active?.id ?? ""} onChange={(event) => setActiveId(event.currentTarget.value)}>
                {runs.map((run) => {
                  const runCompleted = Object.values(run.tests).filter((value) => value === "passed" || value === "handoff").length;
                  return <option key={run.id} value={run.id}>{run.name} · {runCompleted}/{labItems.length} checked</option>;
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
              <div className="card-heading-row">
                <span className="card-label">Native phone functions</span>
                <div><button className="mini-action" onClick={() => setRuns((current) => current.map((run) => run.id === active?.id ? { ...run, nativeSelections: nativeCapabilities.map((item) => item.key) } : run))}>Select all 28</button><button className="mini-action" onClick={() => setRuns((current) => current.map((run) => run.id === active?.id ? { ...run, nativeSelections: [] } : run))}>Clear</button></div>
              </div>
              <div className="choice-grid">
                {nativeCapabilities.map((option) => {
                  const selected = active?.nativeSelections?.includes(option.key) ?? false;
                  return <button key={option.key} className={`choice-button ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => toggleNativeSelection(option.key)}><span aria-hidden="true">{selected ? "✓" : "+"}</span>{option.label}</button>;
                })}
              </div>
              <small>{active?.nativeSelections?.length ?? 0}/28 selected for this run</small>
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
          <div className="delivery-grid">
            <article className="rehearsal-card">
              <span className="card-label">Choose generated outputs</span>
              <div className="choice-grid compact-choices">
                {outputOptions.map((option) => {
                  const selected = active?.outputSelections?.includes(option.key) ?? false;
                  return <button key={option.key} className={`choice-button ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => toggleOutputSelection(option.key)}><span aria-hidden="true">{selected ? "✓" : "+"}</span><strong>{option.label}</strong><small>{option.purpose}</small></button>;
                })}
              </div>
              <small>{active?.outputSelections?.length ?? 0}/{outputOptions.length} outputs selected</small>
            </article>
            <article className="rehearsal-card">
              <span className="card-label">Choose destinations</span>
              <div className="choice-grid compact-choices">
                {storeOptions.map((option) => {
                  const selected = active?.storeSelections?.includes(option.key) ?? false;
                  return <button key={option.key} className={`choice-button ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => toggleStoreSelection(option.key)}><span aria-hidden="true">{selected ? "✓" : "+"}</span>{option.label}</button>;
                })}
              </div>
              <small>{active?.storeSelections?.length ?? 0}/{storeOptions.length} destinations selected</small>
            </article>
          </div>
          <article className="implementation-card">
            <div className="section-heading compact-heading"><div><span className="panel-kicker">Implement for me</span><h3>Choose how LaunchLiftAI should deliver the work</h3></div><p>Every route uses the same scoped contract: selected features, allowed files, outputs, tests, evidence and owner gates.</p></div>
            <div className="implementation-options" role="radiogroup" aria-label="Implementation channel">
              {implementationChannels.map((option) => <button key={option.key} role="radio" aria-checked={(active?.implementationChannel ?? "codex-mcp") === option.key} onClick={() => setImplementationChannel(option.key)}><strong>{option.label}</strong><small>{option.detail}</small></button>)}
            </div>
            <div className="implementation-review"><div><strong>Review before sending</strong><small>{active?.nativeSelections?.length ?? 0} native functions · {active?.outputSelections?.length ?? 0} outputs · {active?.storeSelections?.length ?? 0} destinations · {(active?.authorityMode ?? "guided") === "full-safe" ? "Full safe authority" : "Guided"}</small></div><button className="button-primary" onClick={prepareImplementationBrief}>Prepare implementation brief</button></div>
          </article>
          <article className="agent-cycle">
            <div><span>1</span><strong>You approve the scope</strong><small>See the exact features, outputs, destinations and files before execution.</small></div>
            <div><span>2</span><strong>MCP, ACP or builder adapter works</strong><small>Codex or the selected no-code platform receives one structured contract.</small></div>
            <div><span>3</span><strong>LaunchLiftAI reruns</strong><small>Rescan, regenerate assets and rebuild selected packages.</small></div>
            <div><span>4</span><strong>You see progress and evidence</strong><small>Resume after owner gates, compare outputs, then repeat or reset safely.</small></div>
          </article>
          <div className="output-grid" aria-label="Expected LaunchLiftAI outputs">
            {outputOptions.map((option) => <article key={option.key}><span aria-hidden="true">→</span><div><strong>{option.label}</strong><small>{option.purpose}</small></div></article>)}
          </div>
        </section>

        <section className="lab-section" id="device-lab">
          <div className="section-heading"><div><span className="panel-kicker">Device lab</span><h2>All 28 capability checks</h2></div><p>Each result distinguishes browser proof from a native implementation or real-device handoff. Unsupported browser APIs are never presented as completed native work.</p></div>
          <div className="lab-grid">
            {labItems.map((item) => {
              const state = active?.tests[item.key] ?? "ready";
              return <article className="lab-card" key={item.key} data-capability={item.key}>
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
          <div><h3>Full authority has a clear safety boundary</h3><p>The practice Agent may change code, send an approved implementation contract through MCP, ACP or a supported builder adapter, rerun scans, create assets and packages, and verify outputs. Account passwords, payments, signing keys, legal declarations, final submissions and public rollouts still pause for the owner.</p></div>
        </section>
        <p className="footer-note">Practice template {REVISION} · Codex update proof ready for a LaunchLiftAI rerun</p>
      </main>
    </div>
  );
}
