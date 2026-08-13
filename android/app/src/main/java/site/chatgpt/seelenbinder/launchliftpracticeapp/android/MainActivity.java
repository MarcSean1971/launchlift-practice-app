package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        // Device-test candidate only: enables the guarded local WebView inspector.
        android.webkit.WebView.setWebContentsDebuggingEnabled(true);
        super.onCreate(savedInstanceState);
        registerPlugin(PushRuntimePlugin.class);
        registerPlugin(MicrophoneRuntimePlugin.class);
    }
}
