import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpen } from 'lucide-react';
import { getScenarioCatalog } from '../lib/loadScenarios';

const TYPE_BADGES = {
  interactive: { label: 'Interactive', icon: MessageSquare, color: 'bg-blue-50 text-blue-700' },
  story: { label: 'Story', icon: BookOpen, color: 'bg-amber-50 text-amber-700' },
};

export default function HomePage() {
  const scenarios = getScenarioCatalog();

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          Reframe
        </h1>
        <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
          Stories and perspectives that make you think twice.
        </p>
      </div>

      <div className="grid gap-6">
        {scenarios.map((meta) => {
          const badge = TYPE_BADGES[meta.type] || TYPE_BADGES.story;
          const Icon = badge.icon;

          return (
            <Link
              key={meta.slug}
              to={`/${meta.slug}`}
              className="block bg-white rounded-xl shadow-md border border-slate-100 p-8 hover:shadow-lg hover:border-slate-200 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {badge.label}
                </span>
                <span className="text-slate-300 group-hover:text-slate-900 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
                {meta.title}
              </h2>
              <p className="text-slate-500 leading-relaxed">
                {meta.subtitle}
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-slate-400">
                <time>{new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                {meta.tags?.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{meta.tags.slice(0, 3).join(', ')}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
