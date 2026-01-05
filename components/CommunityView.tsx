import React from 'react';
import { CommunityPost } from '../types';
import { MessageCircleIcon, HeartIcon, ShareIcon, UsersIcon, TrophyIcon, SearchIcon, SmileIcon } from './Icons';

const CommunityView: React.FC = () => {
  // Mock Data
  const posts: CommunityPost[] = [
    { id: '1', author: 'Ana Tech', avatarColor: 'bg-purple-500', content: 'Acabei de gerar um roteiro viral que bateu 100k views no TikTok! O segredo foi usar a estrutura "Hook Polêmico" do marketplace. 🔥', likes: 142, comments: 23, timestamp: '2h atrás', tags: ['#case', '#viral'] },
    { id: '2', author: 'Carlos Vlogs', avatarColor: 'bg-blue-500', content: 'Alguém mais está sentindo que o alcance do Reels caiu essa semana? Estou pensando em mudar a estratégia para vídeos mais longos.', likes: 56, comments: 45, timestamp: '5h atrás', tags: ['#duvida', '#algoritmo'] },
    { id: '3', author: 'Mariana Cooking', avatarColor: 'bg-green-500', content: 'A nova feature de Thumbnail AI é incrível! Economizei 2 horas de Photoshop hoje.', likes: 89, comments: 12, timestamp: '1d atrás', tags: ['#feedback', '#produtividade'] },
  ];

  const ranking = [
    { name: 'Ana Tech', points: 15400, level: 12 },
    { name: 'Dev Junior', points: 12300, level: 10 },
    { name: 'Marketing Pro', points: 9800, level: 8 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pb-12">
       {/* Main Feed */}
       <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                   <UsersIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                   <textarea 
                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 min-h-[80px]"
                     placeholder="Compartilhe uma ideia, dúvida ou conquista com a comunidade..."
                   ></textarea>
                   <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                         <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors"><SmileIcon className="w-5 h-5" /></button>
                         <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors font-bold text-xs uppercase border border-dashed border-slate-600 px-3"># Tag</button>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                         Publicar
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-white">Feed Recente</h3>
             <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button className="px-3 py-1 bg-slate-700 rounded text-xs font-bold text-white">Em alta</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white">Novos</button>
             </div>
          </div>

          <div className="space-y-4">
             {posts.map(post => (
                <div key={post.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center text-white font-bold`}>
                            {post.author.charAt(0)}
                         </div>
                         <div>
                            <div className="font-bold text-white">{post.author}</div>
                            <div className="text-xs text-slate-500">{post.timestamp}</div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {post.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
                               {tag}
                            </span>
                         ))}
                      </div>
                   </div>
                   <p className="text-slate-300 leading-relaxed mb-4">{post.content}</p>
                   <div className="flex items-center gap-6 pt-4 border-t border-slate-700/50">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors text-sm">
                         <HeartIcon className="w-4 h-4" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors text-sm">
                         <MessageCircleIcon className="w-4 h-4" /> {post.comments}
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm ml-auto">
                         <ShareIcon className="w-4 h-4" /> Compartilhar
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Sidebar Right */}
       <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900 rounded-2xl p-6 border border-yellow-700/30">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                Top Criadores (Semana)
             </h3>
             <div className="space-y-4">
                {ranking.map((user, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                         idx === 0 ? 'bg-yellow-500 text-black' : 
                         idx === 1 ? 'bg-slate-400 text-black' : 
                         'bg-orange-700 text-white'
                      }`}>
                         {idx + 1}
                      </div>
                      <div className="flex-1">
                         <div className="text-sm font-bold text-white">{user.name}</div>
                         <div className="text-xs text-slate-400">Nível {user.level}</div>
                      </div>
                      <div className="text-xs font-mono text-yellow-500 font-bold">{user.points} XP</div>
                   </div>
                ))}
             </div>
             <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors border border-slate-700">
                Ver Ranking Completo
             </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
             <h3 className="text-lg font-bold text-white mb-4">Trending Topics</h3>
             <div className="flex flex-wrap gap-2">
                {['#TikTokViral', '#IAgenerativa', '#Marketing', '#Edição', '#YoutubeShorts'].map(tag => (
                   <span key={tag} className="text-xs bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-slate-700">
                      {tag}
                   </span>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default CommunityView;