export type Mode = '30s' | '1m' | '3m' | '5m';

export type PredictionType = 'Big' | 'Small';

export interface Prediction {
  type: PredictionType;
  calcNumber: number;
  logicName: string;
}

export interface HistoryItem {
  period: string;
  number: number;
}

export interface EngineHistoryItem {
  period: string;
  prediction: PredictionType;
  actual: PredictionType;
  result: number;
  status: 'WIN' | 'LOSS';
}

export interface Engine {
  id: number;
  name: string;
  wins: number;
  losses: number;
  currentPrediction: Prediction | null;
  history: EngineHistoryItem[];
  consecutiveWins: number;
  maxConsecutiveWins: number;
  winRate?: number;
  last10Rate?: number;
  last10Wins?: number;
  last10Total?: number;
  originalIndex?: number;
}

export interface ModeState {
  engines: Engine[];
  history: HistoryItem[];
  lastProcessedPeriod: string | null;
  accumulatedHistory: HistoryItem[];
}
