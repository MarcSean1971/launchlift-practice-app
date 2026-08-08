addEventListener("practiceBackgroundProbe", (resolve, reject, args) => {
  const runId = typeof args?.runId === "string" ? args.runId : "";
  if (!runId.startsWith("practice-")) {
    reject(new Error("A valid user-triggered Practice run ID is required."));
    return;
  }
  resolve({ acknowledged: true, runId });
});
