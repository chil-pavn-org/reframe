import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../lib/colors';

interface TitleCardProps {
  title: string;
  subtitle: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });
  const badgeOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div
        style={{
          opacity: badgeOpacity,
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 4,
          color: COLORS.accent,
          marginBottom: 30,
        }}
      >
        FABLE
      </div>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.white,
          textAlign: 'center',
          lineHeight: 1.2,
          fontFamily: 'Georgia, serif',
          maxWidth: '90%',
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 26,
          color: COLORS.textMuted,
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 1.5,
          maxWidth: '80%',
          fontFamily: 'Georgia, serif',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
