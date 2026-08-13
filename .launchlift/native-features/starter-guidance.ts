/*
LaunchLift native feature starter guidance.
This file is intentionally not imported automatically. It gives a developer, Codex, Cursor, Lovable, Bolt, Replit, or another builder a safe starting point without silently changing product behavior.
*/

export const launchLiftNativeFeatures = [
  "push",
  "camera",
  "media",
  "location",
  "bluetooth",
  "nfc",
  "sensors",
  "biometrics",
  "share",
  "deepLinks",
  "offline",
  "background",
  "voice",
  "video",
  "network",
  "appLauncher",
  "browser",
  "clipboard",
  "files",
  "haptics",
  "barcode",
  "localNotifications",
  "maps",
  "keyboard",
  "deviceInfo",
  "privacyScreen",
  "screenReader",
  "toast"
] as const;

export type LaunchLiftNativeFeature = typeof launchLiftNativeFeatures[number];

export const launchLiftNativeRule = "Only mark a native feature ready after the app code, external service setup, backend behavior, Play policy notes, and real Android device test evidence exist.";
