import React from 'react';
import { Template } from '../types';
import { ShoppingBagIcon, VideoIcon, StarIcon, CheckIcon } from './Icons';

interface MarketplaceViewProps {
  onUseTemplate: (template: Template) => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onUseTemplate }) => {
  const templates: Template[] = [
    { id: '1', title: 'Viral TikTok Hook', description: 'Estrutura de 3 passos para prender a atenção em 2 segundos.', platform: 'TikTok', category: 'Viral', difficulty: 'Iniciante' },
    { id: '2', title: 'Tutorial Passo-a-Passo', description: 'O formato clássico "Como fazer X em Y passos".', platform: 'YouTube', category: 'Educativo', difficulty: 'Iniciante' },
    { id: '3', title: 'Storytelling Emocional', description: 'Narrativa profunda para conectar e vender.', platform: 'Reels', category: 'Vendas', difficulty: 'Avançado' },
    { id: '4', title: 'React / Comentário', description: 'Estrutura para reagir a notícias ou vídeos virais.', platform: 'YouTube', category: 'Entretenimento', difficulty: 'Intermediário' },
    { id: '5', title: 'Lista "Top 5"', description: 'Listicle rápido e dinâmico para retenção.', platform: 'Shorts', category: 'Informativo', difficulty: 'Iniciante' },
    { id: '6', title: 'Case Study / Análise', description: 'Análise profunda de um caso de sucesso.', platform: 'LinkedIn', category: 'Autoridade', difficulty: 'Avançado' },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-12">
       <div className="bg-gradient-to-r from-pink-900 to-purple-900 rounded-2xl p-8 border border-pink-700/50 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 opacity-10 p-4">
            <ShoppingBagIcon className="w-48 h-48" />
         </div>
         <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Marketplace de Templates</h2>
            <p className="text-pink-100 max-w-xl">
               Comece com estruturas validadas por grandes criadores. Escolha um modelo e a IA preencherá com seu nicho.
            </p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
             <div key={template.id} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-pink-500 transition-all duration-300 shadow-lg group flex flex-col">
                <div className="p-6 flex-grow">
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-pink-500/10 text-pink-400 p-2 rounded-lg">
                         <VideoIcon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded text-slate-900 ${
                         template.difficulty === 'Iniciante' ? 'bg-green-400' :
                         template.difficulty === 'Intermediário' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}>
                         {template.difficulty}
                      </span>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      {template.title}
                   </h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {template.description}
                   </p>
                   <div className="flex gap-2">
                      <span className="text-xs bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-700">
                         {template.platform}
                      </span>
                      <span className="text-xs bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-700">
                         {template.category}
                      </span>
                   </div>
                </div>
                <div className="p-4 border-t border-slate-700 bg-slate-900/30 rounded-b-xl">
                   <button 
                     onClick={() => onUseTemplate(template)}
                     className="w-full bg-slate-700 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                   >
                      <CheckIcon className="w-4 h-4" />
                      Usar Template
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default MarketplaceView;