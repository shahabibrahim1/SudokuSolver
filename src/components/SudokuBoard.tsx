import React, { useState } from 'react';
import { solveSudoku } from '../utils/api.ts';
import InputCell from './InputCell';

type Grid = (number | null)[][];

export default function SudokuBoard() {
  const emptyGrid: Grid = Array.from({ length: 9 }, () =>
    Array(9).fill(null)
  );
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [loading, setLoading] = useState(false);

  const handleChange = (r: number, c: number, val: string) => {
    const num = val === '' ? null : Math.min(9, Math.max(1, +val));
    setGrid(g =>
      g.map((row, i) =>
        row.map((cell, j) => (i === r && j === c ? num : cell))
      )
    );
  };

  const onSolve = async () => {
    setLoading(true);
    try {
      const solution = await solveSudoku(grid);
      setGrid(solution);
    } catch (err) {
      alert('Failed to solve. Make sure the puzzle is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-9 gap-1">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <InputCell
              key={`${r}-${c}`}
              value={val}
              onChange={v => handleChange(r, c, v)}
            />
          ))
        )}
      </div>
      <button
        onClick={onSolve}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Solving...' : 'Solve'}
      </button>
    </div>
  );
}
