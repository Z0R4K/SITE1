import React, { useState } from 'react';
import { UserProfile, AuditLogEntry } from '../types';
import { UserIcon, LockIcon, BellIcon, GridIcon, FileTextIcon } from './Icons';

interface SettingsViewProps {
  user: UserProfile;
  history?: AuditLogEntry[];
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, history }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'HISTORY'>('GENERAL');
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    marketing: true
  });
  
  const [integrations, setIntegrations] = useState({
    googleDrive: true,
    youtube: false,
    tiktok: false,
    notion: false
  });

  const toggleIntegration = (key: keyof typeof integrations) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white">Configurações</h2>
           <p className="text-slate-400">Gerencie suas preferências, integrações e veja seu consumo.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
           <button 
              onClick={() => setActiveTab('GENERAL')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'GENERAL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
           >
              Geral
           </button>
           <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'HISTORY' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
           >
              Histórico & Consumo
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card (Always Visible) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl">
                   {user.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{user.email}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  user.plan === 'PREMIUM' ? 'bg-blue-500/20 text-blue-400' :
                  user.plan === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-slate-600/20 text-slate-400'
                }`}>
                  Plano {user.plan}
                </span>
             </div>
             <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                <button className="w-full text-left text-sm text-slate-300 hover:text-white flex items-center gap-2 py-1">
                   <UserIcon className="w-4 h-4" /> Editar Perfil
                </button>
                <button className="w-full text-left text-sm text-slate-300 hover:text-white flex items-center gap-2 py-1">
                   <LockIcon className="w-4 h-4" /> Alterar Senha
                </button>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
           
           {activeTab === 'GENERAL' && (
              <>
               {/* Integrations */}
               <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <GridIcon className="w-5 h-5 text-blue-400" />
                     Integrações
                  </h3>
                  <div className="space-y-4">
                     {[
                       { id: 'googleDrive', label: 'Google Drive', desc: 'Salvar roteiros automaticamente', icon: '📁' },
                       { id: 'youtube', label: 'YouTube Studio', desc: 'Publicação direta (Beta)', icon: '▶️' },
                       { id: 'tiktok', label: 'TikTok for Business', desc: 'Analytics e Agendamento', icon: '🎵' },
                       { id: 'notion', label: 'Notion', desc: 'Sincronizar calendário editorial', icon: '📝' },
                     ].map((integration) => (
                       <div key={integration.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-3">
                             <div className="text-2xl">{integration.icon}</div>
                             <div>
                                <div className="font-semibold text-white text-sm">{integration.label}</div>
                                <div className="text-xs text-slate-400">{integration.desc}</div>
                             </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={integrations[integration.id as keyof typeof integrations]} 
                              onChange={() => toggleIntegration(integration.id as keyof typeof integrations)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Notifications */}
               <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <BellIcon className="w-5 h-5 text-yellow-400" />
                     Preferências de Notificação
                  </h3>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 text-slate-300 cursor-pointer hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-800" />
                        <span className="text-sm">Receber resumo semanal por e-mail</span>
                     </label>
                     <label className="flex items-center gap-3 text-slate-300 cursor-pointer hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <input type="checkbox" checked={notifications.browser} onChange={() => setNotifications({...notifications, browser: !notifications.browser})} className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-800" />
                        <span className="text-sm">Alertas de tendências no navegador</span>
                     </label>
                     <label className="flex items-center gap-3 text-slate-300 cursor-pointer hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <input type="checkbox" checked={notifications.marketing} onChange={() => setNotifications({...notifications, marketing: !notifications.marketing})} className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-800" />
                        <span className="text-sm">Novidades e ofertas de produtos</span>
                     </label>
                  </div>
               </div>

               {/* Preferences */}
               <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                   <h3 className="text-lg font-bold text-white mb-4">Preferências de Conteúdo</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Idioma Padrão</label>
                        <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                           <option>Português (Brasil)</option>
                           <option>English (US)</option>
                           <option>Español</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tom de Voz Padrão</label>
                        <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                           <option>Profissional</option>
                           <option>Descontraído</option>
                           <option>Inspirador</option>
                        </select>
                      </div>
                   </div>
               </div>
              </>
           )}

           {activeTab === 'HISTORY' && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                 <div className="p-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <FileTextIcon className="w-5 h-5 text-purple-400" />
                       Histórico de Consumo
                    </h3>
                    <p className="text-sm text-slate-400">
                       Acompanhe o uso dos seus créditos. Total gasto: <span className="text-white font-bold">{history?.reduce((acc, curr) => acc + curr.cost, 0) || 0}</span> créditos.
                    </p>
                 </div>
                 <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                       <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-xs sticky top-0">
                          <tr>
                             <th className="px-6 py-4">Data/Hora</th>
                             <th className="px-6 py-4">Atividade</th>
                             <th className="px-6 py-4">Custo</th>
                             <th className="px-6 py-4">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-700">
                          {history && history.length > 0 ? (
                             history.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-700/50 transition-colors font-mono text-xs">
                                   <td className="px-6 py-4 text-slate-500">
                                      {new Date(log.timestamp).toLocaleString()}
                                   </td>
                                   <td className="px-6 py-4 text-white font-sans">
                                      {log.action}
                                   </td>
                                   <td className="px-6 py-4 font-bold text-red-400">
                                      -{log.cost}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className={`px-2 py-0.5 rounded ${log.status === 'SUCCESS' ? 'text-green-500 bg-green-900/10' : 'text-red-500 bg-red-900/10'}`}>
                                         {log.status}
                                      </span>
                                   </td>
                                </tr>
                             ))
                          ) : (
                             <tr>
                                <td colSpan={4} className="text-center py-12 text-slate-500">
                                   Nenhuma atividade registrada ainda.
                                </td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;