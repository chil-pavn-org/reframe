import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Quiz from '../components/Quiz';
import RouterChoice from '../components/RouterChoice';
import PerspectiveView from '../components/PerspectiveView';
import Bridge from '../components/Bridge';

export default function InteractiveRenderer({ data }) {
  const { meta, questions, router, perspectives } = data;

  const [step, setStep] = useState('intro'); // intro, quiz, calculating, router, content
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [userType, setUserType] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [currentPerspective, setCurrentPerspective] = useState(null);

  // Collect all unique type keys from questions
  const typeKeys = [...new Set(questions.flatMap(q => q.options.map(o => o.type)))];

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep('calculating');
      // Determine dominant type
      const result = typeKeys.reduce((a, b) => (newScores[a] || 0) >= (newScores[b] || 0) ? a : b);
      setUserType(result);
      setTimeout(() => setStep('router'), 1500);
    }
  };

  const handleRouter = (mode) => {
    setViewMode(mode);
    if (mode === 'mirror') {
      setCurrentPerspective(userType);
    } else {
      // Pick the other type
      const other = typeKeys.find(k => k !== userType) || typeKeys[0];
      setCurrentPerspective(other);
    }
    setStep('content');
  };

  const togglePerspective = () => {
    const other = typeKeys.find(k => k !== currentPerspective) || typeKeys[0];
    setCurrentPerspective(other);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
      {/* INTRO */}
      {step === 'intro' && (
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
            Interactive Story
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            {meta.title}
          </h1>
          <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
            {meta.subtitle}
          </p>
          <div className="pt-4">
            <button
              onClick={() => setStep('quiz')}
              className="mx-auto px-6 py-3 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <Quiz questions={questions} qIndex={qIndex} onAnswer={handleAnswer} />
      )}

      {/* CALCULATING */}
      {step === 'calculating' && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-medium text-slate-900">Analyzing your perspective...</h3>
        </div>
      )}

      {/* ROUTER */}
      {step === 'router' && (
        <RouterChoice router={router} userType={userType} onChoose={handleRouter} />
      )}

      {/* CONTENT */}
      {step === 'content' && currentPerspective && perspectives[currentPerspective] && (
        <>
          <PerspectiveView
            perspective={perspectives[currentPerspective]}
            perspectiveKey={currentPerspective}
            viewMode={viewMode}
          />
          <Bridge
            bridge={perspectives.bridge}
            currentKey={currentPerspective}
            onFlip={togglePerspective}
          />
        </>
      )}
    </div>
  );
}
