export interface AnalysisMetric {
  name: string;
  score: number; // 0-10
  description: string;
}

export interface AnalysisResult {
  globalScore: number;
  metrics: AnalysisMetric[];
  visualHotspots: string[];
  critique: string;
  technicalMetadata: {
    sharpness: string;
    lighting: string;
    colorPalette: string[];
  };
  visualComplexity: {
    score: number; // 0-10 (Minimalist to Intricate)
    description: string;
  };
  emotionalImpact: {
    score: number; // 0-10 (Neutral to Intense)
    keywords: string[];
  };
  intentMetrics: {
    detected: boolean;
    category: string; // e.g. "Gym Validation", "Suggestive Framing"
    effortScore: number; // 0-10 (Staging intensity)
    outcomeScore: number; // 0-10 (Aesthetic success)
    description: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
