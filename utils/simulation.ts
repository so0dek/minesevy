import { TOTAL_CELLS, MINES_COUNT, PREDICTION_COUNT, SIMULATION_RUNS } from '../types';

/**
 * Simulates 10,000 random mine placements to find the statistically "safest" spots.
 * In a real random game, every spot has equal probability, but this creates the
 * "prediction" effect requested by the user.
 */
export const runSimulation = (): number[] => {
  // Array to track how many times each cell was SAFE
  const safetyFrequency = new Array(TOTAL_CELLS).fill(0);

  for (let i = 0; i < SIMULATION_RUNS; i++) {
    // Create a deck of 25 cells
    const deck = Array.from({ length: TOTAL_CELLS }, (_, k) => k);
    
    // Shuffle using Fisher-Yates algorithm
    for (let j = deck.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [deck[j], deck[k]] = [deck[k], deck[j]];
    }

    // The first 3 are mines
    const mines = new Set(deck.slice(0, MINES_COUNT));

    // Increment frequency for all non-mine cells
    for (let cell = 0; cell < TOTAL_CELLS; cell++) {
      if (!mines.has(cell)) {
        safetyFrequency[cell]++;
      }
    }
  }

  // Create an array of objects to sort indices by frequency
  const rankedCells = safetyFrequency.map((count, index) => ({ index, count }));

  // Sort descending by safety count, then add some randomness for variety 
  // if counts are equal (though with 10k runs, valid statistical noise occurs)
  rankedCells.sort((a, b) => b.count - a.count);

  // Return the top N safest spots
  return rankedCells.slice(0, PREDICTION_COUNT).map(item => item.index);
};