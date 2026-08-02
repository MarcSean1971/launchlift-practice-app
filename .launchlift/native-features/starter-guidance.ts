/*
LaunchLift native feature starter guidance.
This file is intentionally not imported automatically. It gives a developer, Codex, Cursor, Lovable, Bolt, Replit, or another builder a safe starting point without silently changing product behavior.
*/

export const launchLiftNativeFeatures = [
  "camera",
  "location",
  "share",
  "offline",
  "network",
  "clipboard",
  "files",
  "haptics",
  "localNotifications"
] as const;

export type LaunchLiftNativeFeature = typeof launchLiftNativeFeatures[number];

export const launchLiftNativeRule = "Only mark a native feature ready after the app code, external service setup, backend behavior, Play policy notes, and real Android device test evidence exist.";
