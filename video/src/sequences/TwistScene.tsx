import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../lib/colors';

interface TwistSceneProps {
  content: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function splitIntoParagraphs(html: string): string[] {
  const matches = html.match(/<p>(.*?)<\/p>/gs);
  if (!matches) return [stripHtml(html)];
  return matches.map((m) => stripHtml(m));
}

export const TwistScene: React.FC<TwistSceneProps> = ({ content }) => {
  const frame = useCurrentFrame();
  const paragraphs = splitIntoParagraphs(content);

  const lineOpacity = interpolate(frame, [10, 30], [0, 0.3], {
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
      {/* Decorative line */}
      <div
        style={{
          width: 60,
          height: 2,
          backgroundColor: COLORS.accent,
          opacity: lineOpacity,
          marginBottom: 40,
        }}
      />

      {paragraphs.map((p, i) => {
        const delay = 15 + i * 30;
        const opacity = interpolate(frame - delay, [0, 25], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateY = interpolate(frame - delay, [0, 25], [20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              fontSize: 30,
              lineHeight: 1.8,
              color: '#cbd5e1',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '85%',
              marginBottom: 20,
            }}
          >
            {p}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
