export const nativeCapabilities = [
  { key: "push", label: "Push notifications", description: "Receive remote notifications after Firebase or another push provider is connected.", action: "Check push readiness" },
  { key: "camera", label: "Camera", description: "Capture a photo and verify camera permission handling.", action: "Open camera" },
  { key: "media", label: "Photo and media", description: "Choose media safely and preserve device-only evidence.", action: "Check media access" },
  { key: "location", label: "Location", description: "Request coordinates with a clear permission outcome.", action: "Test location" },
  { key: "bluetooth", label: "Bluetooth", description: "Discover whether Bluetooth is available before native pairing is implemented.", action: "Check Bluetooth" },
  { key: "nfc", label: "NFC", description: "Check NFC support and record the Android handoff when the browser cannot provide it.", action: "Check NFC" },
  { key: "sensors", label: "Motion sensors", description: "Check motion and orientation sensor availability.", action: "Check sensors" },
  { key: "biometrics", label: "Biometric lock", description: "Check secure device-authentication prerequisites without storing credentials.", action: "Check biometrics" },
  { key: "share", label: "Native share", description: "Open the device share sheet when it is available.", action: "Share practice app" },
  { key: "deepLinks", label: "App links", description: "Verify the HTTPS route that should reopen the installed app.", action: "Test app link" },
  { key: "offline", label: "Offline storage", description: "Verify the practice run survives refresh and has a service-worker path.", action: "Check offline state" },
  { key: "background", label: "Background work", description: "Check the service-worker handoff used before native background tasks are added.", action: "Check background path" },
  { key: "voice", label: "Voice input", description: "Check speech-recognition support before requesting microphone access.", action: "Check voice support" },
  { key: "video", label: "Video", description: "Check video capture and playback prerequisites without recording automatically.", action: "Check video support" },
  { key: "network", label: "Network awareness", description: "Record online state and connection information for safe retry behavior.", action: "Check network" },
  { key: "appLauncher", label: "Open other apps", description: "Prepare a controlled external-app handoff without launching anything automatically.", action: "Check app launcher" },
  { key: "browser", label: "In-app browser", description: "Check the trusted external-browser return path used for OAuth and help pages.", action: "Check browser handoff" },
  { key: "clipboard", label: "Clipboard", description: "Copy a non-sensitive practice-run reference.", action: "Copy run reference" },
  { key: "files", label: "Files", description: "Export a private JSON evidence file to this device.", action: "Export evidence" },
  { key: "haptics", label: "Haptics", description: "Request a short vibration when the device supports it.", action: "Test vibration" },
  { key: "barcode", label: "QR and barcode scan", description: "Check barcode detection before native camera scanning is packaged.", action: "Check scanner" },
  { key: "localNotifications", label: "Local notifications", description: "Check notification permission for on-device reminders.", action: "Check local alerts" },
  { key: "maps", label: "Maps", description: "Prepare a location link without opening an external map automatically.", action: "Check map handoff" },
  { key: "keyboard", label: "Keyboard control", description: "Check viewport and input behavior for the mobile keyboard.", action: "Check keyboard" },
  { key: "deviceInfo", label: "Device information", description: "Record safe browser and platform details without creating a fingerprint.", action: "Check device info" },
  { key: "privacyScreen", label: "Privacy screen", description: "Record the native screen-capture protection required for sensitive views.", action: "Check privacy handoff" },
  { key: "screenReader", label: "Screen reader", description: "Verify landmarks, labels, and live status content for assistive technology.", action: "Check accessibility" },
  { key: "toast", label: "Native toast", description: "Show a lightweight practice confirmation and map it to a native toast later.", action: "Show confirmation" },
] as const;

// This is an instruction boundary for the conversion workflow, not a claim
// that the untouched source has already produced any of these deliverables.
// Keeping the format names with the immutable capability catalogue makes the
// expected builder handoff visible to a person importing the Practice source.
export const practiceConversionContract = {
  outputs: [
    "Android APK",
    "Android AAB",
    "Installable PWA",
    "Chrome Extension ZIP",
    "Firefox XPI",
    "iOS IPA",
    "Windows MSIX",
    "Vendor export",
  ],
  evidenceRule: "For every selected feature and target, require target-specific code, a rebuilt artifact and hash, and applicable physical device or system evidence. A receipt, dependency, source edit, browser preview, or unrelated package is not completion.",
  deliveryRule: "Instructions may be delivered manually, through MCP, or through ACP. The selected builder must apply them to this source and record its application and rebuild reference before LaunchLiftAI can accept the conversion.",
} as const;
