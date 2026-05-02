import React from 'react';
import { Brain, Heart } from 'lucide-react';

const ICONS = {
  fixer: Brain,
  feeler: Heart,
};

const COLORS = {
  blue: { bg: 'bg-blue-600/10 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  rose: { bg: 'bg-rose-600/10 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400' },
};

export default function PerspectiveView({ perspective, perspectiveKey, viewMode }) {
  const Icon = ICONS[perspectiveKey] || Brain;
  const colors = COLORS[perspective.color] || COLORS.blue;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2 block">
          Reading Mode: {viewMode === 'mirror' ? 'Validation' : 'Challenge'}
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">
          {perspective.title}
        </h1>
        <h2 className={`text-lg font-medium italic ${colors.text}`}>
          {perspective.subtitle}
        </h2>
      </div>

      {/* Type pill */}
      <div className="flex justify-center mb-10">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
          <span className={`text-sm font-bold uppercase tracking-wide ${colors.text}`}>
            Perspective: The {perspectiveKey}
          </span>
        </div>
      </div>

      {/* Article */}
      <article
        className="article-content font-serif mx-auto max-w-prose text-slate-800 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: perspective.content }}
      />
    </div>
  );
}
