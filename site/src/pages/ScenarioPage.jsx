import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getScenarioBySlug } from '../lib/loadScenarios';
import InteractiveRenderer from '../renderers/InteractiveRenderer';
import StoryRenderer from '../renderers/StoryRenderer';
import FableRenderer from '../renderers/FableRenderer';
import ScoredQuizRenderer from '../renderers/ScoredQuizRenderer';

const RENDERERS = {
  interactive: InteractiveRenderer,
  story: StoryRenderer,
  fable: FableRenderer,
  'scored-quiz': ScoredQuizRenderer,
};

export default function ScenarioPage() {
  const { slug } = useParams();
  const scenario = getScenarioBySlug(slug);

  if (!scenario) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">This story doesn't exist yet.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all stories
        </Link>
      </div>
    );
  }

  const Renderer = RENDERERS[scenario.meta.type];

  if (!Renderer) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">Unknown content type: {scenario.meta.type}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Back link (hidden during interactive intro for cleaner UX) */}
      {scenario.meta.type !== 'interactive' && (
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      )}
      <Renderer data={scenario} />
    </div>
  );
}
