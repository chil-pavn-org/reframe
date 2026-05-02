import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 dark:bg-slate-950/80 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-bold text-lg tracking-tight flex items-center gap-2 hover:opacity-70 transition-opacity text-slate-900 dark:text-slate-100"
          >
            <div className="w-3 h-3 bg-slate-900 rounded-full dark:bg-slate-100" />
            Reframe
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto min-h-[90vh]">
        {children}
      </main>
    </div>
  );
}
