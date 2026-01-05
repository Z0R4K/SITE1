import React, { useState } from 'react';
import { SparklesIcon, LockIcon, ShieldIcon } from './Icons';

interface AuthScreenProps {
  onLogin: (name: string, email: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(() => {
      onLogin(name || 'Visitante', email);
    }, 800);
  };

  const handleAdminDemo = () => {
    onLogin('Bruno Admin', 'bruno@admin.com');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border border-slate-700">
        
        {/* Left Side - Hero */}
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-10 text-white flex flex-col justify-center md:w-1/2 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <SparklesIcon className="w-64 h-64" />
           </div>
           <div className="relative z-10">
             <div className="bg-white/10 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm">
                <SparklesIcon className="w-8 h-8" />
             </div>
             <h1 className="text-4xl font-bold mb-4">Creator Studio AI</h1>
             <p className="text-purple-200 text-lg leading-relaxed">
               A plataforma definitiva para criadores de conteúdo. Automatize roteiros, gere thumbnails e planeje seu sucesso com Inteligência Artificial.
             </p>
             <div className="mt-8 flex gap-4">
               <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold">
                 🚀 +10k Roteiros
               </div>
               <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold">
                 ⭐ 4.9/5 Avaliação
               </div>
             </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:w-1/2 bg-slate-800 flex flex-col justify-center">
           <div className="mb-8 text-center">
             <h2 className="text-2xl font-bold text-white">{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}</h2>
             <p className="text-slate-400 text-sm mt-2">
               {isLogin ? 'Acesse seu painel para continuar criando.' : 'Comece a usar o poder da IA hoje mesmo.'}
             </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                   placeholder="Seu nome"
                   required={!isLogin}
                 />
               </div>
             )}
             
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">E-mail Corporativo</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                 placeholder="seu@email.com"
                 required
               />
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Senha</label>
               <div className="relative">
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                   placeholder="••••••••"
                   required
                 />
                 <LockIcon className="absolute right-3 top-3.5 text-slate-500 w-5 h-5" />
               </div>
             </div>

             <button 
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform active:scale-95"
             >
               {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
             </button>
           </form>

           <div className="mt-6 text-center">
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="text-purple-400 hover:text-purple-300 text-sm font-semibold underline"
             >
               {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
             </button>
           </div>

           {/* DEMO HELPERS */}
           <div className="mt-8 pt-6 border-t border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Acesso Rápido (Demo)</p>
              <button 
                 onClick={handleAdminDemo}
                 className="text-xs bg-red-900/30 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/50 flex items-center gap-1 mx-auto"
              >
                 <ShieldIcon className="w-3 h-3" /> Simular Login Admin
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;