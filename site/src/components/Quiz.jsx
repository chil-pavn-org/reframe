import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Quiz({ questions, qIndex, onAnswer }) {
  const current = questions[qIndex];

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in" key={qIndex}>
      <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-400">
        <span>Question {qIndex + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= qIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 leading-snug">
        {current.question}
      </h2>

      <div className="space-y-4">
        {current.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.type)}
            className="w-full text-left p-6 rounded-xl border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <span className="font-semibold text-lg text-slate-800 group-hover:text-slate-900">
                {opt.text}
              </span>
              <span className="text-slate-300 group-hover:text-slate-900 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1 group-hover:text-slate-600">
              {opt.sub}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
