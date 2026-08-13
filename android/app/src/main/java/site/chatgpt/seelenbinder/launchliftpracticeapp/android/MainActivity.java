package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        // Capacitor constructs its bridge during the superclass lifecycle.
        // Register app-owned plugins first so the remote Practice bundle can
        // resolve them when it reaches the native harness.
        registerPlugin(PushRuntimePlugin.class);
        registerPlugin(MicrophoneRuntimePlugin.class);
        super.onCreate(savedInstanceState);
        // Device-test candidate only: enables the guarded local WebView inspector after Capacitor initialises its WebView.
        android.webkit.WebView.setWebContentsDebuggingEnabled(true);
    }
}
