import React, { useState, useEffect } from 'react';
import { ArrowRight, User, UserPlus, Info } from 'lucide-react';
import Quiz from '../components/Quiz';

export default function ScoredQuizRenderer({ data }) {
  const { meta, test_data } = data;
  const { questions, scoring, analysis, introduction, instructions } = test_data;

  const [step, setStep] = useState('intro'); // intro, sex-selection, quiz, calculating, results
  const [sex, setSex] = useState(null); // 'male' or 'female'
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of { types: [] }
  const [finalScore, setFinalScore] = useState(0);

  // Global keyboard shortcuts for intro/results
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (step === 'intro') {
          setStep('sex-selection');
        } else if (step === 'results') {
          window.location.reload();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  // Map the raw questions to the format Quiz component expects
  const formattedQuestions = questions.map(q => ({
    id: q.id,
    question: q.question,
    options: Object.entries(q.options).map(([key, text]) => ({
      id: key,
      text: text,
      type: key.toUpperCase() // A, B, C
    }))
  }));

  const startQuiz = (selectedSex) => {
    setSex(selectedSex);
    setStep('quiz');
  };

  const handleAnswer = (selectedTypes) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = { types: selectedTypes };
    setAnswers(newAnswers);

    if (qIndex < formattedQuestions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStep('calculating');
      calculateResults(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    }
  };

  const calculateResults = (allAnswers) => {
    let score = 0;
    const scoreTable = scoring[sex];

    allAnswers.forEach(ans => {
      if (!ans.types || ans.types.length === 0) {
        // Note: For any questions where the answers didn't accurately reflect your life or you left them blank, award yourself five points.
        score += 5;
      } else if (ans.types.length === 1) {
        score += scoreTable[ans.types[0]];
      } else if (ans.types.length === 2) {
        // If 2 options are chosen, each gets 0.5 of its score
        score += (scoreTable[ans.types[0]] * 0.5);
        score += (scoreTable[ans.types[1]] * 0.5);
      }
    });

    setFinalScore(score);
    setTimeout(() => setStep('results'), 1500);
  };

  return (
    <div className="flex flex-col justify-center min-h-[70vh] py-12">
      {/* INTRO */}
      {step === 'intro' && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up px-4 text-center">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
              Assessment
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              {meta.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic">
              {introduction}
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-2">
              <Info className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Instructions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{instructions}</p>
            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-violet-600 dark:text-violet-400 font-bold">💡 Tip:</span> If you feel two options apply equally, you can select <span className="underline decoration-violet-200 dark:decoration-violet-600">both</span>. If none apply, you can choose to skip.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setStep('sex-selection')}
              className="mx-auto px-8 py-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* SEX SELECTION */}
      {step === 'sex-selection' && (
        <div className="max-w-md mx-auto space-y-10 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Select your sex</h2>
            <p className="text-slate-500 dark:text-slate-400">The scoring varies slightly for men and women.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => startQuiz('male')}
              className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <User className="w-8 h-8 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
              </div>
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">Male</span>
            </button>

            <button
              onClick={() => startQuiz('female')}
              className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
                <UserPlus className="w-8 h-8 text-slate-400 group-hover:text-rose-500 dark:group-hover:text-rose-400" />
              </div>
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-400">Female</span>
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {step === 'quiz' && (
        <div className="max-w-lg mx-auto">
          <Quiz 
            questions={formattedQuestions} 
            qIndex={qIndex} 
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            multiSelect={true}
            maxSelections={2}
            allowSkip={true}
          />
        </div>
      )}

      {/* CALCULATING */}
      {step === 'calculating' && (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 dark:border-slate-100 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">Calculating your brain wiring score...</h3>
        </div>
      )}

      {/* RESULTS */}
      {step === 'results' && (
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in-up pb-20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Result</h2>
            <div className="inline-block p-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xl border-8 border-slate-100 dark:border-slate-800">
              <span className="text-6xl font-black">{finalScore}</span>
            </div>
            <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
              Brain Wiring Score
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="max-w-none">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Analysis</h3>
              {analysis.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 rounded-xl font-bold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
