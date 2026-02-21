import React from 'react';
import { Eye, BookOpen, Zap } from 'lucide-react';

export default function RouterChoice({ router, userType, onChoose }) {
  const typeLabel = router.types[userType]?.label || userType;

  return (
    <div className="text-center space-y-8 animate-fade-in-up">
      <div className="inline-block p-3 bg-slate-100 rounded-full mb-2">
        <Zap className="w-6 h-6 text-slate-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">
        {router.headline}
      </h2>
      <p className="text-lg text-slate-600 max-w-md mx-auto">
        You lean towards <strong className="text-slate-900">{typeLabel}</strong>.
        <br />
        How do you want to experience this story?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
        {/* Mirror */}
        <button
          onClick={() => onChoose('mirror')}
          className="w-full bg-white rounded-xl shadow-lg border border-slate-100 hover:ring-2 hover:ring-slate-900 transition-all p-8 text-left group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-2">{router.options.mirror.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {router.options.mirror.description}
          </p>
          <div className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900">
            {router.options.mirror.footer}
          </div>
        </button>

        {/* Window */}
        <button
          onClick={() => onChoose('window')}
          className="w-full bg-white rounded-xl shadow-lg border border-slate-100 hover:ring-2 hover:ring-slate-900 transition-all p-8 text-left group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-2">{router.options.window.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {router.options.window.description}
          </p>
          <div className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900">
            {router.options.window.footer}
          </div>
        </button>
      </div>
    </div>
  );
}
