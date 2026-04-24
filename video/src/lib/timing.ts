const FPS = 30;
const WORDS_PER_SECOND = 3;
const DIALOGUE_WORDS_PER_SECOND = 4;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function wordCount(text: string): number {
  return stripHtml(text).split(/\s+/).filter(Boolean).length;
}

function textDurationFrames(text: string, wps: number, minSeconds = 2): number {
  const seconds = Math.max(minSeconds, wordCount(text) / wps);
  return Math.ceil(seconds * FPS);
}

export function calculateTiming(meta: { title: string }, content: {
  setup: string;
  scenes: Array<{ action: string; dialogue: Array<{ line: string }> }>;
  twist: { content: string };
  moral_question: string;
}) {
  const titleDuration = 3 * FPS;
  const setupDuration = textDurationFrames(content.setup, WORDS_PER_SECOND, 3);

  const sceneDurations = content.scenes.map((scene) => {
    const actionFrames = textDurationFrames(scene.action, WORDS_PER_SECOND, 2);
    const dialogueFrames = scene.dialogue.reduce(
      (sum, d) => sum + textDurationFrames(d.line, DIALOGUE_WORDS_PER_SECOND, 2),
      0
    );
    const transitionFrames = FPS;
    return actionFrames + dialogueFrames + transitionFrames;
  });

  const twistDuration = textDurationFrames(content.twist.content, WORDS_PER_SECOND * 0.8, 3);
  const moralDuration = 5 * FPS;

  const segments = [
    { id: 'title', duration: titleDuration },
    { id: 'setup', duration: setupDuration },
    ...sceneDurations.map((d, i) => ({ id: `scene-${i}`, duration: d })),
    { id: 'twist', duration: twistDuration },
    { id: 'moral', duration: moralDuration },
  ];

  let from = 0;
  const timeline = segments.map((seg) => {
    const entry = { ...seg, from };
    from += seg.duration;
    return entry;
  });

  return { timeline, totalDuration: from, fps: FPS };
}
