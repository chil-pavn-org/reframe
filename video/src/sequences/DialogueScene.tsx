import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { CharacterBubble } from '../components/CharacterBubble';
import { getCharacterPalette, COLORS } from '../lib/colors';
import type { FableScene } from '../lib/types';

interface DialogueSceneProps {
  scene: FableScene;
  sceneIndex: number;
  allCharacterNames: string[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function splitIntoParagraphs(html: string): string[] {
  const matches = html.match(/<p>(.*?)<\/p>/gs);
  if (!matches) return [stripHtml(html)];
  return matches.map((m) => stripHtml(m));
}

export const DialogueScene: React.FC<DialogueSceneProps> = ({
  scene,
  sceneIndex,
  allCharacterNames,
}) => {
  const frame = useCurrentFrame();
  const actionParagraphs = splitIntoParagraphs(scene.action);

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const actionWordCount = stripHtml(scene.action).split(/\s+/).length;
  const actionDuration = Math.max(60, Math.ceil((actionWordCount / 3) * 30));
  const dialogueStart = actionDuration;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgLight,
        padding: 60,
        justifyContent: 'flex-start',
      }}
    >
      {/* Scene label */}
      <div
        style={{
          opacity: labelOpacity,
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 4,
          color: COLORS.textMuted,
          textAlign: 'center',
          marginBottom: 30,
          marginTop: 30,
        }}
      >
        Scene {sceneIndex + 1}
      </div>

      {/* Action text */}
      <div style={{ marginBottom: 40, maxWidth: '90%', alignSelf: 'center' }}>
        {actionParagraphs.map((p, i) => {
          const delay = 15 + i * 20;
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
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                fontSize: 24,
                lineHeight: 1.7,
                color: COLORS.textPrimary,
                fontFamily: 'Georgia, serif',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              {p}
            </div>
          );
        })}
      </div>

      {/* Dialogue bubbles */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 40 }}>
        {scene.dialogue.map((d, j) => {
          const charIndex = allCharacterNames.indexOf(d.character);
          const color = getCharacterPalette(d.character, allCharacterNames);
          const delay = dialogueStart + j * 50;

          return (
            <CharacterBubble
              key={j}
              character={d.character}
              line={d.line}
              color={color}
              isRight={charIndex % 2 !== 0}
              delay={delay}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
