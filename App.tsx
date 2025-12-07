import React, { useState, useEffect, useCallback } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { GameStats, Prediction, HistoryData } from './types';
import { runSimulation } from './utils/simulation';
import Grid from './components/Grid';
import StatsPanel from './components/StatsPanel';
import Controls from './components/Controls';

const LOCAL_STORAGE_KEY = 'sofnet_mines_v2_data';

const App: React.FC = () => {
  // Application State
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0 });
  const [history, setHistory] = useState<Prediction[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<number[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: HistoryData = JSON.parse(savedData);
        setStats(parsed.stats);
        setHistory(parsed.predictions);
      } catch (e) {
        console.error("Failed to parse local history", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever important state changes
  useEffect(() => {
    const data: HistoryData = { stats, predictions: history };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [stats, history]);

  const handlePredict = useCallback(async () => {
    setIsPredicting(true);
    setCurrentPrediction([]); // Clear board
    setActiveRoundId(null);

    // Artificial delay to simulate "processing 10,000 plays"
    setTimeout(() => {
      const bestSpots = runSimulation();
      setCurrentPrediction(bestSpots);
      
      const newPredictionId = crypto.randomUUID();
      setActiveRoundId(newPredictionId);
      
      // We don't save to history yet, only when result is confirmed
      setIsPredicting(false);
    }, 800);
  }, []);

  const handleResult = (result: 'win' | 'loss') => {
    if (!activeRoundId) return;

    // Update Stats
    setStats(prev => ({
      wins: prev.wins + (result === 'win' ? 1 : 0),
      losses: prev.losses + (result === 'loss' ? 1 : 0)
    }));

    // Add to history
    const entry: Prediction = {
      id: activeRoundId,
      timestamp: Date.now(),
      safeSpots: currentPrediction,
      result: result
    };
    
    setHistory(prev => [entry, ...prev]);
    
    // Clear active state
    setActiveRoundId(null);
    setCurrentPrediction([]);
  };

  const handleExport = () => {
    const data: HistoryData = { stats, predictions: history };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial_mines.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: HistoryData = JSON.parse(event.target?.result as string);
        if (parsed.stats && Array.isArray(parsed.predictions)) {
          setStats(parsed.stats);
          setHistory(parsed.predictions);
          alert('Historial cargado correctamente.');
        } else {
            throw new Error('Invalid format');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON. Asegúrate de que es un archivo válido de Sofnet-MinesPre.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleReset = () => {
      if(window.confirm("¿Estás seguro de borrar todo el historial?")) {
        setStats({ wins: 0, losses: 0 });
        setHistory([]);
        setCurrentPrediction([]);
        setActiveRoundId(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-black to-gray-900 font-sans">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#1E90FF] to-gray-400 mb-2">
          SOFNET-MINESPRE <span className="text-xs align-top border border-[#1E90FF] rounded px-1 text-[#1E90FF]">v2</span>
        </h1>
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          SIMULACIÓN ESTADÍSTICA ACTIVA
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16">
        
        {/* Left Column: Grid */}
        <div className="flex-1 w-full flex justify-center">
            <Grid 
              predictedIndices={currentPrediction} 
              isPredicting={isPredicting} 
            />
        </div>

        {/* Right Column: Controls & Stats */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start">
            <StatsPanel stats={stats} />
            
            <Controls 
              onPredict={handlePredict}
              onResult={handleResult}
              onExport={handleExport}
              onImport={handleImport}
              onReset={handleReset}
              hasActivePrediction={!!activeRoundId}
              isPredicting={isPredicting}
            />

            {/* Recent History Mini-View */}
            <div className="mt-8 w-full max-w-md">
                <div className="text-xs text-gray-500 font-mono mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> HISTORIAL RECIENTE
                </div>
                <div className="bg-black/40 rounded border border-gray-800 p-2 max-h-32 overflow-y-auto space-y-1">
                    {history.length === 0 ? (
                        <div className="text-gray-600 text-xs text-center py-2">Sin registros</div>
                    ) : (
                        history.slice(0, 5).map(h => (
                            <div key={h.id} className="flex justify-between items-center text-xs p-1 hover:bg-white/5 rounded">
                                <span className="text-gray-400 font-mono">
                                    {new Date(h.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={h.result === 'win' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                                    {h.result === 'win' ? 'ACIERTO' : 'ERROR'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;