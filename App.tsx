import React, { useState } from 'react';
import InputForm from './components/InputForm';
import StrategyResults from './components/StrategyResults';
import ChannelSetupView from './components/ChannelSetupView';
import ThumbnailStudio from './components/ThumbnailStudio';
import DashboardHome from './components/DashboardHome';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';
import PricingView from './components/PricingView';
import SettingsView from './components/SettingsView';
import ScriptEditorView from './components/ScriptEditorView';
import ScriptLibraryView from './components/ScriptLibraryView';
import MarketplaceView from './components/MarketplaceView';
import AdminDashboard from './components/AdminDashboard';
import CommunityView from './components/CommunityView';
import { generateContentStrategy, generateChannelSetup, generateFullScript, generateThumbnailImage } from './services/geminiService';
import { UserInput, ContentStrategyResponse, ChannelSetupResponse, LoadingState, ActiveTab, UserProfile, PlanType, ContentIdea, ScriptProject, Template, DEFAULT_CREDIT_COSTS, SystemConfig, UserRole, AuditLogEntry } from './types';
import { UserIcon, CreditCardIcon } from './components/Icons';

const App: React.FC = () => {
  // --- AUTH STATE (Mock Database) ---
  const [user, setUser] = useState<UserProfile | null>(null);

  // --- MOCK BACKEND DATA ---
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    { id: 'u1', name: 'Alice Creator', email: 'alice@example.com', plan: 'PRO', role: 'USER', status: 'ACTIVE', joinedAt: '2023-10-15', credits: { daily: 45, maxDaily: 50, monthly: 800, maxMonthly: 1000 } },
    { id: 'u2', name: 'Bob Vlogs', email: 'bob@example.com', plan: 'FREE', role: 'USER', status: 'ACTIVE', joinedAt: '2023-11-02', credits: { daily: 2, maxDaily: 5, monthly: 10, maxMonthly: 50 } },
    { id: 'u3', name: 'Charlie Agency', email: 'charlie@agency.com', plan: 'PREMIUM', role: 'USER', status: 'ACTIVE', joinedAt: '2023-09-20', credits: { daily: 100, maxDaily: 100, monthly: 4500, maxMonthly: 5000 } },
  ]);
  
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'l1', userId: 'u1', userName: 'Alice Creator', action: 'Gerar Roteiro Completo', cost: 5, timestamp: new Date(Date.now() - 1000000).toISOString(), status: 'SUCCESS' },
    { id: 'l2', userId: 'u2', userName: 'Bob Vlogs', action: 'Thumbnail Studio', cost: 3, timestamp: new Date(Date.now() - 5000000).toISOString(), status: 'FAILED' },
    { id: 'l3', userId: 'u3', userName: 'Charlie Agency', action: 'Análise de Canal', cost: 10, timestamp: new Date(Date.now() - 8000000).toISOString(), status: 'SUCCESS' },
  ]);

  // Global User Input Context
  const [formData, setFormData] = useState<UserInput | null>(null);
  const [savedScripts, setSavedScripts] = useState<ScriptProject[]>([]);
  const [activeProject, setActiveProject] = useState<ScriptProject | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_CREDIT_COSTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [strategyLoading, setStrategyLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [strategyData, setStrategyData] = useState<ContentStrategyResponse | null>(null);
  const [channelLoading, setChannelLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [channelData, setChannelData] = useState<ChannelSetupResponse | null>(null);

  // --- HANDLERS ---

  const handleLogin = (name: string, email: string) => {
    // Check if user is Admin based on email (Simulation)
    const role: UserRole = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const userId = 'u_current_' + Date.now();

    // Check if user exists in mock DB (simple email match)
    const existingUser = allUsers.find(u => u.email === email);
    
    if (existingUser) {
        if (existingUser.status === 'BLOCKED') {
            alert("Acesso negado. Esta conta foi bloqueada pelo administrador.");
            return;
        }
        setUser(existingUser);
    } else {
        const newUser: UserProfile = {
            id: userId,
            name,
            email,
            plan: 'FREE',
            role: role,
            status: 'ACTIVE',
            joinedAt: new Date().toISOString(),
            credits: role === 'ADMIN' 
              ? { daily: 999, maxDaily: 999, monthly: 9999, maxMonthly: 9999 } 
              : { daily: 5, maxDaily: 5, monthly: 50, maxMonthly: 50 }
        };
        setUser(newUser);
        if (role === 'USER') {
            setAllUsers(prev => [...prev, newUser]);
        }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStrategyData(null);
    setChannelData(null);
    setFormData(null);
    setActiveTab('DASHBOARD');
  };

  // --- ADMIN ACTIONS ---
  const handleAdminResetCredits = (userId: string) => {
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              return {
                  ...u,
                  credits: {
                      ...u.credits,
                      daily: u.credits.maxDaily,
                      monthly: u.credits.maxMonthly
                  }
              };
          }
          return u;
      }));
      // If reset current logged admin (unlikely but safe)
      if (user?.id === userId) {
          const updated = allUsers.find(u => u.id === userId);
          if (updated) setUser(updated);
      }
  };

  const handleAdminToggleBlock = (userId: string) => {
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              return { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' };
          }
          return u;
      }));
  };

  const handleUpgradePlan = (newPlan: PlanType) => {
    if (user) {
      // Mock Plan Upgrade Logic
      let newCredits = { ...user.credits };
      if (newPlan === 'PRO') {
        newCredits = { daily: 50, maxDaily: 50, monthly: 1000, maxMonthly: 1000 };
      } else if (newPlan === 'PREMIUM') {
        newCredits = { daily: 100, maxDaily: 100, monthly: 5000, maxMonthly: 5000 };
      }

      const updatedUser: UserProfile = { ...user, plan: newPlan, credits: newCredits };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      alert(`Parabéns! Você migrou para o plano ${newPlan}. Seus créditos foram atualizados.`);
    }
  };

  // --- CREDIT SYSTEM LOGIC ---
  const handleConsumeCredits = (cost: number, featureName: string): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;

    let { daily, monthly } = user.credits;
    let consumedDaily = 0;
    let consumedMonthly = 0;
    let success = false;

    if (daily >= cost) {
      consumedDaily = cost;
      success = true;
    } else if (monthly >= cost) {
      consumedMonthly = cost;
      success = true;
    } 

    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      action: featureName,
      cost: cost,
      timestamp: new Date().toISOString(),
      status: success ? 'SUCCESS' : 'FAILED'
    };
    setAuditLogs(prev => [logEntry, ...prev]);

    if (!success) {
      const confirmUpgrade = window.confirm(
        `Saldo insuficiente para ${featureName} (Custo: ${cost}).\n\n` +
        `Diário: ${daily} | Mensal: ${monthly}\n\nDeseja fazer upgrade do seu plano para continuar criando?`
      );
      if (confirmUpgrade) setActiveTab('PLANS');
      return false;
    }

    const updatedCredits = {
        ...user.credits,
        daily: user.credits.daily - consumedDaily,
        monthly: user.credits.monthly - consumedMonthly
    };

    const updatedUser = { ...user, credits: updatedCredits };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    return true;
  };

  const handleStrategySubmit = async (data: UserInput) => {
    if (!handleConsumeCredits(systemConfig.STRATEGY_GENERATION, 'Gerar Estratégia')) return;
    setFormData(data);
    setStrategyLoading(LoadingState.LOADING);
    try {
      const result = await generateContentStrategy(data);
      setStrategyData(result);
      setStrategyLoading(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setStrategyLoading(LoadingState.ERROR);
    }
  };

  const handleChannelGenerate = async () => {
    if (!formData) return;
    if (!handleConsumeCredits(systemConfig.CHANNEL_ANALYSIS, 'Análise de Canal')) return;
    setChannelLoading(LoadingState.LOADING);
    try {
      const result = await generateChannelSetup(formData);
      setChannelData(result);
      setChannelLoading(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setChannelLoading(LoadingState.ERROR);
    }
  };

  const handleGenerateScript = async (idea: ContentIdea) => {
    if (!formData) return;
    if (!handleConsumeCredits(systemConfig.SCRIPT_GENERATION, 'Gerar Roteiro Completo')) return;

    try {
      const { sections, analytics } = await generateFullScript(idea, formData);
      const newProject: ScriptProject = {
        id: crypto.randomUUID(),
        title: idea.title,
        platform: formData.platform,
        sections: sections || [],
        hashtags: idea.hashtags || [],
        thumbnailSuggestion: idea.thumbnailSuggestion,
        analytics: analytics,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        description: idea.description
      };
      setSavedScripts(prev => [newProject, ...prev]);
      setActiveProject(newProject);
      setActiveTab('SCRIPT_EDITOR');
    } catch (error) {
      console.error("Failed to generate script", error);
      alert("Erro ao gerar roteiro. Tente novamente.");
    }
  };

  const handleUpdateProject = (updatedProject: ScriptProject) => {
    setSavedScripts(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setActiveProject(updatedProject);
  };

  const handleDeleteProject = (projectId: string) => {
    setSavedScripts(prev => prev.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
       setActiveProject(null);
       setActiveTab('MY_SCRIPTS');
    }
  };

  const handleOpenProject = (project: ScriptProject) => {
    setActiveProject(project);
    setActiveTab('SCRIPT_EDITOR');
  };

  const handleUseTemplate = (template: Template) => {
     const templateStyle = template.difficulty === 'Iniciante' ? 'Tutorial / Educativo' : 'Inspiracional / Storytelling';
     setFormData({
       niche: '',
       platform: template.platform,
       objective: template.category,
       contentLength: template.platform.includes('Shorts') || template.platform.includes('Reels') || template.platform.includes('TikTok') ? 'SHORT' : 'LONG',
       style: templateStyle
     });
     alert(`Template "${template.title}" selecionado! Defina seu nicho para começar.`);
     setActiveTab('STRATEGY');
  };

  // --- RENDER ---

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // --- DEDICATED ADMIN ROUTE ---
  if (activeTab === 'ADMIN' && user.role === 'ADMIN') {
    return (
       <AdminDashboard 
          config={systemConfig} 
          onUpdateConfig={setSystemConfig} 
          users={allUsers}
          auditLogs={auditLogs}
          onResetCredits={handleAdminResetCredits}
          onToggleBlock={handleAdminToggleBlock}
          onExit={() => setActiveTab('DASHBOARD')}
       />
    );
  }

  // --- SAAS APP RENDER ---
  const userHistory = auditLogs.filter(log => log.userId === user.id);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto animate-fade-in h-full">
          {activeTab === 'DASHBOARD' && <DashboardHome onNavigate={setActiveTab} />}
          {activeTab === 'PLANS' && <PricingView currentPlan={user.plan} onUpgrade={handleUpgradePlan} />}
          {activeTab === 'SETTINGS' && <SettingsView user={user} history={userHistory} />}
          {activeTab === 'MARKETPLACE' && <MarketplaceView onUseTemplate={handleUseTemplate} />}
          {activeTab === 'COMMUNITY' && <CommunityView />}
          {activeTab === 'MY_SCRIPTS' && <ScriptLibraryView projects={savedScripts} onOpenProject={handleOpenProject} onDeleteProject={handleDeleteProject} />}
          {activeTab === 'SCRIPT_EDITOR' && activeProject && (
             <ScriptEditorView 
                project={activeProject}
                onUpdate={handleUpdateProject}
                onConsumeCredits={(cost) => handleConsumeCredits(cost, 'Thumbnail AI')}
                thumbnailCost={systemConfig.THUMBNAIL_GENERATION}
                onBack={() => setActiveTab('MY_SCRIPTS')}
             />
          )}
          {activeTab === 'STRATEGY' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <InputForm onSubmit={handleStrategySubmit} isLoading={strategyLoading === LoadingState.LOADING} />
                 {formData && (
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Projeto Ativo</h4>
                       <p className="text-sm text-slate-300"><span className="text-purple-400">Nicho:</span> {formData.niche}</p>
                    </div>
                 )}
              </div>
              <div className="lg:col-span-8">
                {strategyLoading === LoadingState.IDLE && (
                   <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                      <p>Configure seu nicho ao lado para começar. Custo: {systemConfig.STRATEGY_GENERATION} crédito.</p>
                   </div>
                )}
                {strategyLoading === LoadingState.LOADING && (
                   <div className="h-full flex flex-col items-center justify-center p-12">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                     <p className="text-purple-400 font-medium">A IA está criando sua estratégia...</p>
                   </div>
                )}
                {strategyLoading === LoadingState.ERROR && (
                   <div className="p-4 bg-red-900/20 text-red-400 rounded-lg text-center border border-red-900/50">
                     Ocorreu um erro ao conectar com o Gemini. Tente novamente.
                   </div>
                )}
                {strategyData && formData && (
                   <StrategyResults data={strategyData} userInput={formData} onGenerateScript={handleGenerateScript} />
                )}
              </div>
            </div>
          )}
          {activeTab === 'CHANNEL' && (
            <div className="max-w-4xl mx-auto">
               <div className="mb-8">
                 <h2 className="text-3xl font-bold text-white">Identidade & Monetização</h2>
                 <p className="text-slate-400">Crie o branding e descubra como lucrar com seu projeto.</p>
               </div>
              {!formData ? (
                 <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                    <p className="mb-4">Para gerar uma identidade, precisamos saber sobre o que é seu canal.</p>
                    <button onClick={() => setActiveTab('STRATEGY')} className="text-blue-400 hover:text-blue-300 underline">Ir para Configuração</button>
                 </div>
              ) : channelData ? (
                 <ChannelSetupView data={channelData} />
              ) : (
                 <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl">
                   <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UserIcon className="w-8 h-8 text-slate-500" />
                   </div>
                   <h3 className="text-xl text-white font-bold mb-2">Gerar Branding para "{formData.niche}"?</h3>
                   <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                     A IA analisará seu nicho e estilo ({formData.style}) para sugerir nomes, avatar e estratégias de lucro.
                     <br/>Custo: {systemConfig.CHANNEL_ANALYSIS} créditos.
                   </p>
                   <button onClick={handleChannelGenerate} disabled={channelLoading === LoadingState.LOADING} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform text-white px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-50">
                     {channelLoading === LoadingState.LOADING ? 'Criando...' : 'Gerar Identidade Agora'}
                   </button>
                 </div>
              )}
            </div>
          )}
          {activeTab === 'THUMBNAIL' && (
             <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                 <h2 className="text-3xl font-bold text-white">Thumbnail Studio</h2>
                 <p className="text-slate-400">Gere artes conceituais usando o modelo Gemini Nano Banana.</p>
               </div>
               {user.plan === 'FREE' ? (
                 <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700 shadow-xl">
                    <div className="bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                       <CreditCardIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Recurso Premium</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                      O Studio de Thumbnail com IA (Nano Banana) está disponível apenas para usuários <strong>Pro</strong> e <strong>Premium</strong>.
                    </p>
                    <button onClick={() => setActiveTab('PLANS')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                      Fazer Upgrade Agora
                    </button>
                 </div>
               ) : (
                 <ThumbnailStudio onConsumeCredits={(cost) => handleConsumeCredits(cost, 'Thumbnail Studio')} cost={systemConfig.THUMBNAIL_GENERATION} />
               )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;