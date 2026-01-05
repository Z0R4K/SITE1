import React, { useState } from 'react';
import { ChannelSetupResponse } from '../types';
import { UserIcon, CopyIcon, CheckIcon, DollarIcon, TrendingUpIcon } from './Icons';

interface ChannelSetupViewProps {
  data: ChannelSetupResponse;
}

const ChannelSetupView: React.FC<ChannelSetupViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Canal: ${data.name}\nHandle: ${data.handle}\nBio: ${data.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <UserIcon className="w-48 h-48" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserIcon className="text-pink-500 w-6 h-6" />
              Perfil do Canal
            </h2>
             <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600"
            >
              {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar Dados"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-slate-500">Nome do Canal</label>
                <div className="text-3xl font-bold text-white tracking-tight">{data.name}</div>
                <div className="text-purple-400 font-mono text-sm">{data.handle}</div>
              </div>
              
              <div>
                <label className="text-xs uppercase font-bold text-slate-500">Bio / Descrição</label>
                <p className="text-slate-300 leading-relaxed mt-1">{data.description}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                  <label className="text-xs uppercase font-bold text-pink-400 mb-2 block">Ideia de Avatar</label>
                  <p className="text-sm text-slate-300">{data.avatarIdea}</p>
               </div>
               <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                  <label className="text-xs uppercase font-bold text-blue-400 mb-2 block">Ideia de Banner</label>
                  <p className="text-sm text-slate-300">{data.bannerIdea}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Tips */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-green-400" />
            Dicas de Crescimento
          </h3>
          <ul className="space-y-3">
            {data.initialTips?.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                  {idx + 1}
                </div>
                <p className="text-slate-300 text-sm">{tip}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Monetization Strategy */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarIcon className="w-5 h-5 text-yellow-400" />
            Estratégia de Monetização
          </h3>
          {data.monetizationTips?.length > 0 ? (
            <ul className="space-y-4">
              {data.monetizationTips?.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-500 text-sm text-center py-4">
               Nenhuma estratégia gerada. Tente gerar novamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSetupView;