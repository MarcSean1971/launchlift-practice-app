import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "site.chatgpt.seelenbinder.launchliftpracticeapp.android",
  appName: "LaunchLift Practice App",
  // A release must execute the generated Practice bundle on-device.  The old
  // redirect shell caused Android to load whichever remote page the URL served,
  // so native verification could exercise the wrong product.
  webDir: ".launchlift/web",
  plugins: {
    BackgroundRunner: {
      label: "site.chatgpt.seelenbinder.launchliftpracticeapp.background",
      src: "runners/practice-background.js",
      event: "practiceBackgroundProbe",
      repeat: false,
      interval: 15,
      autoStart: false,
    },
  },
};

export default config;
