import React from 'react';

const SECTION_STYLES = {
  narrative: {
    wrapper: '',
    content: 'article-content font-serif max-w-prose mx-auto text-slate-800 dark:text-slate-200',
  },
  scene: {
    wrapper: 'my-12',
    label: 'text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-4 block text-center',
    content: 'article-content font-serif max-w-prose mx-auto text-slate-800 dark:text-slate-200',
  },
  reflection: {
    wrapper: 'my-12 px-8 py-10 bg-white border border-slate-100 dark:bg-slate-900/50 dark:border-none rounded-3xl shadow-sm dark:shadow-none',
    content: 'font-serif text-xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-prose mx-auto italic text-center',
  },
  takeaway: {
    wrapper: 'my-16 bg-slate-900 text-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 ring-1 ring-white/10',
    content: 'font-serif text-lg leading-relaxed max-w-prose mx-auto [&_p]:text-slate-200 [&_p]:mb-4 last:[&_p]:mb-0',
  },
};

export default function StoryRenderer({ data }) {
  const { meta, content } = data;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
          Story
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
