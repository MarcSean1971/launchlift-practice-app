package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(PushRuntimePlugin.class);
        registerPlugin(MicrophoneRuntimePlugin.class);
    }
}
