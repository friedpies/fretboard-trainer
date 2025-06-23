import React from "react";
import { PitchDetector } from "./PitchDetector";
import "./pitch-card.css";

interface PitchCardProps {
  pitchDetector: PitchDetector;
}

export const PitchCard: React.FC<PitchCardProps> = ({ pitchDetector }) => {
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>(
    pitchDetector.audioInputDevices
  );
  const [selectedDevice, setSelectedDevice] = React.useState<string | null>(
    pitchDetector.audioInputDevices.length > 0
      ? pitchDetector.audioInputDevices[0].deviceId
      : null
  );
  const [volume, setVolume] = React.useState(0);
  const [calibration, setCalibration] = React.useState(1);
  const [calibratedVolume, setCalibratedVolume] = React.useState(0);
  const [audioContext, setAudioContext] = React.useState<AudioContext | null>(null);
  const [micActive, setMicActive] = React.useState(false);

  React.useEffect(() => {
    const listener = (devices: MediaDeviceInfo[]) => {
      setDevices(devices);
      if ((!selectedDevice || !devices.find(d => d.deviceId === selectedDevice)) && devices.length > 0) {
        setSelectedDevice(devices[0].deviceId);
      }
    };
    pitchDetector.audioInputDevicesDidChangeEmitter.addListener(
      "change",
      listener
    );
    
    if ((!selectedDevice || !devices.find(d => d.deviceId === selectedDevice)) && devices.length > 0) {
      setSelectedDevice(devices[0].deviceId);
    }
    return () => {
      pitchDetector.audioInputDevicesDidChangeEmitter.removeListener(
        "change",
        listener
      );
    };
  }, [pitchDetector, devices, selectedDevice]);

  React.useEffect(() => {
    let animationId: number;
    let ctx: AudioContext | null = null;
    let analyserNode: AnalyserNode | null = null;
    let srcNode: MediaStreamAudioSourceNode | null = null;

    async function setupAnalyser() {
      if (!selectedDevice) return;
      if (audioContext) {
        audioContext.close();
      }
      ctx = new window.AudioContext();
      setAudioContext(ctx);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedDevice }
        });
        srcNode = ctx.createMediaStreamSource(stream);
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256; 
        analyserNode.smoothingTimeConstant = 0.1; 
        srcNode.connect(analyserNode);

        const dataArray = new Uint8Array(analyserNode.fftSize);

        function updateVolume() {
          if (!analyserNode) return;
          analyserNode.getByteTimeDomainData(dataArray);
          // Calculate RMS
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          setVolume(rms);
          setCalibratedVolume(rms * calibration);
          animationId = requestAnimationFrame(updateVolume);
        }
        updateVolume();
      } catch (err) {
        // ignore
      }
    }

    setupAnalyser();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (srcNode) srcNode.disconnect();
      if (analyserNode) analyserNode.disconnect();
      if (ctx) ctx.close();
    };
  }, [selectedDevice, calibration]);

  const handleSelectChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedDevice(e.target.value);
    },
    []
  );

  const handleActivate = React.useCallback(async () => {
    if (selectedDevice) {
      await pitchDetector.stopAudioContext();
      await pitchDetector.startAudioContext(selectedDevice);
      setMicActive(true);
    }
  }, [pitchDetector, selectedDevice]);

  const handleDeactivate = React.useCallback(async () => {
    await pitchDetector.stopAudioContext();
    setMicActive(false);
  }, [pitchDetector]);

  React.useEffect(() => {
    if (audioContext && audioContext.state !== "running") {
      setMicActive(false);
    }
  }, [audioContext ]);

  const handleRefresh = React.useCallback(() => {
    pitchDetector.refreshMicInputs();
  }, [pitchDetector]);

  const handleCalibrationSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalibration(Number(e.target.value));
  };

  return (
    <div className="audio-input-select card-wrapper">
      <label htmlFor="inputs">Available Microphone Inputs</label>
      <select
        name="devices"
        id="devices"
        value={selectedDevice || ""}
        onChange={handleSelectChange}
      >
        {devices.map((device) => (
          <option value={device.deviceId} key={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
        {micActive ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#2ecc71",
                border: "2px solid #27ae60"
              }}
              title="Microphone is active"
            />
            <button onClick={handleDeactivate}>Deactivate Microphone</button>
          </>
        ) : (
          <>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#e74c3c",
                border: "2px solid #c0392b"
              }}
              title="Microphone is inactive"
            />
            <button onClick={handleActivate}>Activate Microphone</button>
          </>
        )}
        <button onClick={handleRefresh}>Refresh Inputs</button>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>Mic Volume:</label>
        <div style={{
          width: "100%",
          height: "16px",
          background: "#eee",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "4px"
        }}>
          <div style={{
            width: `${Math.min(calibratedVolume * 100, 100)}%`,
            height: "100%",
            background: calibratedVolume > 0.7 ? "#e74c3c" : "#2ecc71",
            transition: "width 0.1s"
          }} />
        </div>
        <div style={{ fontSize: "0.8em", marginTop: "2px" }}>
          Raw: {volume.toFixed(3)} | Scaled: {calibratedVolume.toFixed(3)}
        </div>
        <div style={{ marginTop: "8px" }}>
          <label htmlFor="calibration-slider">
            Microphone Gain: {calibration.toFixed(2)}
          </label>
          <input
            id="calibration-slider"
            type="range"
            min="0.1"
            max="5"
            step="0.01"
            value={calibration}
            onChange={handleCalibrationSlider}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
