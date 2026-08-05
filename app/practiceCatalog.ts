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

export type NativeKey = typeof nativeCapabilities[number]["key"];

export const outputOptions = [
  { key: "pwa", label: "PWA", purpose: "Installable web package" },
  { key: "android-apk", label: "Android APK", purpose: "Real-device testing" },
  { key: "android-aab", label: "Android AAB", purpose: "Google Play delivery" },
  { key: "chrome-extension", label: "Chrome extension", purpose: "Chrome Web Store ZIP" },
  { key: "firefox-extension", label: "Firefox extension", purpose: "Firefox Add-ons ZIP" },
  { key: "ios-source", label: "iOS source", purpose: "Xcode and App Store handoff" },
  { key: "windows-package", label: "Windows package", purpose: "PWABuilder and Microsoft Store handoff" },
  { key: "store-assets", label: "Store assets", purpose: "Icons, screenshots, copy and policy notes" },
] as const;

export type OutputKey = typeof outputOptions[number]["key"];

export const storeOptions = [
  { key: "launchlift-market", label: "LaunchLiftAI Market" },
  { key: "google-play", label: "Google Play" },
  { key: "apple-app-store", label: "Apple App Store" },
  { key: "chrome-web-store", label: "Chrome Web Store" },
  { key: "firefox-addons", label: "Firefox Add-ons" },
  { key: "microsoft-store", label: "Microsoft Store" },
] as const;

export type StoreKey = typeof storeOptions[number]["key"];

export const implementationChannels = [
  { key: "codex-mcp", label: "Codex through MCP", detail: "Send a structured implementation contract and receive tool activity and evidence." },
  { key: "codex-acp", label: "Codex through ACP", detail: "Run the same scoped contract through an ACP-compatible coding Agent." },
  { key: "lovable", label: "Lovable", detail: "Prepare builder-ready instructions and return the resulting change evidence." },
  { key: "bubble", label: "Bubble", detail: "Prepare workflow, plugin, privacy and native-wrapper implementation steps." },
  { key: "flutterflow", label: "FlutterFlow", detail: "Prepare actions, permissions, Firebase and export instructions." },
  { key: "base44", label: "Base44", detail: "Prepare a provider-specific implementation brief and verification loop." },
  { key: "generic", label: "Other no-code platform", detail: "Export the open implementation contract for a supported adapter or manual builder." },
] as const;

export type ImplementationChannel = typeof implementationChannels[number]["key"];
