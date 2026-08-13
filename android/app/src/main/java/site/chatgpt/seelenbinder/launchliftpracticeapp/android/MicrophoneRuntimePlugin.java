package site.chatgpt.seelenbinder.launchliftpracticeapp.android;

import android.Manifest;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "MicrophoneRuntime",
    permissions = {
        @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO })
    }
)
public class MicrophoneRuntimePlugin extends Plugin {
    private static final int SAMPLE_RATE_HZ = 16000;

    @PluginMethod
    public void probe(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            requestPermissionForAlias("microphone", call, "runProbe");
            return;
        }
        runProbe(call);
    }

    @PermissionCallback
    private void runProbe(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            call.reject("Microphone permission denied.");
            return;
        }

        int minimumBuffer = AudioRecord.getMinBufferSize(
            SAMPLE_RATE_HZ,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        );
        if (minimumBuffer <= 0) {
            call.reject("Microphone capture is unavailable on this phone.");
            return;
        }

        AudioRecord recorder = new AudioRecord(
            MediaRecorder.AudioSource.MIC,
            SAMPLE_RATE_HZ,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            Math.max(minimumBuffer, 4096)
        );
        try {
            recorder.startRecording();
            if (recorder.getRecordingState() != AudioRecord.RECORDSTATE_RECORDING) {
                call.reject("Microphone capture did not start.");
                return;
            }
        } catch (RuntimeException error) {
            call.reject("Microphone capture could not start.");
            return;
        } finally {
            if (recorder.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING) recorder.stop();
            recorder.release();
        }

        JSObject result = new JSObject();
        result.put("audioCaptureStarted", true);
        call.resolve(result);
    }
}
