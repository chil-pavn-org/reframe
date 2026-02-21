import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Bridge({ bridge, currentKey, onFlip }) {
  const otherSide = currentKey === 'fixer' ? 'emotion' : 'logic';
  const thisSide = currentKey === 'fixer' ? 'logic' : 'emotion';

  return (
    <div className="mt-20 pt-10 border-t border-slate-200">
      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">
            {bridge.prompt}
          </h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            You've seen the {thisSide}. Now, are you ready to understand the {otherSide}?
          </p>
          <button
            onClick={onFlip}
            className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            {bridge.cta} <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        {/* Decorative BG */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white,transparent)]"></div>
        </div>
      </div>
    </div>
  );
}
