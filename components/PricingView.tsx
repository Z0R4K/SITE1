import React from 'react';
import { PlanType } from '../types';
import { CheckIcon, StarIcon, CreditCardIcon, LockIcon } from './Icons';

interface PricingViewProps {
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ currentPlan, onUpgrade }) => {
  const plans = [
    {
      id: 'FREE' as PlanType,
      name: 'Starter',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para quem está começando a testar IA.',
      features: ['5 Ideias de Roteiro/mês', 'Geração de Títulos SEO', 'Acesso ao Calendário Básico', 'Suporte via Comunidade'],
      color: 'slate',
      buttonText: 'Plano Atual'
    },
    {
      id: 'PRO' as PlanType,
      name: 'Professional',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para criadores que buscam consistência e crescimento.',
      features: ['Roteiros Ilimitados', 'Thumbnail Studio (Nano Banana)', 'Estratégia de Canal Completa', 'Análise de Tendências', 'Suporte Prioritário'],
      recommended: true,
      color: 'purple',
      buttonText: 'Assinar Pro'
    },
    {
      id: 'PREMIUM' as PlanType,
      name: 'Agency',
      price: 'R$ 99',
      period: '/mês',
      description: 'Poder total para agências e equipes.',
      features: ['Tudo do Pro', 'Múltiplos Perfis de Canal', 'Exportação em PDF/Docx', 'API de Acesso (Beta)', 'Consultoria Mensal de 1h'],
      color: 'blue',
      buttonText: 'Assinar Premium'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Escolha o plano ideal para sua jornada</h2>
        <p className="text-slate-400">
          Desbloqueie todo o potencial da Inteligência Artificial para criar conteúdo viral com consistência.
          Cancele a qualquer momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isRecommended = plan.recommended;

          return (
            <div 
              key={plan.id} 
              className={`relative bg-slate-800 rounded-2xl p-8 border flex flex-col transition-transform hover:-translate-y-2 duration-300 ${
                isRecommended ? 'border-purple-500 shadow-2xl shadow-purple-900/20' : 'border-slate-700 shadow-xl'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <StarIcon className="w-3 h-3" /> MAIS POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckIcon className={`w-5 h-5 shrink-0 ${isRecommended ? 'text-purple-400' : 'text-blue-400'}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => !isCurrent && onUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? 'bg-slate-700 text-slate-400 cursor-default'
                    : isRecommended
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                {isCurrent ? 'Seu Plano Atual' : (
                   <>
                     <CreditCardIcon className="w-4 h-4" />
                     {plan.buttonText}
                   </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center max-w-3xl mx-auto mt-8">
         <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
           <LockIcon className="w-4 h-4" />
           Pagamentos processados com segurança via Stripe. Garantia de 7 dias ou seu dinheiro de volta.
         </p>
      </div>
    </div>
  );
};

export default PricingView;