import React from 'react';
import SudokuBoard from './components/SudokuBoard';

export default function App() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Sudoku Solver</h1>
      <SudokuBoard />
    </div>
  );
}
