// This runner is copied into the generated local web bundle before Capacitor
// sync. Keeping it outside the generated directory makes native builds
// reproducible and avoids a release redirecting to the hosted Practice site.
addEventListener("practiceBackgroundProbe", (resolve, reject, args) => {
  const runId = typeof args?.runId === "string" ? args.runId : "";
  if (!runId.startsWith("practice-")) {
    reject(new Error("A valid user-triggered Practice run ID is required."));
    return;
  }
  resolve({ acknowledged: true, runId });
});
