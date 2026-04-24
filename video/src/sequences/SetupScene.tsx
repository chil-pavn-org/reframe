import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../lib/colors';

interface SetupSceneProps {
  setup: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function splitIntoParagraphs(html: string): string[] {
  const matches = html.match(/<p>(.*?)<\/p>/gs);
  if (!matches) return [stripHtml(html)];
  return matches.map((m) => stripHtml(m));
}

export const SetupScene: React.FC<SetupSceneProps> = ({ setup }) => {
  const frame = useCurrentFrame();
  const paragraphs = splitIntoParagraphs(setup);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div style={{ maxWidth: '85%' }}>
        {paragraphs.map((p, i) => {
          const delay = i * 25;
          const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const translateY = interpolate(frame - delay, [0, 20], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                fontSize: 28,
                lineHeight: 1.8,
                color: COLORS.textPrimary,
                fontFamily: 'Georgia, serif',
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
