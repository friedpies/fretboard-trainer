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
    null
  );

  React.useEffect(() => {
    const listener = (devices: MediaDeviceInfo[]) => {
      console.log('listening fireing');
      setDevices(devices);
      if (!selectedDevice && devices.length > 0) {
        setSelectedDevice(devices[0].deviceId);
      }
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
  }, [pitchDetector, selectedDevice]);

  const handleSelectChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedIndex = e.currentTarget.selectedIndex;
      const selectedOption = e.currentTarget.options[selectedIndex];
      const deviceID = selectedOption.getAttribute("data-id");
      setSelectedDevice(deviceID);
    },
    []
  );

  const handleActivate = React.useCallback(async () => {
    if (selectedDevice) {
      await pitchDetector.stopAudioContext();
      await pitchDetector.startAudioContext(selectedDevice);
    }
  }, [pitchDetector, selectedDevice]);

  const handleRefresh = React.useCallback(() => {
    pitchDetector.refreshMicInputs();
  }, [pitchDetector]);

  return (
    <div className="audio-input-select card-wrapper">
      <label htmlFor="inputs">Available Microphone Inputs</label>
      <select name="devices" id="devices" onChange={handleSelectChange}>
        {devices.map((device) => (
          <option data-id={device.deviceId} key={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <button onClick={handleActivate}>Activate Microphone</button>
      <button onClick={handleRefresh}>Refresh Inputs</button>
    </div>
  );
};
