import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, ContentStrategyResponse, ChannelSetupResponse, ContentIdea, ScriptSection, ScriptAnalytics } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Gera Estratégia de Conteúdo (Apenas Ideias)
export const generateContentStrategy = async (input: UserInput): Promise<ContentStrategyResponse> => {
  const modelId = "gemini-3-flash-preview";
  const isLongForm = input.contentLength === 'LONG';

  const prompt = `
    Atue como um estrategista de conteúdo digital sênior (SaaS-level).
    
    # CONFIGURAÇÃO DO PROJETO
    - Nicho: "${input.niche}"
    - Plataforma: "${input.platform}"
    - Objetivo: "${input.objective}"
    - Estilo/Tom de Voz: "${input.style}"
    - Formato: ${isLongForm ? 'Vídeo Longo (YouTube/Aulas)' : 'Vídeo Curto (TikTok/Reels)'}

    # TAREFA
    Gere uma estratégia de conteúdo profissional em JSON contendo:
    
    1. **MÓDULO IDEAÇÃO (4 Ideias)**:
       - Título SEO (Search Engine Optimization).
       - Título Interno (Conceito).
       - Descrição da pauta (Contexto do vídeo).
       - ${isLongForm ? 'Sugestão visual de Thumbnail (descritiva).' : 'Para curtos, ignore thumbnail.'}
       - Hashtags otimizadas.
    
    2. **MÓDULO CALENDÁRIO**:
       - Plano de 7 dias sugerindo o mix de conteúdo ideal.

    3. **TRENDS**:
       - 3 tendências de alta para o nicho.

    IMPORTANTE: Não gere o roteiro completo agora. Foque na qualidade das ideias e títulos.
    Retorne apenas JSON válido conforme o schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategySummary: { type: Type.STRING },
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  seoTitle: { type: Type.STRING, description: "Título otimizado para SEO/Clique" },
                  description: { type: Type.STRING },
                  thumbnailSuggestion: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            calendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  contentTitle: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as ContentStrategyResponse;
  } catch (e) {
    console.error("Strategy Gen Error", e);
    throw e;
  }
};

// 1.5 Gera Roteiro Completo com Metadados (Advanced)
export const generateFullScript = async (idea: ContentIdea, input: UserInput): Promise<{ sections: ScriptSection[], analytics: ScriptAnalytics }> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Crie um ROTEIRO DE VÍDEO COMPLETO e PROFISSIONAL.
    
    # DADOS DO VÍDEO
    - Título: "${idea.title}"
    - Descrição: "${idea.description}"
    - Plataforma: "${input.platform}"
    - Tom de Voz: "${input.style}"
    
    # TAREFA
    1. Crie 3 a 5 seções de roteiro. Cada seção deve ter:
       - O texto falado (Roteiro).
       - Uma sugestão visual (B-Roll/Ação) detalhada.
       - Uma sugestão de ÁUDIO (Trilha ou Efeitos Sonoros) para aquele momento.
    2. Gere uma análise simulada do potencial do vídeo.

    Retorne JSON seguindo o schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING, description: "Ex: Gancho, Desenvolvimento, CTA" },
                    content: { type: Type.STRING, description: "Texto falado ou narração" },
                    visualCue: { type: Type.STRING, description: "Descrição detalhada da cena visual" },
                    audioCue: { type: Type.STRING, description: "Sugestão de música de fundo ou efeitos sonoros" }
                  }
                }
             },
             analytics: {
                type: Type.OBJECT,
                properties: {
                   estimatedEngagement: { type: Type.STRING, description: "Ex: Alto, Médio, Viral" },
                   retentionScore: { type: Type.INTEGER, description: "0 a 100" },
                   keywordDensity: { type: Type.STRING, description: "Palavras-chave principais" }
                }
             }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as { sections: ScriptSection[], analytics: ScriptAnalytics };
  } catch (e) {
    console.error("Script Gen Error", e);
    throw e;
  }
};

// Deprecated: Keeping for backward compatibility if needed, but App uses generateFullScript now
export const generateScript = async (idea: ContentIdea, input: UserInput): Promise<ScriptSection[]> => {
  const result = await generateFullScript(idea, input);
  return result.sections;
};

// 2. Gera Configuração do Canal e Monetização
export const generateChannelSetup = async (input: UserInput): Promise<ChannelSetupResponse> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Crie uma identidade visual, estratégica e plano de monetização para um novo canal.
    
    Dados:
    - Nicho: ${input.niche}
    - Plataforma: ${input.platform}
    - Estilo: ${input.style}

    Retorne JSON com: 
    1. Nome
    2. Handle
    3. Bio Otimizada
    4. Ideia de Avatar
    5. Ideia de Banner
    6. 3 Dicas de Crescimento
    7. 3 Estratégias de Monetização específicas para este nicho (ex: afiliados, produtos digitais, ads).
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          handle: { type: Type.STRING },
          description: { type: Type.STRING },
          avatarIdea: { type: Type.STRING },
          bannerIdea: { type: Type.STRING },
          initialTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          monetizationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}") as ChannelSetupResponse;
};

// 3. Gera Imagem (Thumbnail/Avatar) - Nano Banana
export const generateThumbnailImage = async (imagePrompt: string): Promise<string> => {
  const modelId = "gemini-2.5-flash-image";

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [{ text: imagePrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9" 
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Não foi possível gerar a imagem.");
};