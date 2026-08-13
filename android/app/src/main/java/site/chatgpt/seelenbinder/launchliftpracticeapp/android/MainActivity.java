package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Device-test candidate only: enables the guarded local WebView inspector after Capacitor initialises its WebView.
        android.webkit.WebView.setWebContentsDebuggingEnabled(true);
        registerPlugin(PushRuntimePlugin.class);
        registerPlugin(MicrophoneRuntimePlugin.class);
    }
}
