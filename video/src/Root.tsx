import React from 'react';
import { Composition } from 'remotion';
import { FableVideo } from './FableVideo';
import { calculateTiming } from './lib/timing';
import type { FableProps } from './lib/types';

const sampleMeta = {
  title: 'The Watering Hole',
  subtitle: "Who owns the water when the river runs through everyone's land?",
  tags: ['power dynamics', 'resources', 'fairness', 'fable'],
  characters: [
    { name: 'Tam', species: 'cat', archetype: 'the gatekeeper' },
    { name: 'Jarri', species: 'mouse', archetype: 'the survivor' },
    { name: 'Kova', species: 'crow', archetype: 'the observer' },
  ],
  slug: 'the-watering-hole',
  type: 'fable',
  date: '2026-03-13',
};

const sampleContent = {
  setup: "<p>The river split the valley in two. Tam's side had the upstream bend where the water ran deep and cold. Jarri's side got what was left. A trickle most months. Mud in the dry ones.</p><p>This arrangement was older than either of them. Tam called it geography. Jarri called it something else entirely.</p>",
  scenes: [
    {
      characters: ['Tam', 'Jarri'],
      dialogue: [
        { character: 'Tam', line: "You're welcome to drink. The water's right there." },
        { character: 'Jarri', line: "The water's right there after it passes through your land, your fields, and your waste." },
        { character: 'Tam', line: "That's not my doing. That's the shape of the valley." },
      ],
      action: "<p>Tam sat at the upstream bank, paws clean, fur dry. The water pooled around flat stones, clear as glass. Thirty paces downstream, Jarri crouched at the edge of what used to be a stream. Scooping with both hands. Getting mostly sand.</p>",
      subtext: 'Resource access presented as natural geography when it is actually structural advantage.',
    },
    {
      characters: ['Jarri', 'Kova'],
      dialogue: [
        { character: 'Jarri', line: "Every season I ask. Every season the answer is the same. 'The valley decides.' As if valleys have opinions." },
        { character: 'Kova', line: 'Valleys don\'t. But the ones who got there first do.' },
      ],
      action: "<p>Jarri had dug channels. Carved paths through rock with nothing but persistence and a sharp stone. Some of them worked for a season. Then the upstream flow would shift, and the channels would dry. Not because the river changed. Because Tam had built a new pond.</p><p>Kova watched from the dead tree at the bend. Saw both sides. Said nothing useful to either.</p>",
      subtext: 'Individual effort cannot overcome systemic advantage. The observer class sees the pattern but lacks incentive to act.',
    },
    {
      characters: ['Tam', 'Kova'],
      dialogue: [
        { character: 'Tam', line: 'I built everything I have. The pond. The irrigation. All of it. With my own paws.' },
        { character: 'Kova', line: 'On land that already had the water.' },
        { character: 'Tam', line: 'And? Someone had to be upstream.' },
      ],
      action: "<p>Tam's pond was beautiful. Stone-lined, deep enough to last three dry seasons. The work was real. The skill was real. But the water that filled it had never been earned. It had simply arrived, the way it always had, because of where Tam happened to be born in the valley.</p>",
      subtext: 'The merit narrative: real effort built on unearned starting conditions.',
    },
    {
      characters: ['Tam', 'Jarri', 'Kova'],
      dialogue: [
        { character: 'Jarri', line: "I'm not asking for your pond. I'm asking for the river to be the river." },
        { character: 'Tam', line: 'If I open the dam, my fields flood. My family goes hungry next season. You\'re asking me to drown so you can drink.' },
      ],
      action: "<p>They stood at the dam. Tam on one side, Jarri on the other, Kova above. The water pressed against the stones Tam had stacked. Behind it, abundance. Ahead of it, dust.</p><p>Both of them were telling the truth. That was the part Kova found hardest to watch.</p>",
      subtext: 'Redistribution framed as mutual destruction. Both fears are legitimate.',
    },
  ],
  twist: {
    content: "<p>The next morning, Kova was gone. Left the valley entirely. Found a different river. One with no dam and no history.</p><p>Tam and Jarri barely noticed. They were too busy arguing about water to see that the only one who could see both banks had stopped watching.</p>",
  },
  moral_question: "If the river changes course tomorrow and flows through Jarri's land first, does Jarri become Tam? Or does Jarri remember what thirst felt like?",
};

const defaultProps: FableProps = { meta: sampleMeta, content: sampleContent };
const { totalDuration, fps } = calculateTiming(sampleMeta, sampleContent);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FableReel"
        component={FableVideo}
        durationInFrames={totalDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
      <Composition
        id="FableFull"
        component={FableVideo}
        durationInFrames={totalDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
