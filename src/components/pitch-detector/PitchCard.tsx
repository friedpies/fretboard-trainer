import React from 'react';
import { PitchDetector } from "./PitchDetector";

interface PitchCardProps {
  pitchDetector: PitchDetector;
}

export const PitchCard: React.FC<PitchCardProps> = ({ pitchDetector }) => {
  const handleClick = React.useCallback(() => {
    pitchDetector.resumeAudioContext();
  }, [pitchDetector]);

  return <button onClick={handleClick}>Press Me</button>;
};
