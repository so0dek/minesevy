export interface Prediction {
  id: string;
  timestamp: number;
  safeSpots: number[]; // Indices 0-24
  result?: 'win' | 'loss';
}

export interface GameStats {
  wins: number;
  losses: number;
}

export interface HistoryData {
  stats: GameStats;
  predictions: Prediction[];
}

export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
export const MINES_COUNT = 3;
export const PREDICTION_COUNT = 4;
export const SIMULATION_RUNS = 10000;