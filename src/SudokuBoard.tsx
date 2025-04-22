// SudokuBoard.tsx
import React, { useState } from 'react';

const SudokuBoard = () => {
  const [board, setBoard] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));
  const [solvedBoard, setSolvedBoard] = useState<number[][] | null>(null);

  const handleCellChange = (row: number, col: number, value: number) => {
    const newBoard = board.map((rowArr, r) =>
      r === row ? rowArr.map((cell, c) => (c === col ? value : cell)) : rowArr
    );
    setBoard(newBoard);
  };

  const solveSudoku = async () => {
  };

  const fillRandomPuzzle  = async () => {
  };

  const clearBoard = () => {
    setBoard(Array(9).fill(Array(9).fill(0)));
    setSolvedBoard(null);
  };

  return (
    <div className="sudoku-board">
      <h1>Sudoku Solver</h1>
      <div className="grid-container">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cell, colIdx) => (
              <input
                key={colIdx}
                type="number"
                min="1"
                max="9"
                value={cell !== 0 ? cell : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : 0;
                  handleCellChange(rowIdx, colIdx, value);
                }}
                className="cell"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={solveSudoku}>Solve</button>
        <button onClick={clearBoard}>Clear</button>
        <button onClick={fillRandomPuzzle}>Fill Random Puzzle</button>        
      </div>
      {solvedBoard && (
        <div className="solved-board">
          <h2>Solution:</h2>
          <div className="grid-container">
            {solvedBoard.map((row, rowIdx) => (
              <div key={rowIdx} className="row">
                {row.map((cell, colIdx) => (
                  <div key={colIdx} className="cell">{cell}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuBoard;