import React from 'react';
import { PitchDetector } from "./PitchDetector";

interface PitchCardProps {
  pitchDetector: PitchDetector;
}

export const PitchCard: React.FC<PitchCardProps> = ({ pitchDetector }) => {
  const handleClick = React.useCallback(() => {
    console.log('we have a pitch detector', pitchDetector);
    pitchDetector.resumeAudioContext();
  }, [pitchDetector]);

  return <button onClick={handleClick}>Press Me</button>;
};
