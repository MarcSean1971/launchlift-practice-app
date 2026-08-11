"use client";

import { nativeCapabilities, practiceConversionContract } from "./practiceCatalog";
import { NativeTestHarness } from "./NativeTestHarness";

const REVISION = "1.3.1";

export function PracticeApp() {
  return (
    <div className="practice-shell" data-practice-revision={REVISION}>
      <header className="practice-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">L</div>
          <div><strong>LaunchLift Practice App</strong><small>Reusable source app</small></div>
        </div>
        <span className="safe-badge">Original preserved</span>
      </header>

      <main className="practice-main">
        <section className="hero-copy source-hero">
          <span className="eyebrow">Practice before your real app</span>
          <h1>One safe app. All 28 possibilities.</h1>
          <p>This unchanged web app is the input for a LaunchLiftAI practice run. Review the 28 native functions below, then import this URL or its GitHub repository into LaunchLiftAI.</p>
          <div className="hero-points" aria-label="Practice app guarantees">
            <span>No native functions selected here</span><span>No packages generated here</span><span>No store submission</span>
          </div>
        </section>

        <section className="guide-grid" aria-label="Practice workflow">
          <article className="guide-card"><span className="guide-number">1</span><h2>Import</h2><p>Add this URL or GitHub repository inside LaunchLiftAI.</p></article>
          <article className="guide-card"><span className="guide-number">2</span><h2>Select</h2><p>Choose zero through all 28 functions, outputs, assets and stores in LaunchLiftAI.</p></article>
          <article className="guide-card"><span className="guide-number">3</span><h2>Implement and test</h2><p>Send instructions manually, through MCP or ACP; rescan, download from LaunchLiftAI, then test on the phone or browser.</p></article>
        </section>

        <section className="conversion-brief" aria-labelledby="conversion-brief-heading">
          <div>
            <span className="panel-kicker">Conversion handoff contract</span>
            <h2 id="conversion-brief-heading">Build the selected features for the selected targets.</h2>
            <p>{practiceConversionContract.evidenceRule}</p>
            <p>{practiceConversionContract.deliveryRule}</p>
          </div>
          <ul aria-label="Supported conversion outputs">
            {practiceConversionContract.outputs.map((output) => <li key={output}>{output}</li>)}
          </ul>
        </section>

        <section className="lab-section" id="native-functions" aria-labelledby="native-functions-heading">
          <div className="section-heading">
            <div><span className="panel-kicker">Source capability catalogue</span><h2 id="native-functions-heading">All 28 native functions</h2></div>
            <p>Tap any function for a short explanation. These are options for LaunchLiftAI to implement later—not claims that this untouched web app already has native code.</p>
          </div>
          <div className="capability-list">
            {nativeCapabilities.map((item, index) => (
              <details className="capability-item" key={item.key} data-capability={item.key}>
                <summary>
                  <span className="lab-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <span className="tooltip-cue">What it does</span>
                </summary>
                <p>{item.description}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="boundary-card">
          <span className="boundary-mark">→</span>
          <div><h2>Everything else happens in LaunchLiftAI.</h2><p>Selection, manual/MCP/ACP instructions, code-change verification, asset generation, package downloads, store handoffs and post-conversion device or extension testing all belong to the LaunchLiftAI workflow.</p></div>
        </section>
        <NativeTestHarness />
        <p className="footer-note">Practice source revision {REVISION} · ready to import into LaunchLiftAI</p>
      </main>
    </div>
  );
}
