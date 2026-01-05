import React, { useState } from 'react';
import { ScriptProject } from '../types';
import { FileTextIcon, EditIcon, TrashIcon, VideoIcon, SearchIcon, FilterIcon } from './Icons';

interface ScriptLibraryViewProps {
  projects: ScriptProject[];
  onOpenProject: (project: ScriptProject) => void;
  onDeleteProject: (projectId: string) => void;
}

const ScriptLibraryView: React.FC<ScriptLibraryViewProps> = ({ projects, onOpenProject, onDeleteProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');

  const safeProjects = projects || [];

  // Logic for filtering
  const filteredProjects = safeProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'ALL' || p.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const uniquePlatforms = Array.from(new Set(safeProjects.map(p => p.platform)));
  
  if (safeProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
         <div className="bg-slate-800 p-6 rounded-full mb-4 shadow-xl">
            <FileTextIcon className="w-12 h-12 text-slate-500" />
         </div>
         <h3 className="text-xl font-bold text-white mb-2">Nenhum roteiro salvo ainda</h3>
         <p className="text-slate-400 max-w-md">
            Gere novas ideias na aba Estratégia e clique em "Gerar Roteiro" para salvá-los automaticamente aqui.
         </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Biblioteca de Roteiros</h2>
            <p className="text-slate-400">Organize, busque e edite seus projetos de conteúdo.</p>
          </div>
          <div className="text-sm text-slate-500 font-bold bg-slate-800 px-3 py-1 rounded-lg">
             Total: {safeProjects.length}
          </div>
       </div>

       {/* Smart Filter Bar */}
       <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col md:flex-row gap-4">
         <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por título ou palavra-chave..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
         </div>
         <div className="relative min-w-[200px]">
            <FilterIcon className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
            <select 
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
               <option value="ALL">Todas as Plataformas</option>
               {uniquePlatforms.map(p => (
                 <option key={p} value={p}>{p}</option>
               ))}
            </select>
         </div>
       </div>

       {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
             Nenhum projeto encontrado para os filtros selecionados.
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredProjects.map((project) => (
                <div key={project.id} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all shadow-lg flex flex-col group hover:-translate-y-1 duration-300">
                   <div className="p-5 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                         <div className="bg-blue-900/30 text-blue-400 p-2 rounded-lg">
                            <VideoIcon className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                            {project.platform}
                         </span>
                      </div>
                      <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
                         {project.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                         {project.description}
                      </p>
                      <div className="text-xs text-slate-500 flex justify-between items-center mt-auto pt-4 border-t border-slate-700/30">
                         <span>Editado: {new Date(project.lastModified).toLocaleDateString()}</span>
                         <span className="flex items-center gap-1 text-green-500/80">
                            ● Ativo
                         </span>
                      </div>
                   </div>
                   
                   <div className="p-4 border-t border-slate-700/50 flex gap-3 bg-slate-900/30 rounded-b-xl">
                      <button 
                        onClick={() => onOpenProject(project)}
                        className="flex-1 bg-white text-slate-900 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors text-sm shadow-sm"
                      >
                         <EditIcon className="w-4 h-4" /> Editar
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
                        title="Excluir"
                      >
                         <TrashIcon className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};

export default ScriptLibraryView;