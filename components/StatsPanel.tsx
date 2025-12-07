import React from 'react';
import { GameStats } from '../types';
import { Trophy, XCircle } from 'lucide-react';

interface StatsPanelProps {
  stats: GameStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const total = stats.wins + stats.losses;
  const winRate = total > 0 ? ((stats.wins / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-md bg-gray-900/40 border border-gray-800 rounded-lg p-5 mb-6 backdrop-blur-md">
      {/* Header with requested format */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-mono font-bold text-gray-200 tracking-wide">
          Aciertos: <span className="text-green-400">{stats.wins}</span> | Errores: <span className="text-red-400">{stats.losses}</span>
        </h2>
        <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
           Tasa de Acierto: {winRate}%
        </div>
      </div>

      {/* Visual Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center bg-black/40 p-2 rounded border border-gray-800/50">
          <Trophy className="text-green-600/70 w-4 h-4 mb-1" />
          <span className="text-xs text-green-500/80 font-bold">GANADAS</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-black/40 p-2 rounded border border-gray-800/50">
          <XCircle className="text-red-600/70 w-4 h-4 mb-1" />
          <span className="text-xs text-red-500/80 font-bold">PERDIDAS</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;