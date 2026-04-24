import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface SceneTransitionProps {
  durationInFrames: number;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0f172a',
        opacity,
        zIndex: 100,
      }}
    />
  );
};
