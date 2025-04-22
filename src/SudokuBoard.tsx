// SudokuBoard.tsx
import React, { useState, useEffect } from 'react';
import { Grid, MRV, AC3, Backtracking } from './SudokuSolver';
import puzzles from './puzzles.txt?raw';

const SudokuBoard = () => {
  const [board, setBoard] = useState<number[][]>(Array(9).fill().map(() => Array(9).fill(0)));
  const [solvedBoard, setSolvedBoard] = useState<number[][] | null>(null);
  const [puzzleList, setPuzzleList] = useState<string[]>([]);

  useEffect(() => {
    // Parse puzzles from text file
    const parsedPuzzles = puzzles.split('\n').filter(line => line.trim().length > 0);
    setPuzzleList(parsedPuzzles);
  }, []);

  const handleCellChange = (row: number, col: number, value: number) => {
    const newBoard = board.map((rowArr, r) =>
      r === row ? rowArr.map((cell, c) => (c === col ? value : cell)) : rowArr
    );
    setBoard(newBoard);
  };

  const solveSudoku = async () => {
    const grid = new Grid();
    
    // Convert the current board state to the solver's format
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          grid.setCell(i, j, board[i][j].toString());
        }
      }
    }

    const ac3 = new AC3();
    if (ac3.preprocessConsistency(grid)) {
      console.log("Preprocessing failed");
      return;
    }

    const backtracking = new Backtracking();
    const mrv = new MRV();
    const result = backtracking.search(grid, mrv);

    if (result.success) {
      const solution = result.solution.getCells().map(row => 
        row.map(cell => parseInt(cell))
      );
      setSolvedBoard(solution);
    } else {
      console.log("No solution found");
    }
  };

  const fillRandomPuzzle = () => {
    if (puzzleList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * puzzleList.length);
    const selectedPuzzle = puzzleList[randomIndex];

    const newBoard = Array(9).fill().map(() => Array(9).fill(0));
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      newBoard[row][col] = selectedPuzzle[i] === '.' ? 0 : parseInt(selectedPuzzle[i]);
    }

    setBoard(newBoard);
    setSolvedBoard(null);
  };

  const clearBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill(0)));
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