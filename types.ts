
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
