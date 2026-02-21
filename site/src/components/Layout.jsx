import React from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
            Reframe
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto min-h-[90vh]">
        {children}
      </main>
    </div>
  );
}
