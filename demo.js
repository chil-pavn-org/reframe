import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Eye, BookOpen, Heart, Brain, ChevronRight, Zap } from 'lucide-react';

// --- DATA & CONTENT ---

const SCENARIO_TITLE = "The Tuesday Night Meltdown";

const QUESTIONS = [
  {
    id: 1,
    question: "The world is ending. Who do you trust to save it?",
    options: [
      { id: 'A', text: "Dr. House / Sherlock Holmes", sub: "Brutal competence, even if they're mean.", type: 'fixer' },
      { id: 'B', text: "Ted Lasso / Captain America", sub: "Unwavering hope and team unity.", type: 'feeler' }
    ]
  },
  {
    id: 2,
    question: "You order a meal, but the waiter brings the wrong dish. It tastes okay. What do you do?",
    options: [
      { id: 'A', text: "Send it back.", sub: "Clarity is kindness. I pay for what I ordered.", type: 'fixer' },
      { id: 'B', text: "Eat it anyway.", sub: "It's not a big deal. I don't want to stress the staff.", type: 'feeler' }
    ]
  },
  {
    id: 3,
    question: "A friend shows you their passion project. Honestly? It's bad.",
    options: [
      { id: 'A', text: "Give honest critique.", sub: "Protecting them from public failure is real love.", type: 'fixer' },
      { id: 'B', text: "Tell them you love it.", sub: "Their confidence matters more than quality right now.", type: 'feeler' }
    ]
  }
];

const PERSPECTIVES = {
  fixer: {
    title: "The Architect of Solutions",
    subtitle: "Why I handed you a wrench when you were crying.",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    icon: <Brain className="w-6 h-6" />,
    content: `
      <p>I saw you drowning. That is what it felt like to me. You walked through the door, shoulders slumped, carrying the weight of that same argument with your boss.</p>
      <p>My chest tightened. I love you, and I hate seeing you in pain. My brain immediately went into override. <em>Analyze. Diagnose. Solve.</em></p>
      <p>"Did you send the email I suggested last time?" I asked. It wasn't an accusation; it was a diagnostics check. I was trying to find the lever to pull to stop the pain.</p>
      <p>When you pulled away and said, "You never listen," I felt paralyzed. I <em>was</em> listening. I was listening so hard I was already constructing a 5-step exit strategy for your job. I wanted to be your hero. I wanted to fix the leak in the boat.</p>
      <p>To me, sitting there and just nodding while you suffer feels like negligence. It feels like watching a car crash and refusing to call an ambulance. Why would I just hold your hand when I have the tool to stop the bleeding?</p>
    `
  },
  feeler: {
    title: "The Keeper of the Vibe",
    subtitle: "Why I needed a hug, not a lecture.",
    color: "bg-rose-600",
    textColor: "text-rose-600",
    icon: <Heart className="w-6 h-6" />,
    content: `
      <p>I didn't come home for a career consultant. I came home for my partner.</p>
      <p>The moment I started speaking, I saw your eyes glaze over. You weren't hearing <em>me</em>; you were scanning for data points. You were waiting for a pause so you could insert your flowchart.</p>
      <p>"Did you send the email?" you interrupted. In that moment, I felt so small. It wasn't about the email. It was about the disrespect. It was about the feeling of being trapped.</p>
      <p>When you offer solutions before I've even finished the sentence, you aren't being helpful. You're being dismissive. You're telling me, <em>"Your emotions are a problem, and I need to solve them so you'll stop making that noise."</em></p>
      <p>I don't need you to fix the leak right now. I need you to acknowledge that I'm wet. I need to know that if the boat sinks, you're holding my hand, not grading my swimming technique.</p>
    `
  }
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-500 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "" }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
    fixer: "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100",
    feeler: "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- MAIN APP ---

export default function App() {
  const [step, setStep] = useState('intro'); // intro, quiz, calculating, router, content
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState({ fixer: 0, feeler: 0 });
  const [userType, setUserType] = useState(null); // 'fixer' or 'feeler'
  const [viewMode, setViewMode] = useState(null); // 'mirror' or 'window'
  const [currentPerspective, setCurrentPerspective] = useState(null); // 'fixer' or 'feeler'

  // Handle quiz answers
  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // Quiz finished
      setStep('calculating');
      // Determine dominant type (default to fixer if tie for demo purposes)
      const result = newScores.fixer >= newScores.feeler ? 'fixer' : 'feeler';
      setUserType(result);
      setTimeout(() => setStep('router'), 1500);
    }
  };

  // Handle Router selection (Mirror vs Window)
  const handleRouter = (mode) => {
    setViewMode(mode);
    if (mode === 'mirror') {
      setCurrentPerspective(userType);
    } else {
      setCurrentPerspective(userType === 'fixer' ? 'feeler' : 'fixer');
    }
    setStep('content');
  };

  // Switch perspective (The Bridge)
  const togglePerspective = () => {
    setCurrentPerspective(prev => prev === 'fixer' ? 'feeler' : 'fixer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetDemo = () => {
    setStep('intro');
    setQIndex(0);
    setScores({ fixer: 0, feeler: 0 });
    setUserType(null);
    setViewMode(null);
    setCurrentPerspective(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-200">
      
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
            TwoSides
          </span>
          <button onClick={resetDemo} className="text-xs font-medium text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto min-h-[90vh] flex flex-col justify-center">
        
        {/* STEP 1: INTRO */}
        {step === 'intro' && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
              Interactive Story
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              The Tuesday <br/> Night Meltdown
            </h1>
            <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
              Two people. One argument. Two completely different realities. 
              Before you read the story, we need to know who <em>you</em> are.
            </p>
            <div className="pt-4">
              <Button onClick={() => setStep('quiz')} className="mx-auto w-full md:w-auto">
                Begin Assessment <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: QUIZ */}
        {step === 'quiz' && (
          <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-400">
              <span>Question {qIndex + 1} of {QUESTIONS.length}</span>
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= qIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 leading-snug">
              {QUESTIONS[qIndex].question}
            </h2>

            <div className="space-y-4">
              {QUESTIONS[qIndex].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.type)}
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
        )}

        {/* STEP 3: CALCULATING */}
        {step === 'calculating' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-slate-900">Analyzing your perspective...</h3>
          </div>
        )}

        {/* STEP 4: ROUTER (Mirror vs Window) */}
        {step === 'router' && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-block p-3 bg-slate-100 rounded-full mb-2">
              <Zap className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              We've found your match.
            </h2>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              You lean towards <strong className="text-slate-900">{userType === 'fixer' ? 'Logic & Solutions' : 'Empathy & Connection'}</strong>.
              <br/>
              How do you want to experience this story?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
              <Card className="hover:ring-2 hover:ring-slate-900 cursor-pointer group" >
                <button onClick={() => handleRouter('mirror')} className="w-full p-8 text-left h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Mirror</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Show me the perspective I agree with. Validate my feelings first.
                    </p>
                  </div>
                  <div className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900">
                    Recommended for comfort
                  </div>
                </button>
              </Card>

              <Card className="hover:ring-2 hover:ring-slate-900 cursor-pointer group">
                <button onClick={() => handleRouter('window')} className="w-full p-8 text-left h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Window</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Show me the opposing perspective. Challenge me immediately.
                    </p>
                  </div>
                  <div className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900">
                    Recommended for growth
                  </div>
                </button>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 5: CONTENT (The Blog) */}
        {step === 'content' && currentPerspective && (
          <div className="animate-in fade-in duration-1000">
            {/* Context Header */}
            <div className="mb-12 text-center">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2 block">
                Reading Mode: {viewMode === 'mirror' ? 'Validation' : 'Challenge'}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                {PERSPECTIVES[currentPerspective].title}
              </h1>
              <h2 className={`text-lg font-medium italic ${PERSPECTIVES[currentPerspective].textColor}`}>
                {PERSPECTIVES[currentPerspective].subtitle}
              </h2>
            </div>

            {/* Author/Type Pill */}
            <div className="flex justify-center mb-10">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${PERSPECTIVES[currentPerspective].color} bg-opacity-10`}>
                <div className={`${PERSPECTIVES[currentPerspective].textColor}`}>
                  {PERSPECTIVES[currentPerspective].icon}
                </div>
                <span className={`text-sm font-bold uppercase tracking-wide ${PERSPECTIVES[currentPerspective].textColor}`}>
                  Perspective: The {currentPerspective}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <article 
              className="prose prose-lg prose-slate mx-auto font-serif leading-loose first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: PERSPECTIVES[currentPerspective].content }}
            />

            {/* The Bridge (Footer) */}
            <div className="mt-20 pt-10 border-t border-slate-200">
              <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">
                    There are two sides to every story.
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    You've seen the {currentPerspective === 'fixer' ? 'logic' : 'emotion'}. 
                    Now, are you ready to understand the {currentPerspective === 'fixer' ? 'emotion' : 'logic'}?
                  </p>
                  <button 
                    onClick={togglePerspective}
                    className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                  >
                     Flip the Narrative <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Decorative BG element */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white,transparent)]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
