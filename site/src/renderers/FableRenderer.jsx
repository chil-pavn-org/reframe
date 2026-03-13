import React, { useState } from 'react';

const CHARACTER_COLORS = [
  { bg: 'bg-emerald-50', border: 'border-emerald-200', name: 'text-emerald-700', accent: 'bg-emerald-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', name: 'text-amber-700', accent: 'bg-amber-600' },
  { bg: 'bg-violet-50', border: 'border-violet-200', name: 'text-violet-700', accent: 'bg-violet-600' },
  { bg: 'bg-rose-50', border: 'border-rose-200', name: 'text-rose-700', accent: 'bg-rose-600' },
];

function getCharacterColor(name, allCharacters) {
  const index = allCharacters.indexOf(name);
  return CHARACTER_COLORS[index % CHARACTER_COLORS.length];
}

function DialogueBubble({ line, character, color, isRight }) {
  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] ${color.bg} ${color.border} border rounded-2xl px-5 py-3 ${isRight ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${color.name} block mb-1`}>
          {character}
        </span>
        <p className="font-serif text-slate-800 leading-relaxed text-base">
          {line}
        </p>
      </div>
    </div>
  );
}

export default function FableRenderer({ data }) {
  const { meta, content } = data;
  const [revealedSubtexts, setRevealedSubtexts] = useState({});

  const allCharacters = (meta.characters || []).map(c => c.name);

  const toggleSubtext = (index) => {
    setRevealedSubtexts(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
          Fable
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          {meta.title}
        </h1>
        <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
          {meta.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6 text-sm text-slate-400">
          <time>{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          {meta.tags?.length > 0 && (
            <>
              <span>·</span>
              <span>{meta.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Characters */}
      {meta.characters?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {meta.characters.map((char, i) => {
            const color = CHARACTER_COLORS[i % CHARACTER_COLORS.length];
            return (
              <div key={char.name} className={`${color.bg} ${color.border} border rounded-xl px-4 py-3 text-center`}>
                <div className={`text-sm font-bold ${color.name}`}>{char.name}</div>
                <div className="text-xs text-slate-500">{char.species} · {char.archetype}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Setup */}
      <div className="article-content font-serif max-w-prose mx-auto mb-12"
        dangerouslySetInnerHTML={{ __html: content.setup }}
      />

      {/* Scenes */}
      {content.scenes.map((scene, i) => (
        <div key={i} className="my-12 max-w-prose mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 block text-center">
            Scene {i + 1}
          </span>

          {/* Action */}
          <div className="article-content font-serif mb-6"
            dangerouslySetInnerHTML={{ __html: scene.action }}
          />

          {/* Dialogue */}
          {scene.dialogue?.length > 0 && (
            <div className="my-6">
              {scene.dialogue.map((d, j) => {
                const color = getCharacterColor(d.character, allCharacters);
                const charIndex = allCharacters.indexOf(d.character);
                return (
                  <DialogueBubble
                    key={j}
                    line={d.line}
                    character={d.character}
                    color={color}
                    isRight={charIndex % 2 !== 0}
                  />
                );
              })}
            </div>
          )}

          {/* Subtext toggle */}
          {scene.subtext && (
            <div className="text-center mt-4">
              <button
                onClick={() => toggleSubtext(i)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
              >
                {revealedSubtexts[i] ? 'Hide subtext' : 'What is this really about?'}
              </button>
              {revealedSubtexts[i] && (
                <p className="mt-3 text-sm text-slate-500 italic max-w-md mx-auto animate-fade-in">
                  {scene.subtext}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Twist */}
      {content.twist && (
        <div className="my-16 py-10 border-y border-slate-200">
          <div className="font-serif text-xl leading-relaxed text-slate-700 max-w-prose mx-auto italic text-center"
            dangerouslySetInnerHTML={{ __html: content.twist.content }}
          />
        </div>
      )}

      {/* Moral Question */}
      {content.moral_question && (
        <div className="my-16 bg-slate-900 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-prose mx-auto text-center">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-4">
              The question
            </span>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-slate-200">
              {content.moral_question}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
