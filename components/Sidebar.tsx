import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { HomeIcon, LayoutIcon, UserIcon, PaletteIcon, SparklesIcon, CreditCardIcon, LogOutIcon, SettingsIcon, FileTextIcon, ShoppingBagIcon, ShieldIcon, UsersIcon, TrophyIcon } from './Icons';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  user: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user, onLogout }) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'STRATEGY', label: 'Estratégia (Ideias)', icon: <LayoutIcon className="w-5 h-5" /> },
    { id: 'MY_SCRIPTS', label: 'Meus Roteiros', icon: <FileTextIcon className="w-5 h-5" /> },
    { id: 'MARKETPLACE', label: 'Templates', icon: <ShoppingBagIcon className="w-5 h-5" /> },
    { id: 'THUMBNAIL', label: 'Thumbnail Studio', icon: <PaletteIcon className="w-5 h-5" /> },
    { id: 'CHANNEL', label: 'Canal & Monetização', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'COMMUNITY', label: 'Comunidade', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'PLANS', label: 'Planos & Faturamento', icon: <CreditCardIcon className="w-5 h-5" /> },
  ];

  const getPlanColor = (plan: string) => {
     if (plan === 'PREMIUM') return 'bg-gradient-to-r from-blue-500 to-cyan-500';
     if (plan === 'PRO') return 'bg-gradient-to-r from-purple-500 to-pink-500';
     return 'bg-slate-600';
  }

  // Calculate Percentages for bars
  const dailyPercent = Math.min(100, (user.credits.daily / user.credits.maxDaily) * 100);
  const monthlyPercent = Math.min(100, (user.credits.monthly / user.credits.maxMonthly) * 100);

  // Mock Level Calculation based on monthly credit usage
  const level = Math.floor((user.credits.maxMonthly - user.credits.monthly) / 100) + 1;
  const xpPercent = ((user.credits.maxMonthly - user.credits.monthly) % 100);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg shadow-lg shadow-purple-900/20">
           <SparklesIcon className="text-white w-5 h-5" />
        </div>
        <div>
           <h1 className="font-bold text-white tracking-tight leading-none">Creator<br/><span className="text-purple-400 text-sm">Studio AI</span></h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === item.id || (activeTab === 'SCRIPT_EDITOR' && item.id === 'MY_SCRIPTS')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}>
               {item.icon}
            </span>
            {item.label}
            {item.id === 'COMMUNITY' && <span className="ml-auto text-[9px] bg-red-500 text-white px-1.5 rounded animate-pulse">NEW</span>}
          </button>
        ))}

        <div className="pt-4 border-t border-slate-800/50 mt-4 space-y-2">
           <button
            onClick={() => onTabChange('SETTINGS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === 'SETTINGS'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
             <SettingsIcon className="w-5 h-5 text-slate-500 group-hover:text-white" />
             Configurações
          </button>

          {/* Admin Panel Button - Only for Admins */}
          {user.role === 'ADMIN' && (
             <button
              onClick={() => onTabChange('ADMIN')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === 'ADMIN'
                  ? 'bg-red-900/50 text-red-200 border border-red-800'
                  : 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
              }`}
            >
               <ShieldIcon className="w-5 h-5" />
               Painel Admin
            </button>
          )}
        </div>
      </nav>

      {/* Credits Widget */}
      <div className="px-4 pb-2">
         <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center justify-between">
               <span>Seu Saldo</span>
               <button onClick={() => onTabChange('PLANS')} className="text-purple-400 hover:text-white transition-colors text-[9px] bg-purple-900/30 px-1.5 py-0.5 rounded">
                  + Recarregar
               </button>
            </h4>
            
            {/* Daily Credits */}
            <div className="mb-3">
               <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                  <span>Créditos Diários</span>
                  <span className="font-bold">{user.credits.daily}/{user.credits.maxDaily}</span>
               </div>
               <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                     className="bg-green-500 h-full rounded-full transition-all duration-500" 
                     style={{ width: `${dailyPercent}%` }}
                  ></div>
               </div>
            </div>

             {/* Monthly Credits */}
             <div>
               <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                  <span>Créditos Mensais</span>
                  <span className="font-bold">{user.credits.monthly}/{user.credits.maxMonthly}</span>
               </div>
               <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                     className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                     style={{ width: `${monthlyPercent}%` }}
                  ></div>
               </div>
            </div>
         </div>
      </div>

      {/* User / Footer & Gamification */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
         {/* Level Bar */}
         <div className="mb-3 flex items-center gap-2">
             <div className="bg-yellow-500/10 p-1.5 rounded-full">
                <TrophyIcon className="w-3 h-3 text-yellow-400" />
             </div>
             <div className="flex-1">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-0.5">
                   <span>Nível {level} - Criador</span>
                   <span className="text-yellow-400">{xpPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                   <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full" style={{ width: `${xpPercent}%` }}></div>
                </div>
             </div>
         </div>

         <div className="bg-slate-800 rounded-xl p-3 mb-1 shadow-inner border border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-8 h-8 rounded-full ${getPlanColor(user.plan)} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                  {user.name.substring(0, 2).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
               </div>
            </div>
            <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${getPlanColor(user.plan)}`}>
                   {user.plan} PLAN
                </span>
                <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
                  title="Sair"
                >
                   <LogOutIcon className="w-3 h-3" />
                </button>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;