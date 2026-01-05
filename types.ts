
export type ContentLength = 'SHORT' | 'LONG';

export interface UserInput {
  niche: string;
  platform: string;
  objective: string;
  contentLength: ContentLength;
  style: string;
}

export interface ScriptSection {
  label: string; 
  content: string;
  visualCue?: string; // Sugestão visual
  audioCue?: string; // Sugestão de áudio/efeitos
}

export interface ContentIdea {
  title: string;
  seoTitle: string;
  description: string;
  thumbnailSuggestion?: string;
  scriptSections?: ScriptSection[];
  hashtags: string[];
}

export interface CalendarEntry {
  day: string;
  contentTitle: string;
  type: string;
}

export interface ContentStrategyResponse {
  ideas: ContentIdea[];
  calendar: CalendarEntry[];
  trends: string[];
  strategySummary: string;
}

export interface ChannelSetupResponse {
  name: string;
  description: string;
  handle: string;
  avatarIdea: string;
  bannerIdea: string;
  initialTips: string[];
  monetizationTips: string[];
}

export interface ScriptAnalytics {
  estimatedEngagement: string;
  retentionScore: number;
  keywordDensity: string;
}

export interface ScriptProject {
  id: string;
  title: string;
  platform: string;
  sections: ScriptSection[];
  hashtags: string[];
  thumbnailSuggestion?: string;
  generatedThumbnailUrl?: string;
  analytics: ScriptAnalytics;
  createdAt: string;
  lastModified: string;
  description: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ActiveTab = 'DASHBOARD' | 'STRATEGY' | 'MARKETPLACE' | 'MY_SCRIPTS' | 'SCRIPT_EDITOR' | 'THUMBNAIL' | 'CHANNEL' | 'PLANS' | 'SETTINGS' | 'ADMIN' | 'COMMUNITY';

export type PlanType = 'FREE' | 'PRO' | 'PREMIUM';
export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface UserCredits {
  daily: number;
  maxDaily: number;
  monthly: number;
  maxMonthly: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits: UserCredits;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

export const DEFAULT_CREDIT_COSTS = {
  STRATEGY_GENERATION: 1, // Custo por gerar lista de ideias
  SCRIPT_GENERATION: 5,   // Custo por roteiro completo
  THUMBNAIL_GENERATION: 3, // Custo por imagem
  CHANNEL_ANALYSIS: 10    // Custo por análise de canal
};

export type SystemConfig = typeof DEFAULT_CREDIT_COSTS;

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  cost: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface CommunityPost {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}
