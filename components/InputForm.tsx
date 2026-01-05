import React, { useState } from 'react';
import { UserInput, ContentLength } from '../types';
import { SparklesIcon } from './Icons';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    niche: '',
    platform: 'Instagram Reels',
    objective: 'Educar e Vender',
    contentLength: 'SHORT',
    style: 'Tutorial / Educativo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLengthChange = (length: ContentLength) => {
    let defaultPlatform = length === 'SHORT' ? 'Instagram Reels' : 'YouTube Vídeo';
    setFormData({ ...formData, contentLength: length, platform: defaultPlatform });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <SparklesIcon className="text-purple-400 w-5 h-5" />
        Configuração do Projeto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Toggle Short/Long */}
        <div className="space-y-2">
           <label className="block text-xs font-bold text-slate-500 uppercase">Formato</label>
           <div className="bg-slate-900/50 p-1 rounded-lg flex border border-slate-700">
            <button
              type="button"
              onClick={() => handleLengthChange('SHORT')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.contentLength === 'SHORT'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curto (Shorts)
            </button>
            <button
              type="button"
              onClick={() => handleLengthChange('LONG')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.contentLength === 'LONG'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Longo (YouTube)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nicho / Tema</label>
          <input
            type="text"
            name="niche"
            required
            placeholder="Ex: Marketing Digital, Culinária, Games..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={formData.niche}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plataforma</label>
            <select
              name="platform"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.platform}
              onChange={handleChange}
            >
              {formData.contentLength === 'SHORT' ? (
                <>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </>
              ) : (
                <>
                  <option value="YouTube Vídeo">YouTube (Longo)</option>
                  <option value="Podcast">Videocast / Podcast</option>
                  <option value="Aula Online">Aula / Curso</option>
                  <option value="LinkedIn Video">LinkedIn (Artigo)</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Objetivo</label>
            <select
              name="objective"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.objective}
              onChange={handleChange}
            >
              <option value="Educar e Vender">Educar e Vender</option>
              <option value="Entreter e Viralizar">Entreter e Viralizar</option>
              <option value="Gerar Autoridade">Gerar Autoridade</option>
              <option value="Retenção e Fidelidade">Retenção</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estilo / Tom</label>
           <select
              name="style"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.style}
              onChange={handleChange}
            >
              <option value="Tutorial / Educativo">Tutorial / Educativo</option>
              <option value="Divertido / Humor">Divertido / Humor</option>
              <option value="Inspiracional / Storytelling">Inspiracional / Storytelling</option>
              <option value="Polêmico / Opinativo">Polêmico / Opinativo</option>
              <option value="Minimalista / Estético">Minimalista / Estético</option>
              <option value="Jornalístico / Informativo">Jornalístico / Informativo</option>
            </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold uppercase tracking-wide py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transform hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Gerar Estratégia
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;