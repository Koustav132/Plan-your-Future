
export type UserRole = 'guest' | 'client' | 'admin';

export interface FinancialGoal {
  id: string;
  title: string;
  type: 'retirement' | 'education' | 'home' | 'car' | 'other';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  groundingUrls?: { web: { uri: string; title: string } }[];
  image?: string; // base64
}

export interface RiskQuestion {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

export interface AssetCategory {
  category: string;
  value: number;
  remark?: string;
}

export interface UserData {
  name: string;
  age: number;
  email: string;
  phone?: string;
  role: UserRole;
  riskScore: number;
  portfolioValue: number;
  assets: AssetCategory[];
  goals: FinancialGoal[];
}

export interface AdminMetrics {
  totalAUM: number;
  activeClients: number;
  pendingReviews: number;
  marketSentiment: string;
}

export interface SIPInputs {
  monthlyInvestment: number;
  expectedReturn: number;
  tenure: number;
}

export interface LoanInputs {
  principal: number;
  interestRate: number;
  tenureYears: number;
}
