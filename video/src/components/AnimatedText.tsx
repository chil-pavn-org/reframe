import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface AnimatedTextProps {
  text: string;
  style?: React.CSSProperties;
  delay?: number;
}

export const FadeInText: React.FC<AnimatedTextProps> = ({ text, style, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame - delay, [0, 20], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const TypewriterText: React.FC<AnimatedTextProps> = ({ text, style, delay = 0 }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - delay;
  const charsPerFrame = 1.5;
  const visibleChars = Math.min(
    text.length,
    Math.max(0, Math.floor(adjustedFrame * charsPerFrame))
  );

  return (
    <div style={style}>
      {text.slice(0, visibleChars)}
      {visibleChars < text.length && (
        <span style={{ opacity: frame % 15 < 8 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};
