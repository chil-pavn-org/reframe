import React, { useState, useRef } from 'react';
import { Play, Pause, Maximize2, Film } from 'lucide-react';

const CHARACTER_COLORS = [
  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', name: 'text-emerald-700 dark:text-emerald-300', accent: 'bg-emerald-600' },
  { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', name: 'text-amber-700 dark:text-amber-300', accent: 'bg-amber-600' },
  { bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', name: 'text-violet-700 dark:text-violet-300', accent: 'bg-violet-600' },
  { bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800', name: 'text-rose-700 dark:text-rose-300', accent: 'bg-rose-600' },
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
        <p className="font-serif text-slate-800 dark:text-slate-200 leading-relaxed text-base">
          {line}
        </p>
      </div>
    </div>
  );
}

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <div
      className="relative mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate-900 cursor-pointer group"
      style={{ maxWidth: 400, aspectRatio: '9/16' }}
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(!isPlaying)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'}`}>
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-7 h-7 text-slate-900 ml-1" />
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between transition-opacity duration-300 ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="text-white hover:text-slate-200 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          className="text-white hover:text-slate-200 transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function FableRenderer({ data }) {
  const { meta, content } = data;
  const [revealedSubtexts, setRevealedSubtexts] = useState({});
  const [showVideo, setShowVideo] = useState(false);

  const allCharacters = (meta.characters || []).map(c => c.name);
  const reelSrc = meta.video?.reel;

  const toggleSubtext = (index) => {
    setRevealedSubtexts(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
          Fable
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
          {meta.title}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {meta.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6 text-sm text-slate-400 dark:text-slate-500">
          <time>{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          {meta.tags?.length > 0 && (
            <>
              <span>·</span>
              <span>{meta.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Video toggle */}
      {reelSrc && (
        <div className="text-center mb-12">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Film className="w-4 h-4" />
              Watch the Reel
            </button>
          ) : (
            <div className="animate-fade-in">
              <VideoPlayer src={reelSrc} />
              <button
                onClick={() => setShowVideo(false)}
                className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-wider"
              >
                Hide video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Characters */}
      {meta.characters?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {meta.characters.map((char, i) => {
            const color = CHARACTER_COLORS[i % CHARACTER_COLORS.length];
            return (
              <div key={char.name} className={`${color.bg} ${color.border} border rounded-xl px-4 py-3 text-center max-w-[200px]`}>
                <div className={`text-sm font-bold ${color.name}`}>{char.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{char.species} · {char.archetype}</div>
                {char.description && (
                  <div className="text-[10px] leading-tight text-slate-400 italic mt-1 border-t border-slate-200 dark:border-slate-700 pt-2">
                    {char.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Setup */}
      <div className="article-content font-serif max-w-prose mx-auto mb-12 text-slate-800 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: content.setup }}
      />

      {/* Scenes */}
      {content.scenes.map((scene, i) => (
        <div key={i} className="my-12 max-w-prose mx-auto">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-6 block text-center">
            Scene {i + 1}
          </span>

          {/* Action */}
          <div className="article-content font-serif mb-6 text-slate-800 dark:text-slate-200"
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
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors uppercase tracking-wider"
              >
                {revealedSubtexts[i] ? 'Hide subtext' : 'What is this really about?'}
              </button>
              {revealedSubtexts[i] && (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic max-w-md mx-auto animate-fade-in">
                  {scene.subtext}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Twist */}
      {content.twist && (
        <div className="my-16 py-10 border-y border-slate-200 dark:border-slate-800">
          <div className="font-serif text-xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-prose mx-auto italic text-center"
            dangerouslySetInnerHTML={{ __html: content.twist.content }}
          />
        </div>
      )}

      {/* Moral Question */}
      {content.moral_question && (
        <div className="my-16 bg-slate-900 text-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 ring-1 ring-white/10">
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
