import React from 'react';
import { Sparkles, Check, X, Download, Upload, Trash2 } from 'lucide-react';

interface ControlsProps {
  onPredict: () => void;
  onResult: (result: 'win' | 'loss') => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  hasActivePrediction: boolean;
  isPredicting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onPredict, 
  onResult, 
  onExport, 
  onImport,
  onReset,
  hasActivePrediction, 
  isPredicting 
}) => {
  return (
    <div className="flex flex-col gap-5 w-full max-w-md">
      
      {/* Primary Action */}
      <button
        onClick={onPredict}
        disabled={isPredicting || hasActivePrediction}
        className={`
          relative w-full py-4 rounded-xl font-bold text-lg tracking-wider uppercase
          transition-all duration-200 shadow-[0_0_20px_rgba(30,144,255,0.2)]
          flex items-center justify-center gap-2
          ${isPredicting || hasActivePrediction
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            : 'bg-gradient-to-r from-[#1E90FF] to-[#0A3D62] text-white hover:shadow-[0_0_30px_rgba(30,144,255,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-[#1E90FF]/50'
          }
        `}
      >
        <Sparkles className={`w-5 h-5 ${isPredicting ? 'animate-spin' : ''}`} />
        {isPredicting ? 'CALCULANDO...' : 'PREDECIR'}
      </button>

      {/* Result Actions - Always visible. Disabled state is now high-contrast gray to ensure visibility. */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          onClick={() => onResult('win')}
          disabled={!hasActivePrediction}
          className={`
            py-4 rounded-lg flex items-center justify-center gap-2 border-2 font-bold text-sm tracking-wide transition-all duration-200
            ${hasActivePrediction 
                ? 'bg-green-900/30 border-green-500 text-green-400 hover:bg-green-900/50 hover:border-green-400 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:scale-[1.02]' 
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          <Check className="w-5 h-5" /> ACIERTO ✅
        </button>
        <button
          onClick={() => onResult('loss')}
          disabled={!hasActivePrediction}
          className={`
            py-4 rounded-lg flex items-center justify-center gap-2 border-2 font-bold text-sm tracking-wide transition-all duration-200
            ${hasActivePrediction 
                ? 'bg-red-900/30 border-red-500 text-red-400 hover:bg-red-900/50 hover:border-red-400 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:scale-[1.02]' 
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          <X className="w-5 h-5" /> ERROR ❌
        </button>
      </div>

      {/* Data Management */}
      <div className="border-t border-gray-800 pt-4 mt-2 flex justify-between items-center gap-2">
         <div className="flex gap-2">
            <button
            onClick={onExport}
            className="px-3 py-2 text-xs bg-gray-900 text-gray-400 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition flex items-center gap-2"
            title="Descargar historial_mines.json"
            >
            <Download className="w-3 h-3" /> JSON
            </button>
            
            <label className="px-3 py-2 text-xs bg-gray-900 text-gray-400 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition flex items-center gap-2 cursor-pointer">
            <Upload className="w-3 h-3" />
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
            LOAD
            </label>
         </div>

        <button 
            onClick={onReset}
            className="px-3 py-2 text-xs text-red-500/40 hover:text-red-500 transition flex items-center gap-1"
        >
            <Trash2 className="w-3 h-3" /> RESET
        </button>
      </div>
    </div>
  );
};

export default Controls;