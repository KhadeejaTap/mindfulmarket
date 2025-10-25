
export interface ImpactMetric {
  metric: string;
  score: number;
  explanation: string;
}

export interface AnalysisResult {
  overallScore: string;
  summary: string;
  breakdown: ImpactMetric[];
  recommendations: string[];
}

export interface StoredQuery {
  id: number;
  geminiQuery: string;
  geminiAnswer: string;
  created_at: string;
}

export interface BrowserStorage {
  saveQuery(query: string, answer: string): Promise<void>;
  getAnswer(query: string): Promise<string | null>;
  getAllQueries(): Promise<StoredQuery[]>;
}
