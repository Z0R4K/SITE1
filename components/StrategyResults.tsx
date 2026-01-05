import React, { useState } from 'react';
import { ContentStrategyResponse, UserInput, ContentIdea } from '../types';
import IdeaCard from './IdeaCard';
import CalendarView from './CalendarView';
import { TrendingUpIcon } from './Icons';

interface StrategyResultsProps {
  data: ContentStrategyResponse;
  userInput: UserInput;
  onGenerateScript: (idea: ContentIdea) => Promise<void>;
}

const StrategyResults: React.FC<StrategyResultsProps> = ({ data, userInput, onGenerateScript }) => {
  const [generatingIdeaTitle, setGeneratingIdeaTitle] = useState<string | null>(null);

  const handleGenerateClick = async (idea: ContentIdea) => {
    setGeneratingIdeaTitle(idea.title);
    await onGenerateScript(idea);
    setGeneratingIdeaTitle(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Estratégia Gerada</h2>
        <p className="text-slate-300 leading-relaxed mb-6">{data.strategySummary}</p>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm uppercase tracking-wide bg-purple-900/30 px-3 py-1 rounded-full">
            <TrendingUpIcon className="w-4 h-4" />
            Tendências Detectadas:
          </div>
          {data.trends?.map((trend, i) => (
            <span key={i} className="text-sm bg-slate-700/50 text-white px-3 py-1 rounded-full border border-slate-600">
              {trend}
            </span>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 pl-1 border-l-4 border-purple-500">Roteiros & Ideias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.ideas?.map((idea, index) => (
            <IdeaCard 
              key={index} 
              idea={idea} 
              index={index} 
              userInput={userInput}
              onGenerateScript={handleGenerateClick}
              isGenerating={generatingIdeaTitle === idea.title}
            />
          ))}
        </div>
      </div>

      {/* Calendar Section */}
      <CalendarView entries={data.calendar || []} />
    </div>
  );
};

export default StrategyResults;