import React, { useState, useEffect } from 'react';
import { ScriptProject } from '../types';
import { generateThumbnailImage } from '../services/geminiService';
import { VideoIcon, PaletteIcon, BarChartIcon, CopyIcon, CheckIcon, ImageIcon, MusicIcon, SubtitlesIcon, DownloadIcon, UsersIcon, FileTextIcon, ShareIcon, TrashIcon, ExternalLinkIcon, EditIcon, SettingsIcon, PrinterIcon, ArrowLeftIcon } from './Icons';

interface ScriptEditorViewProps {
  project: ScriptProject;
  onUpdate: (updatedProject: ScriptProject) => void;
  onConsumeCredits: (cost: number) => boolean;
  thumbnailCost: number;
  onBack: () => void;
}

type ViewMode = 'EDITOR' | 'STUDIO';

const ScriptEditorView: React.FC<ScriptEditorViewProps> = ({ project, onUpdate, onConsumeCredits, thumbnailCost, onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('EDITOR');
  const [copied, setCopied] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Auto-save visual feedback
  useEffect(() => {
    if (saveStatus === 'saving') {
      const timer = setTimeout(() => setSaveStatus('saved'), 1000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, project]);

  const handleUpdate = (newProject: ScriptProject) => {
    setSaveStatus('saving');
    onUpdate(newProject);
  };

  const handleSectionChange = (index: number, field: 'content' | 'visualCue' | 'audioCue', value: string) => {
    const updatedSections = [...(project.sections || [])];
    if (updatedSections[index]) {
       updatedSections[index] = { ...updatedSections[index], [field]: value };
       handleUpdate({ ...project, sections: updatedSections, lastModified: new Date().toISOString() });
    }
  };

  const handleCopyScript = () => {
    const text = (project.sections || []).map(s => `[${s.label}]\nVISUAL: ${s.visualCue}\nÁUDIO: ${s.audioCue || 'N/A'}\nFALA: ${s.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- EXPORT FUNCTIONS ---

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportTXT = () => {
    const text = `PROJETO: ${project.title}\nPLATAFORMA: ${project.platform}\nDATA: ${new Date().toLocaleDateString()}\n\n` + 
      (project.sections || []).map(s => 
      `------------------------------------------------\nSEÇÃO: ${s.label.toUpperCase()}\n------------------------------------------------\n\n[VISUAL]\n${s.visualCue}\n\n[ÁUDIO]\n${s.audioCue || 'N/A'}\n\n[ROTEIRO]\n"${s.content}"\n`
    ).join('\n');
    downloadFile(text, `${project.title.replace(/\s+/g, '_')}_roteiro.txt`, 'text/plain');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(project, null, 2);
    downloadFile(json, `${project.title.replace(/\s+/g, '_')}_project.json`, 'application/json');
  };

  const handleExportSRT = () => {
    let srtContent = "";
    let currentTime = 0;

    (project.sections || []).forEach((section, index) => {
       // Estimate duration: approx 0.3 sec per word or minimum 2 sec
       const words = section.content.split(/\s+/).length;
       const duration = Math.max(2, words * 0.4); 
       
       const formatTime = (seconds: number) => {
          const date = new Date(0);
          date.setSeconds(seconds);
          date.setMilliseconds((seconds % 1) * 1000);
          return date.toISOString().substr(11, 12).replace('.', ',');
       };

       const start = formatTime(currentTime);
       const end = formatTime(currentTime + duration);

       srtContent += `${index + 1}\n${start} --> ${end}\n${section.content}\n\n`;
       currentTime += duration;
    });

    downloadFile(srtContent, `${project.title.replace(/\s+/g, '_')}_legendas.srt`, 'text/plain');
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  // --- THUMBNAIL LOGIC ---

  const handleGenerateThumbnail = async () => {
    if (!project.thumbnailSuggestion || isGeneratingThumbnail) return;
    
    if (!onConsumeCredits(thumbnailCost)) return;

    setIsGeneratingThumbnail(true);
    try {
       const url = await generateThumbnailImage(project.thumbnailSuggestion);
       handleUpdate({
          ...project,
          generatedThumbnailUrl: url,
          lastModified: new Date().toISOString()
       });
    } catch (e) {
       console.error(e);
       alert("Não foi possível gerar a thumbnail no momento.");
    } finally {
       setIsGeneratingThumbnail(false);
    }
  };

  const handleCanvaExport = () => {
      alert(`Redirecionando para o Canva...`);
      window.open('https://www.canva.com', '_blank');
  };

  const handleCopyPrompt = () => {
      if (project.thumbnailSuggestion) {
          navigator.clipboard.writeText(project.thumbnailSuggestion);
          alert("Prompt copiado!");
      }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      
      {/* --- PRINT STYLES --- */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-script, .printable-script * { visibility: visible; }
          .printable-script { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; color: black; background: white; z-index: 9999; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* --- PRINTABLE HIDDEN AREA --- */}
      <div className="printable-script hidden">
         <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>{project.title}</h1>
         <p style={{marginBottom: '20px'}}><strong>Plataforma:</strong> {project.platform}</p>
         <hr/>
         {project.sections.map((s, i) => (
            <div key={i} style={{marginBottom: '30px', marginTop: '20px'}}>
               <h3 style={{fontWeight: 'bold', textTransform: 'uppercase'}}>{s.label}</h3>
               <p><strong>Visual:</strong> {s.visualCue}</p>
               <p><strong>Áudio:</strong> {s.audioCue}</p>
               <p style={{background: '#f0f0f0', padding: '10px', marginTop: '5px', borderRadius: '5px'}}>"{s.content}"</p>
            </div>
         ))}
      </div>

      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-700 p-4 flex flex-col md:flex-row justify-between items-center gap-4 no-print sticky top-0 z-30 shadow-lg">
         {/* Left: Title & Navigation */}
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
               onClick={onBack}
               className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-2 rounded-full transition-colors border border-slate-700"
               title="Voltar para Biblioteca"
            >
               <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
               <input 
                  type="text" 
                  value={project.title}
                  onChange={(e) => handleUpdate({...project, title: e.target.value})}
                  className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-slate-600 w-full min-w-[300px]"
               />
               <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded uppercase font-bold border border-purple-500/20">
                     {project.platform}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-slate-600"></div>
                  <span className={`text-[10px] flex items-center gap-1 transition-colors ${saveStatus === 'saving' ? 'text-yellow-400' : 'text-slate-500'}`}>
                     {saveStatus === 'saving' ? (
                        <><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div> Salvando...</>
                     ) : (
                        <><CheckIcon className="w-3 h-3" /> Salvo</>
                     )}
                  </span>
               </div>
            </div>
         </div>

         {/* Center: Mode Switcher */}
         <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center shadow-inner">
            <button
               onClick={() => setViewMode('EDITOR')}
               className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'EDITOR' 
                     ? 'bg-slate-700 text-white shadow-md transform scale-105' 
                     : 'text-slate-500 hover:text-white'
               }`}
            >
               <EditIcon className="w-4 h-4" /> Escrita
            </button>
            <button
               onClick={() => setViewMode('STUDIO')}
               className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'STUDIO' 
                     ? 'bg-slate-700 text-white shadow-md transform scale-105' 
                     : 'text-slate-500 hover:text-white'
               }`}
            >
               <SettingsIcon className="w-4 h-4" /> Estúdio
            </button>
         </div>

         {/* Right: Actions */}
         <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button 
                 onClick={() => setShowExportMenu(!showExportMenu)}
                 className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-slate-700"
                 title="Exportar"
              >
                 <DownloadIcon className="w-4 h-4" /> Exportar
              </button>
              {showExportMenu && (
                 <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button onClick={handleExportTXT} className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white text-sm flex items-center gap-2">
                       <FileTextIcon className="w-4 h-4 text-blue-400" /> Arquivo de Texto (.txt)
                    </button>
                    <button onClick={handleExportJSON} className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white text-sm flex items-center gap-2 border-t border-slate-700">
                       <FileTextIcon className="w-4 h-4 text-yellow-400" /> Backup Projeto (.json)
                    </button>
                    <button onClick={handlePrint} className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white text-sm flex items-center gap-2 border-t border-slate-700">
                       <PrinterIcon className="w-4 h-4 text-slate-400" /> Imprimir / PDF
                    </button>
                    <button onClick={handleExportSRT} className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white text-sm flex items-center gap-2 border-t border-slate-700">
                       <SubtitlesIcon className="w-4 h-4 text-green-400" /> Legendas (.srt)
                    </button>
                 </div>
              )}
            </div>

            <button 
               onClick={handleCopyScript}
               className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
            >
               {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
               {copied ? 'Copiado' : 'Copiar'}
            </button>
         </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-grow overflow-hidden no-print">
         
         {/* Main Workspace */}
         <div className="lg:col-span-8 h-full overflow-y-auto custom-scrollbar bg-slate-900/50">
            
            {viewMode === 'EDITOR' && (
               <div className="p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
                  {project.sections?.map((section, idx) => (
                     <div key={idx} className="relative pl-6 border-l-2 border-slate-800 hover:border-purple-500 transition-colors group">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-slate-700 rounded-full group-hover:border-purple-500 transition-colors"></div>
                        
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold uppercase text-purple-400 tracking-wide bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">{section.label}</span>
                        </div>
                        
                        <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 shadow-sm focus-within:shadow-lg focus-within:border-purple-500/50 transition-all">
                           
                           {/* Main Script Input */}
                           <div className="mb-4">
                              <label className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-2 mb-2">
                                 <FileTextIcon className="w-3 h-3" /> Narração
                              </label>
                              <textarea 
                                 value={section.content}
                                 onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                                 className="w-full bg-transparent border-none p-0 text-slate-100 text-lg leading-relaxed focus:outline-none focus:ring-0 min-h-[80px] resize-y font-medium placeholder-slate-700"
                                 placeholder="Escreva o roteiro aqui..."
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                              {/* Visual Cue */}
                              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                                 <label className="text-[10px] text-blue-400 uppercase font-bold mb-1 block flex items-center gap-2">
                                    <VideoIcon className="w-3 h-3" /> Visual
                                 </label>
                                 <textarea 
                                    value={section.visualCue || ''}
                                    onChange={(e) => handleSectionChange(idx, 'visualCue', e.target.value)}
                                    className="w-full bg-transparent border-none p-0 text-slate-400 text-sm focus:outline-none focus:ring-0 min-h-[40px] resize-y italic"
                                    placeholder="Descreva a cena visual..."
                                 />
                              </div>

                              {/* Audio Cue */}
                              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                                 <label className="text-[10px] text-yellow-500/80 uppercase font-bold mb-1 block flex items-center gap-2">
                                    <MusicIcon className="w-3 h-3" /> Áudio / SFX
                                 </label>
                                 <textarea 
                                    value={section.audioCue || ''}
                                    onChange={(e) => handleSectionChange(idx, 'audioCue', e.target.value)}
                                    className="w-full bg-transparent border-none p-0 text-slate-400 text-sm focus:outline-none focus:ring-0 min-h-[40px] resize-y italic"
                                    placeholder="Sugestão de som..."
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {viewMode === 'STUDIO' && (
               <div className="p-8 space-y-6 animate-fade-in max-w-4xl mx-auto">
                  <div className="mb-6">
                     <h2 className="text-2xl font-bold text-white mb-2">Estúdio de Pós-Produção</h2>
                     <p className="text-slate-400">Refine os detalhes técnicos de áudio e legendas do seu roteiro.</p>
                  </div>

                  {/* Audio Section */}
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MusicIcon className="w-5 h-5 text-yellow-400" />
                        Direção de Áudio & SFX
                     </h3>
                     <p className="text-sm text-slate-400 mb-6 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        Defina a atmosfera sonora para cada cena. Isso ajuda o editor a escolher a trilha correta.
                     </p>
                     
                     <div className="space-y-4">
                        {project.sections?.map((section, idx) => (
                           <div key={idx} className="flex gap-4 items-start p-4 bg-slate-900/30 rounded-xl border border-slate-700 hover:border-yellow-500/30 transition-colors">
                              <div className="w-32 pt-2 shrink-0">
                                 <span className="text-xs font-bold text-slate-500 uppercase block">{section.label}</span>
                                 <span className="text-[10px] text-slate-600">Cena {idx + 1}</span>
                              </div>
                              <div className="flex-grow">
                                 <textarea 
                                    value={section.audioCue || ''}
                                    onChange={(e) => handleSectionChange(idx, 'audioCue', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-yellow-100 text-sm focus:outline-none focus:border-yellow-500 min-h-[60px]"
                                    placeholder="Ex: Música tensa sobe, efeito de glitch, som de notificação..."
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Captions Section */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                     <div className="bg-slate-700/50 p-4 rounded-full mb-4 ring-4 ring-slate-800">
                        <SubtitlesIcon className="w-8 h-8 text-green-400" />
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2">Legendas Automáticas (.SRT)</h3>
                     <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                        Gere um arquivo de legenda sincronizado baseado na contagem de palavras do seu roteiro. Ideal para pré-visualização.
                     </p>
                     <button 
                        onClick={handleExportSRT}
                        className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-green-900/20 inline-flex items-center gap-2"
                     >
                        <DownloadIcon className="w-4 h-4" /> Baixar Arquivo .SRT
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* Sidebar Tools (Right Panel) */}
         <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto h-full p-6 bg-slate-900 border-l border-slate-800 custom-scrollbar shadow-2xl z-10">
            
            {/* Engagement Score */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-md">
               <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <BarChartIcon className="w-4 h-4 text-green-400" />
                  Score de Retenção
               </h3>
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold text-white tracking-tighter">{project.analytics?.retentionScore || 0}</span>
                  <span className="text-slate-500 text-sm mb-1.5 font-medium">/ 100</span>
               </div>
               <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
                  <div 
                     className="bg-gradient-to-r from-red-500 to-green-500 h-full transition-all duration-1000" 
                     style={{ width: `${project.analytics?.retentionScore || 0}%` }}
                  ></div>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Potencial</span>
                  <span className="text-white font-medium text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                     {project.analytics?.estimatedEngagement || 'N/A'}
                  </span>
               </div>
            </div>

            {/* Thumbnail Studio */}
            <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
               <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <PaletteIcon className="w-4 h-4 text-yellow-400" />
                  Thumbnail AI
               </h3>
               
               {project.generatedThumbnailUrl ? (
                  <div className="space-y-4">
                     <div className="relative group">
                        <img src={project.generatedThumbnailUrl} alt="Thumbnail AI" className="w-full rounded-lg shadow-md border border-slate-700 transition-transform group-hover:scale-[1.02]" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg gap-2">
                            <a href={project.generatedThumbnailUrl} download={`thumb-${project.id}.png`} className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-200" title="Baixar">
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                            <button onClick={() => handleUpdate({ ...project, generatedThumbnailUrl: undefined })} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600" title="Excluir">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                     </div>
                     
                     <button 
                        onClick={handleCanvaExport}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 border border-slate-700"
                     >
                        <ExternalLinkIcon className="w-3 h-3" /> Editar no Canva
                     </button>
                  </div>
               ) : (
                  <>
                     {project.thumbnailSuggestion && (
                        <div className="bg-slate-900/80 p-3 rounded-lg text-xs text-slate-300 mb-4 italic border border-slate-700 relative group">
                           "{project.thumbnailSuggestion}"
                           <button 
                              onClick={handleCopyPrompt}
                              className="absolute top-2 right-2 p-1 bg-slate-700 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                              title="Copiar Prompt"
                           >
                              <CopyIcon className="w-3 h-3" />
                           </button>
                        </div>
                     )}
                     <div className="space-y-2">
                        <button 
                           onClick={handleGenerateThumbnail}
                           disabled={isGeneratingThumbnail || !project.thumbnailSuggestion}
                           className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg ${
                              isGeneratingThumbnail 
                                 ? 'bg-slate-700 text-slate-400 cursor-wait' 
                                 : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-yellow-900/20'
                           }`}
                        >
                           {isGeneratingThumbnail ? (
                              <>
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                                 Gerando...
                              </>
                           ) : (
                              <>
                                 <ImageIcon className="w-4 h-4" />
                                 Gerar ( {thumbnailCost} Créditos )
                              </>
                           )}
                        </button>
                        <button 
                           onClick={handleCanvaExport}
                           className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <ExternalLinkIcon className="w-3 h-3" />
                           Criar no Canva
                        </button>
                     </div>
                  </>
               )}
            </div>

            {/* Team */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
               <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <UsersIcon className="w-4 h-4 text-blue-400" />
                  Equipe
               </h3>
               <div className="flex -space-x-2 overflow-hidden mb-3">
                  <div className="inline-block h-8 w-8 rounded-full bg-slate-600 ring-2 ring-slate-800 flex items-center justify-center text-xs font-bold text-white">EU</div>
                  <button className="inline-block h-8 w-8 rounded-full bg-slate-700 ring-2 ring-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-600 hover:text-white transition-colors">
                     +
                  </button>
               </div>
               <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Convidar editor...</button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ScriptEditorView;