import React, { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Quiz({ 
  questions, 
  qIndex, 
  onAnswer, 
  onPrevious,
  multiSelect = false, 
  maxSelections = 2,
  allowSkip = false
}) {
  const [selected, setSelected] = useState([]);
  const current = questions[qIndex];

  // Reset selection when question changes
  useEffect(() => {
    setSelected([]);
  }, [qIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      // A, B, C shortcuts
      if (['a', 'b', 'c'].includes(key)) {
        const index = key.charCodeAt(0) - 97; // a=0, b=1, c=2
        if (current.options[index]) {
          toggleOption(current.options[index]);
        }
      }
      
      // Next: N, Right Arrow, or Enter
      if (key === 'n' || key === 'arrowright' || key === 'enter') {
        handleNext();
      }
      
      // Previous: P or Left Arrow
      if ((key === 'p' || key === 'arrowleft') && onPrevious) {
        onPrevious();
      }
      
      // Skip: S
      if (key === 's' && allowSkip) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, selected, allowSkip, onPrevious]); // Re-bind when state used in handlers changes

  const toggleOption = (option) => {
    const optId = option.id;
    const optType = option.type || option.id;
    
    if (multiSelect) {
      setSelected(prev => {
        if (prev.find(s => s.id === optId)) {
          return prev.filter(s => s.id !== optId);
        } else if (prev.length < maxSelections) {
          return [...prev, { id: optId, type: optType }];
        }
        return prev;
      });
    } else {
      // Immediate answer for single-select (backward compatibility)
      onAnswer(optType);
    }
  };

  const handleNext = () => {
    if (selected.length > 0) {
      const types = selected.map(s => s.type);
      onAnswer(types);
    } else if (allowSkip) {
      // If nothing selected and Next is pressed, automatically skip
      handleSkip();
    }
  };

  const handleSkip = () => {
    onAnswer(multiSelect ? [] : null);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in" key={qIndex}>
      <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-400 dark:text-slate-500">
        <span>Question {qIndex + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= qIndex ? 'w-8 bg-slate-900 dark:bg-slate-100' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 leading-snug text-slate-900 dark:text-slate-100">
        {current.question}
      </h2>

      <div className="space-y-4">
        {current.options.map((opt, index) => {
          const isSelected = selected.some(s => s.id === opt.id);
          const letter = String.fromCharCode(65 + index); // A, B, C
          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 group relative flex items-center gap-4 ${
                isSelected 
                  ? 'border-slate-900 bg-slate-50 dark:border-slate-100 dark:bg-slate-900/60' 
                  : 'border-slate-100 hover:border-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-100 dark:hover:bg-slate-900/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-lg shrink-0 transition-all ${
                isSelected 
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900' 
                  : 'border-slate-100 text-slate-300 group-hover:border-slate-200 group-hover:text-slate-400 dark:border-slate-700 dark:text-slate-600 dark:group-hover:border-slate-500 dark:group-hover:text-slate-300'
              }`}>
                {letter}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <span className={`font-semibold text-lg transition-colors ${
                    isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-800 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100'
                  }`}>
                    {opt.text}
                  </span>
                  <span className={`transition-colors ${
                    isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-300 group-hover:text-slate-900 dark:text-slate-600 dark:group-hover:text-slate-100'
                  }`}>
                    {isSelected ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </span>
                </div>
                {opt.sub && (
                  <p className={`text-sm mt-1 transition-colors ${
                    isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300'
                  }`}>
                    {opt.sub}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {(multiSelect || allowSkip) && (
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex gap-3">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="flex-1 px-3 py-4 rounded-xl font-semibold border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 hover:text-slate-600 dark:hover:border-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all flex items-center justify-center gap-2 group"
              >
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Previous</span>
                </div>
                <kbd className="hidden md:inline-flex h-5 items-center justify-center rounded border border-slate-100 bg-slate-50 px-1.5 font-sans text-[10px] font-medium text-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">P</kbd>
              </button>
            )}
            {allowSkip && (
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-4 rounded-xl font-semibold border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 hover:text-slate-600 dark:hover:border-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Skip</span>
                <kbd className="hidden md:inline-flex h-5 items-center justify-center rounded border border-slate-100 bg-slate-50 px-1.5 font-sans text-[10px] font-medium text-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">S</kbd>
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={selected.length === 0 && !allowSkip}
              className={`flex-[2] px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 group ${
                selected.length > 0 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{selected.length === 2 ? 'Confirm' : 'Next'}</span>
                <kbd className={`hidden md:inline-flex h-5 items-center justify-center rounded border px-1.5 font-sans text-[10px] font-medium transition-colors ${
                  selected.length > 0
                    ? 'bg-slate-800 border-slate-700 text-slate-400 dark:bg-slate-200 dark:border-slate-300 dark:text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-600'
                }`}>N</kbd>
              </div>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="hidden md:flex justify-center gap-8 text-[11px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-4">
            <div className="flex items-center gap-2">
              <kbd className="h-5 px-1.5 rounded border border-slate-100 bg-slate-50 flex items-center dark:border-slate-700 dark:bg-slate-900">A-C</kbd>
              <span>Select</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
