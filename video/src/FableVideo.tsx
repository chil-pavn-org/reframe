import React from 'react';
import { Sequence } from 'remotion';
import { TitleCard } from './sequences/TitleCard';
import { SetupScene } from './sequences/SetupScene';
import { DialogueScene } from './sequences/DialogueScene';
import { TwistScene } from './sequences/TwistScene';
import { MoralCard } from './sequences/MoralCard';
import { calculateTiming } from './lib/timing';
import type { FableProps } from './lib/types';

export const FableVideo: React.FC<FableProps> = ({ meta, content }) => {
  const { timeline } = calculateTiming(meta, content);
  const allCharacterNames = meta.characters.map((c) => c.name);

  const getSegment = (id: string) => timeline.find((s) => s.id === id)!;

  const title = getSegment('title');
  const setup = getSegment('setup');
  const twist = getSegment('twist');
  const moral = getSegment('moral');

  return (
    <>
      <Sequence from={title.from} durationInFrames={title.duration} name="Title">
        <TitleCard title={meta.title} subtitle={meta.subtitle} />
      </Sequence>

      <Sequence from={setup.from} durationInFrames={setup.duration} name="Setup">
        <SetupScene setup={content.setup} />
      </Sequence>

      {content.scenes.map((scene, i) => {
        const seg = getSegment(`scene-${i}`);
        return (
          <Sequence
            key={i}
            from={seg.from}
            durationInFrames={seg.duration}
            name={`Scene ${i + 1}`}
          >
            <DialogueScene
              scene={scene}
              sceneIndex={i}
              allCharacterNames={allCharacterNames}
            />
          </Sequence>
        );
      })}

      <Sequence from={twist.from} durationInFrames={twist.duration} name="Twist">
        <TwistScene content={content.twist.content} />
      </Sequence>

      <Sequence from={moral.from} durationInFrames={moral.duration} name="Moral Question">
        <MoralCard question={content.moral_question} />
      </Sequence>
    </>
  );
};
