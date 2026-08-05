export const nativeHarnessCapabilityIds = [
  "camera", "media", "share", "clipboard", "haptics", "toast",
  "sensors", "biometrics", "deepLinks", "offline", "background", "voice",
] as const;

export type NativeHarnessCapabilityId = typeof nativeHarnessCapabilityIds[number];
export type NativeHarnessResult = {
  status: "idle" | "running" | "passed" | "blocked";
  message: string;
};

export function idleNativeHarnessResults(): Record<NativeHarnessCapabilityId, NativeHarnessResult> {
  return Object.fromEntries(
    nativeHarnessCapabilityIds.map((capability) => [capability, { status: "idle", message: "Not tested on this device." }]),
  ) as Record<NativeHarnessCapabilityId, NativeHarnessResult>;
}

export function nativeHarnessFailure(error: unknown): NativeHarnessResult {
  const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "Native action unavailable.";
  if (/cancel|dismiss|user aborted/iu.test(detail)) {
    return { status: "idle", message: "Canceled safely. No device data was kept." };
  }
  if (/denied|permission|not authorized/iu.test(detail)) {
    return { status: "blocked", message: "Permission was denied. Enable it in phone settings, then try again." };
  }
  if (/not implemented|unavailable|unsupported|not available/iu.test(detail)) {
    return { status: "blocked", message: "This native action is unavailable in the current converted build." };
  }
  return { status: "blocked", message: `The native action did not complete: ${detail}` };
}

export function passedNativeHarnessResult(message: string): NativeHarnessResult {
  return { status: "passed", message };
}

export function isTrustedPracticeAppLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "launchlift-practice-app.seelenbinder.chatgpt.site";
  } catch {
    return false;
  }
}
