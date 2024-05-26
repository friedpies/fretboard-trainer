import React from "react";
import { PitchDetector } from "./PitchDetector";

interface PitchCardProps {
  pitchDetector: PitchDetector;
}

export const PitchCard: React.FC<PitchCardProps> = ({ pitchDetector }) => {
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>(
    pitchDetector.audioInputDevices
  );

  React.useEffect(() => {
    const listener = (devices: MediaDeviceInfo[]) => {
      setDevices(devices);
    };
    pitchDetector.audioInputDevicesDidChangeEmitter.addListener(
      "change",
      listener
    );
    return () => {
      pitchDetector.audioInputDevicesDidChangeEmitter.removeListener(
        "change",
        listener
      );
    };
  }, [pitchDetector]);

  const handleActivate = React.useCallback(() => {
    return pitchDetector.initialize();
  }, [pitchDetector]);

  const handleRefresh = React.useCallback(() => {
    pitchDetector.refreshMicInputs();
  }, [pitchDetector]);

  return (
    <div className="audio-input-select card-wrapper">
      <label htmlFor="inputs">Available Microphone Inputs</label>
      <select name="devices" id="devices">
        {devices.map((device) => (
          <option key={device.deviceId}>{device.label}</option>
        ))}
      </select>
      <button onClick={handleActivate}>Activate Microphone</button>
      <button onClick={handleRefresh}>Refresh Inputs</button>
    </div>
  );
};
