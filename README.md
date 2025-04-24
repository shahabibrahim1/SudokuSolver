# 🧩 Sudoku Solver (React + TypeScript)

A web-based Sudoku assistant that lets you

1. **Load** a random 9×9 puzzle or pre-fill your own clues  
2. **Solve** it instantly with one click  
3. **Inspect** the highlighted solution board

Under the hood the solver treats Sudoku as a **Constraint Satisfaction Problem (CSP)** and combines:

* **Arc-Consistency-3 (AC-3)** preprocessing  
* **Backtracking search**  
* **Minimum Remaining Value (MRV)** heuristic for variable selection

---

## ✨ Demo

******
---

## 🔍 How it Works

| Layer | Tech / File(s) | Key Responsibilities |
|-------|----------------|----------------------|
| **UI / Front-end** | `SudokuBoard.tsx`, `SudokuBoard.css` | Render 9×9 grid, manage input validation, error highlighting, buttons for **Solve / Clear / Random** :contentReference[oaicite:0]{index=0} |
| **State Management** | React hooks (`useState`, `useEffect`) | Keep track of the current board, solved board, and error states :contentReference[oaicite:1]{index=1}&#8203;:contentReference[oaicite:2]{index=2} |
| **Random Puzzle Loader** | `puzzles.txt` | Supplies hundreds of dot-notation puzzles for quick testing :contentReference[oaicite:3]{index=3}&#8203;:contentReference[oaicite:4]{index=4} |
| **Solver Core** | `SudokuSolver.js` | *CSP engine*: AC-3 filtering → backtracking with MRV |
| **Bootstrap Styling** | Imported globally in `main.tsx` | Gives buttons & layout a clean look out of the box :contentReference[oaicite:5]{index=5}&#8203;:contentReference[oaicite:6]{index=6} |

Algorithm flow:

1. **Validation** – Board duplicates are rejected client-side before solving.  
2. **AC-3** – Removes inconsistent values to shrink search space.  
3. **MRV Backtracking** – Recursively assigns values, always picking the cell with the fewest legal options first.  
4. **Solution Render** – Fills a secondary read-only grid with the result.

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/shahabibrahim1/SudokuSolver.git
cd SudokuSolver

# 2. Install deps (Node ≥18)
npm install          # or pnpm install / yarn

# 3. Run dev server (Vite)
npm run dev          # http://localhost:5173

# 4. Build for production
npm run build
