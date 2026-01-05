import React from 'react';
import { ContentIdea, UserInput } from '../types';
import { VideoIcon, ImageIcon, LayoutIcon } from './Icons';

interface IdeaCardProps {
  idea: ContentIdea;
  index: number;
  userInput: UserInput;
  onGenerateScript: (idea: ContentIdea) => void;
  isGenerating: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index, onGenerateScript, isGenerating }) => {
  
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all duration-300 shadow-md group flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/20 text-purple-400 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <VideoIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-tight line-clamp-2">{idea.title}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Conceito #{index + 1}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-grow flex flex-col">
        {/* Idea Context */}
        <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/50">
           <p className="text-sm text-slate-300 italic mb-3">"{idea.description}"</p>
           
           <div className="space-y-2">
             <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-900/20 px-2 py-0.5 rounded">SEO Title</span>
                <span className="text-xs text-white font-medium">{idea.seoTitle}</span>
             </div>
             
             {idea.thumbnailSuggestion && (
               <div className="flex flex-wrap gap-2 items-start">
                  <span className="text-[10px] font-bold text-yellow-500 uppercase bg-yellow-900/20 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                    <ImageIcon className="w-3 h-3" /> Thumb
                  </span>
                  <p className="text-xs text-slate-400">{idea.thumbnailSuggestion}</p>
               </div>
             )}
             
             <div className="flex flex-wrap gap-1 mt-2">
               {idea.hashtags?.map((tag, i) => (
                 <span key={i} className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                   {tag}
                 </span>
               ))}
             </div>
           </div>
        </div>

        {/* Action Area */}
        <div className="flex-grow flex flex-col justify-end">
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <button 
                onClick={() => onGenerateScript(idea)}
                disabled={isGenerating}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  isGenerating 
                    ? 'bg-slate-700 text-slate-400 cursor-wait'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando Projeto...
                  </>
                ) : (
                  <>
                    <LayoutIcon className="w-4 h-4" />
                    Gerar Roteiro
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 mt-2">
                Cria um novo projeto e abre o editor
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;