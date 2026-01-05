import React, { useState } from 'react';
import { generateThumbnailImage } from '../services/geminiService';
import { ImageIcon, SparklesIcon } from './Icons';

interface ThumbnailStudioProps {
   onConsumeCredits?: (cost: number) => boolean;
   cost: number;
}

const ThumbnailStudio: React.FC<ThumbnailStudioProps> = ({ onConsumeCredits, cost }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Check credits if handler provided
    if (onConsumeCredits) {
       if (!onConsumeCredits(cost)) return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateThumbnailImage(prompt);
      setGeneratedImage(base64Image);
    } catch (err) {
      setError("Erro ao gerar imagem. Tente simplificar o prompt. Créditos não estornados (simulação).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="text-yellow-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Studio de Thumbnail</h2>
        </div>
        
        <p className="text-slate-400 mb-4 text-sm">
          Use o modelo <strong>Gemini 2.5 Flash Image</strong> (Nano Banana) para criar artes conceituais para seus vídeos. 
          <br/>Custo: {cost} créditos por geração.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma pessoa surpresa segurando um smartphone brilhante, fundo roxo neon, estilo cartoon 3D, alta qualidade, 4k..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`w-full font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
              isLoading || !prompt.trim()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 hover:scale-[1.01]'
            }`}
          >
            {isLoading ? 'Gerando Arte...' : 'Gerar Thumbnail'}
            {!isLoading && <SparklesIcon className="w-5 h-5" />}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex justify-center">
           <div className="relative group max-w-full">
              <img 
                src={generatedImage} 
                alt="Thumbnail Gerada" 
                className="rounded-lg shadow-2xl max-h-[500px] w-auto border border-slate-700" 
              />
              <a 
                href={generatedImage} 
                download="thumbnail_ai.png"
                className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
              >
                Baixar Imagem
              </a>
           </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailStudio;