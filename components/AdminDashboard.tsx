import React, { useState } from 'react';
import { SystemConfig, UserProfile, AuditLogEntry } from '../types';
import { ShieldIcon, DollarIcon, UsersIcon, BarChartIcon, CheckIcon, SettingsIcon, LogOutIcon, FileTextIcon, LockIcon, CreditCardIcon } from './Icons';

interface AdminDashboardProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  users: UserProfile[];
  auditLogs: AuditLogEntry[];
  onExit: () => void;
  onResetCredits?: (userId: string) => void;
  onToggleBlock?: (userId: string) => void;
}

type AdminView = 'OVERVIEW' | 'USERS' | 'PLANS' | 'CONFIG' | 'LOGS';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onUpdateConfig, users, auditLogs, onExit, onResetCredits, onToggleBlock }) => {
  const [currentView, setCurrentView] = useState<AdminView>('OVERVIEW');
  const [localConfig, setLocalConfig] = useState<SystemConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleCostChange = (key: keyof SystemConfig, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
    setSaved(false);
  };

  const handleSaveConfig = () => {
    onUpdateConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Metrics
  const totalRevenue = users.reduce((acc, curr) => {
    if (curr.plan === 'PRO') return acc + 49;
    if (curr.plan === 'PREMIUM') return acc + 99;
    return acc;
  }, 0);
  
  const totalConsumed = auditLogs.filter(l => l.status === 'SUCCESS').reduce((acc, curr) => acc + curr.cost, 0);
  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;

  // Mock Plans Data (Visual Only)
  const plans = [
     { name: 'Starter (Free)', price: 0, users: users.filter(u => u.plan === 'FREE').length, color: 'bg-slate-500' },
     { name: 'Professional', price: 49, users: users.filter(u => u.plan === 'PRO').length, color: 'bg-purple-500' },
     { name: 'Agency (Premium)', price: 99, users: users.filter(u => u.plan === 'PREMIUM').length, color: 'bg-blue-500' }
  ];

  const menuItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'Visão Geral', icon: <BarChartIcon className="w-5 h-5" /> },
    { id: 'USERS', label: 'Usuários & Acesso', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'PLANS', label: 'Planos & Receita', icon: <CreditCardIcon className="w-5 h-5" /> },
    { id: 'CONFIG', label: 'Custos de Crédito', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'LOGS', label: 'Logs de Auditoria', icon: <FileTextIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-50 font-sans overflow-hidden">
      
      {/* ADMIN SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl z-20">
         {/* Header */}
         <div className="p-6 border-b border-red-900/20 bg-red-950/10">
            <div className="flex items-center gap-3 mb-1">
               <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-900/50">
                  <ShieldIcon className="w-5 h-5 text-white" />
               </div>
               <h1 className="font-bold text-lg tracking-tight text-white">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 px-1">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sistema Online</span>
            </div>
         </div>

         {/* Navigation */}
         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Gestão</p>
            {menuItems.map(item => (
               <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                     currentView === item.id 
                        ? 'bg-red-900/20 text-red-100 border border-red-900/30 shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
               >
                  <span className={currentView === item.id ? 'text-red-400' : 'text-slate-500'}>{item.icon}</span>
                  {item.label}
               </button>
            ))}
         </nav>

         {/* User Info / Exit */}
         <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4 px-2">
               <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-xs font-bold text-red-200 border border-red-700">AD</div>
               <div>
                  <div className="text-xs font-bold text-white">Administrador</div>
                  <div className="text-[10px] text-slate-500">root@system</div>
               </div>
            </div>
            <button 
               onClick={onExit}
               className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 transition-colors"
            >
               <LogOutIcon className="w-4 h-4" />
               Voltar ao App
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#0b1120] relative">
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         
         <div className="p-8 max-w-6xl mx-auto relative z-10 animate-fade-in">
            
            {/* Header Title */}
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-white tracking-tight">{menuItems.find(m => m.id === currentView)?.label}</h2>
               <p className="text-slate-400 text-sm mt-1">Painel de controle administrativo • v2.4.0</p>
            </div>

            {/* VIEW: OVERVIEW */}
            {currentView === 'OVERVIEW' && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <p className="text-slate-400 text-xs font-bold uppercase">Receita Recorrente (MRR)</p>
                           <h3 className="text-3xl font-bold text-white mt-1">R$ {totalRevenue}</h3>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded-lg text-green-400"><DollarIcon className="w-6 h-6" /></div>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[70%] rounded-full"></div>
                     </div>
                  </div>

                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <p className="text-slate-400 text-xs font-bold uppercase">Usuários Ativos</p>
                           <h3 className="text-3xl font-bold text-white mt-1">{activeUsersCount} <span className="text-lg text-slate-500 font-normal">/ {users.length}</span></h3>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><UsersIcon className="w-6 h-6" /></div>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[85%] rounded-full"></div>
                     </div>
                  </div>

                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <p className="text-slate-400 text-xs font-bold uppercase">Consumo de IA</p>
                           <h3 className="text-3xl font-bold text-white mt-1">{totalConsumed} <span className="text-sm text-slate-500 font-normal">créditos</span></h3>
                        </div>
                        <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400"><BarChartIcon className="w-6 h-6" /></div>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[45%] rounded-full"></div>
                     </div>
                  </div>
               </div>
            )}

            {/* VIEW: USERS */}
            {currentView === 'USERS' && (
               <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                     <h3 className="font-bold text-white">Gerenciamento de Base</h3>
                     <input type="text" placeholder="Buscar usuário..." className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-red-500 focus:outline-none w-64" />
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 text-slate-300 uppercase font-bold text-[10px] tracking-wider">
                           <tr>
                              <th className="px-6 py-4">Usuário</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Plano</th>
                              <th className="px-6 py-4">Saldo (D/M)</th>
                              <th className="px-6 py-4 text-right">Ações</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                           {users.map((u) => (
                              <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-xs">{u.email}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {u.status === 'BLOCKED' ? (
                                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/20 text-red-400 border border-red-900/30">
                                          <LockIcon className="w-3 h-3" /> BLOQUEADO
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/20 text-green-400 border border-green-900/30">
                                          ATIVO
                                       </span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="bg-slate-800 px-2 py-1 rounded text-xs font-medium text-white border border-slate-700">{u.plan}</span>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs">
                                    {u.credits.daily} / {u.credits.monthly}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                       {onResetCredits && (
                                          <button 
                                             onClick={() => onResetCredits(u.id)}
                                             className="text-xs bg-slate-800 hover:bg-blue-900/30 text-slate-300 hover:text-blue-300 px-2 py-1.5 rounded border border-slate-700 transition-colors"
                                          >
                                             Resetar
                                          </button>
                                       )}
                                       {onToggleBlock && (
                                          <button 
                                             onClick={() => onToggleBlock(u.id)}
                                             className={`text-xs px-2 py-1.5 rounded border transition-colors ${
                                                u.status === 'BLOCKED' 
                                                   ? 'bg-green-900/20 border-green-800 text-green-400 hover:bg-green-900/40' 
                                                   : 'bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40'
                                             }`}
                                          >
                                             {u.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}
                                          </button>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* VIEW: PLANS */}
            {currentView === 'PLANS' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     {plans.map((plan, i) => (
                        <div key={i} className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 flex justify-between items-center relative overflow-hidden group hover:border-slate-700 transition-colors">
                           <div className={`absolute left-0 top-0 bottom-0 w-1 ${plan.color}`}></div>
                           <div>
                              <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                              <p className="text-slate-400 text-sm">Preço atual: <span className="text-white font-mono">R$ {plan.price}</span></p>
                           </div>
                           <div className="text-right">
                              <div className="text-3xl font-bold text-white">{plan.users}</div>
                              <div className="text-xs text-slate-500 uppercase font-bold">Assinantes</div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="bg-slate-900/50 p-8 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-center">
                     <div className="bg-slate-800 p-4 rounded-full mb-4">
                        <SettingsIcon className="w-8 h-8 text-slate-500" />
                     </div>
                     <h3 className="text-white font-bold mb-2">Editor de Planos em Desenvolvimento</h3>
                     <p className="text-slate-400 text-sm max-w-xs">
                        A funcionalidade de criar e editar planos dinamicamente estará disponível na próxima atualização do sistema.
                     </p>
                  </div>
               </div>
            )}

            {/* VIEW: CONFIG */}
            {currentView === 'CONFIG' && (
               <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-800 shadow-xl backdrop-blur-sm max-w-3xl">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                     <div>
                        <h2 className="text-xl font-bold text-white">Custos de Créditos (Sistema)</h2>
                        <p className="text-slate-400 text-sm mt-1">Defina quanto custa cada ação da IA.</p>
                     </div>
                     <button 
                        onClick={handleSaveConfig}
                        className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg ${
                           saved 
                              ? 'bg-green-600 text-white' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                     >
                        {saved ? <><CheckIcon className="w-4 h-4"/> Salvo</> : 'Salvar Configuração'}
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     {[
                        { key: 'STRATEGY_GENERATION', label: 'Geração de Estratégia', desc: 'Custo inicial para criar ideias.' },
                        { key: 'SCRIPT_GENERATION', label: 'Roteiro Completo', desc: 'Custo para gerar o texto final.' },
                        { key: 'THUMBNAIL_GENERATION', label: 'Thumbnail Studio (IA)', desc: 'Custo por imagem gerada.' },
                        { key: 'CHANNEL_ANALYSIS', label: 'Análise de Canal', desc: 'Custo por setup de identidade.' },
                     ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                           <div className="pr-4">
                              <label className="text-sm font-bold text-white block">{item.label}</label>
                              <p className="text-xs text-slate-500">{item.desc}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <input 
                                 type="number" 
                                 value={localConfig[item.key as keyof SystemConfig]}
                                 onChange={(e) => handleCostChange(item.key as keyof SystemConfig, e.target.value)}
                                 className="bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg w-24 text-right font-mono font-bold focus:outline-none focus:border-indigo-500"
                              />
                              <span className="text-xs font-bold text-slate-500 uppercase w-12">Créditos</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="mt-8 bg-indigo-900/10 border border-indigo-900/30 rounded-lg p-4 flex gap-3">
                     <ShieldIcon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                     <div>
                        <h4 className="text-sm font-bold text-indigo-300">Impacto Imediato</h4>
                        <p className="text-xs text-slate-400 mt-1">Alterações nestes valores afetam todos os usuários imediatamente. Certifique-se de notificar clientes sobre mudanças de preço.</p>
                     </div>
                  </div>
               </div>
            )}

            {/* VIEW: LOGS */}
            {currentView === 'LOGS' && (
               <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                     <h3 className="font-bold text-white">Auditoria Global</h3>
                     <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-slate-300 border border-slate-700 transition-colors">
                        Exportar CSV
                     </button>
                  </div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                     <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 text-slate-300 uppercase font-bold text-[10px] sticky top-0 backdrop-blur-md">
                           <tr>
                              <th className="px-6 py-4">Data/Hora</th>
                              <th className="px-6 py-4">Usuário</th>
                              <th className="px-6 py-4">Ação</th>
                              <th className="px-6 py-4">Custo</th>
                              <th className="px-6 py-4">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                           {auditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors font-mono text-xs">
                                 <td className="px-6 py-3 text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                 </td>
                                 <td className="px-6 py-3 text-white">
                                    {log.userName}
                                 </td>
                                 <td className="px-6 py-3 text-purple-300">
                                    {log.action}
                                 </td>
                                 <td className="px-6 py-3 font-bold text-red-400">
                                    -{log.cost}
                                 </td>
                                 <td className="px-6 py-3">
                                    {log.status === 'SUCCESS' ? (
                                       <span className="text-green-400">● SUCESSO</span>
                                    ) : (
                                       <span className="text-red-400">● FALHA</span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

         </div>
      </main>
    </div>
  );
};

export default AdminDashboard;