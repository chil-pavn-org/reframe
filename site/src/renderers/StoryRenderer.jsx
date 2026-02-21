import React from 'react';

const SECTION_STYLES = {
  narrative: {
    wrapper: '',
    content: 'article-content font-serif max-w-prose mx-auto',
  },
  scene: {
    wrapper: 'my-12',
    label: 'text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 block text-center',
    content: 'article-content font-serif max-w-prose mx-auto',
  },
  reflection: {
    wrapper: 'my-16 py-10 border-y border-slate-200',
    content: 'font-serif text-xl leading-relaxed text-slate-700 max-w-prose mx-auto italic text-center',
  },
  takeaway: {
    wrapper: 'my-16 bg-slate-900 text-white rounded-2xl p-8 md:p-12',
    content: 'font-serif text-lg leading-relaxed max-w-prose mx-auto [&_p]:text-slate-200 [&_p]:mb-4 last:[&_p]:mb-0',
  },
};

export default function StoryRenderer({ data }) {
  const { meta, content } = data;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
          Story
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

      {/* Sections */}
      {content.sections.map((section, i) => {
        const style = SECTION_STYLES[section.type] || SECTION_STYLES.narrative;

        return (
          <div key={i} className={style.wrapper}>
            {section.label && style.label && (
              <span className={style.label}>{section.label}</span>
            )}
            <div
              className={style.content}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        );
      })}
    </div>
  );
}
