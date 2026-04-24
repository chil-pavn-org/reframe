import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface CharacterBubbleProps {
  character: string;
  line: string;
  color: { bg: string; border: string; text: string };
  isRight: boolean;
  delay?: number;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  character,
  line,
  color,
  isRight,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideX = interpolate(frame - delay, [0, 15], [isRight ? 40 : -40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isRight ? 'flex-end' : 'flex-start',
        opacity,
        transform: `translateX(${slideX}px)`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: '75%',
          backgroundColor: color.bg,
          border: `2px solid ${color.border}`,
          borderRadius: 20,
          ...(isRight
            ? { borderBottomRightRadius: 4 }
            : { borderBottomLeftRadius: 4 }),
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: color.text,
            marginBottom: 6,
          }}
        >
          {character}
        </div>
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.5,
            color: '#1e293b',
            fontFamily: 'Georgia, serif',
          }}
        >
          "{line}"
        </div>
      </div>
    </div>
  );
};
