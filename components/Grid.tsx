import React from 'react';
import { Star } from 'lucide-react';
import { GRID_SIZE } from '../types';

interface GridProps {
  predictedIndices: number[];
  isPredicting: boolean;
}

const Grid: React.FC<GridProps> = ({ predictedIndices, isPredicting }) => {
  // Create an array 0..24
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  return (
    <div className="relative p-1 bg-[#0f1216] rounded-xl shadow-2xl border border-gray-800">
      <div 
        className="grid grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-4"
        style={{ width: 'fit-content', margin: '0 auto' }}
      >
        {cells.map((index) => {
          const isPredicted = predictedIndices.includes(index);
          
          return (
            <div
              key={index}
              className={`
                w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center
                transition-all duration-300 transform shadow-lg
                ${isPredicted 
                  ? 'bg-[#0A3D62] scale-105 shadow-[0_0_15px_rgba(30,144,255,0.4)] border border-[#1E90FF]/30' 
                  : 'bg-[#1E90FF] opacity-90 hover:opacity-100 hover:scale-[1.02]'}
              `}
            >
              <div className={`transition-all duration-500 ${isPredicted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <Star 
                  fill="#FFD700" 
                  stroke="#B8860B" 
                  size={32} 
                  className="animate-[spin_0.5s_ease-out_reverse]" 
                />
              </div>
              
              {!isPredicted && (
                <div className="w-8 h-8 rounded-full bg-white/10" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Simulation Loading Overlay */}
      {isPredicting && (
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-[#1E90FF]">
          <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="font-mono text-sm tracking-widest text-white">ANALIZANDO...</span>
        </div>
      )}
    </div>
  );
};

export default Grid;