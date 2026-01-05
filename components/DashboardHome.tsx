import React from 'react';
import { ActiveTab } from '../types';
import { SparklesIcon, TrendingUpIcon, VideoIcon, UserIcon, BarChartIcon } from './Icons';

interface DashboardHomeProps {
  onNavigate: (tab: ActiveTab) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
           <SparklesIcon className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao Creator Studio 🚀</h1>
          <p className="text-purple-100 max-w-xl">
            Sua central de inteligência para dominar as redes sociais. Gere roteiros, analise tendências e crie identidades visuais em segundos.
          </p>
          <button 
            onClick={() => onNavigate('STRATEGY')}
            className="mt-6 bg-white text-purple-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <SparklesIcon className="w-5 h-5" />
            Criar Novo Conteúdo
          </button>
        </div>
      </div>

      {/* Quick Stats (Mock) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
               <span className="text-slate-400 text-sm font-semibold uppercase">Ideias Geradas</span>
               <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><VideoIcon className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-bold text-white">24</div>
            <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
               <TrendingUpIcon className="w-3 h-3" /> +12% esta semana
            </div>
         </div>

         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
               <span className="text-slate-400 text-sm font-semibold uppercase">Engajamento Estimado</span>
               <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><BarChartIcon className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-bold text-white">High</div>
            <div className="text-slate-500 text-sm mt-1">Baseado em SEO</div>
         </div>

         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
               <span className="text-slate-400 text-sm font-semibold uppercase">Identidade do Canal</span>
               <div className="bg-pink-500/20 p-2 rounded-lg text-pink-400"><UserIcon className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-bold text-white">Ativo</div>
            <div className="text-slate-500 text-sm mt-1">Perfil Otimizado</div>
         </div>
      </div>

      {/* Trending Topics (Mock) */}
      <div>
         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon className="text-green-400 w-5 h-5" />
            Tendências do Mercado (Hoje)
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["AI Automation", "Shorts Storytelling", "ASMR Cooking", "Tech Reviews"].map((trend, i) => (
               <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg hover:border-slate-600 transition-colors cursor-pointer group">
                  <span className="text-xs text-slate-500 font-bold uppercase">#{i + 1} Trending</span>
                  <div className="text-lg font-semibold text-white mt-1 group-hover:text-blue-400 transition-colors">{trend}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DashboardHome;