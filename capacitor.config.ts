import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "site.chatgpt.seelenbinder.launchliftpracticeapp.android",
  appName: "LaunchLift Practice App",
  webDir: ".launchlift/web",
  server: { url: "https://launchlift-practice-app.seelenbinder.chatgpt.site/", cleartext: false },
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
