package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.FirebaseApp;

@CapacitorPlugin(name = "PushRuntime")
public class PushRuntimePlugin extends Plugin {
    @PluginMethod
    public void getRuntimeStatus(PluginCall call) {
        boolean firebaseConfigured = false;
        try {
            firebaseConfigured = FirebaseApp.initializeApp(getContext()) != null;
        } catch (RuntimeException ignored) {
            // This test surface must report a missing/invalid local Firebase
            // configuration without exposing configuration details or crashing.
        }

        JSObject result = new JSObject();
        result.put("firebaseConfigured", firebaseConfigured);
        call.resolve(result);
    }
}
