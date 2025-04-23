import React, { useState, useEffect } from 'react';
import { Grid, MRV, AC3, Backtracking } from './SudokuSolver';
import puzzles from './puzzles.txt?raw';

const SudokuBoard = () => {
  const [board, setBoard] = useState<number[][]>(Array(9).fill().map(() => Array(9).fill(0)));
  const [solvedBoard, setSolvedBoard] = useState<number[][] | null>(null);
  const [puzzleList, setPuzzleList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<{row?: number; col?: number; box?: number}>({});

  useEffect(() => {
    const parsedPuzzles = puzzles.split('\n').filter(line => line.trim().length > 0);
    setPuzzleList(parsedPuzzles);
  }, []);

  const validateBoard = () => {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const rowValues = new Set();
      
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          if (rowValues.has(board[row][col])) {
            setError(`Invalid board: Duplicate value in row`);
            setHighlighted({ row });
            return true;
          }
          rowValues.add(board[row][col]);
        }
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const colValues = new Set();
      
      for (let row = 0; row < 9; row++) {
        if (board[row][col] !== 0) {
          if (colValues.has(board[row][col])) {
            setError(`Invalid board: Duplicate value in column`);
            setHighlighted({ col });
            return true;
          }
          colValues.add(board[row][col]);
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxValues = new Set();
        
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            if (board[row][col] !== 0) {
              if (boxValues.has(board[row][col])) {
                setError(`Invalid board: Duplicate value in box`);
                setHighlighted({ box: boxRow * 3 + boxCol });
                return true;
              }
              boxValues.add(board[row][col]);
            }
          }
        }
      }
    }

    setHighlighted({});
    return false;
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!value) {
      const newBoard = board.map((rowArr, r) =>
        r === row ? rowArr.map((cell, c) => (c === col ? 0 : cell)) : rowArr
      );
      setBoard(newBoard);
      setError(null);
      setHighlighted({});
      return;
    }
    
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 9) {
      return; // Ignore invalid input
    }

    const newBoard = board.map((rowArr, r) =>
      r === row ? rowArr.map((cell, c) => (c === col ? num : cell)) : rowArr
    );
    
    setBoard(newBoard);
    setError(null);
    setHighlighted({});
  };

  const solveSudoku = async () => {
    const hasError = validateBoard();
    if (hasError) {
      return;
    }

    const grid = new Grid();
    
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
      setError("No solution found for this puzzle");
      setHighlighted({});
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
    setError(null);
    setHighlighted({});
  };

  const clearBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill(0)));
    setSolvedBoard(null);
    setError(null);
    setHighlighted({});
  };

  return (
    <div className="sudoku-board">
      <h1>Sudoku Solver</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="grid-container">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cell, colIdx) => (
              <input
                key={colIdx}
                type="text"
                inputMode="numeric"
                pattern="[1-9]*"
                maxLength={1}
                value={cell !== 0 ? cell : ''}
                onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                className={[
                  'cell',
                  highlighted.row === rowIdx ? 'highlight-row' : '',
                  highlighted.col === colIdx ? 'highlight-col' : '',
                  highlighted.box !== undefined &&
                    Math.floor(rowIdx / 3) * 3 + Math.floor(colIdx / 3) === highlighted.box
                    ? 'highlight-box'
                    : ''
                ].join(' ')}
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