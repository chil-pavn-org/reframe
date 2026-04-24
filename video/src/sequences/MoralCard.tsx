import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../lib/colors';

interface MoralCardProps {
  question: string;
}

export const MoralCard: React.FC<MoralCardProps> = ({ question }) => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const questionOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const questionY = interpolate(frame, [25, 50], [20, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: labelOpacity,
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 4,
          color: COLORS.textMuted,
          marginBottom: 30,
        }}
      >
        THE QUESTION
      </div>
      <div
        style={{
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
          fontSize: 32,
          lineHeight: 1.6,
          color: '#e2e8f0',
          fontFamily: 'Georgia, serif',
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        {question}
      </div>
    </AbsoluteFill>
  );
};
