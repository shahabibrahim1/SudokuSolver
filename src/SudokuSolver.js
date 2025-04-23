class Grid {
    constructor() {
        this._cells = Array(9).fill().map(() => Array(9).fill('123456789'));
        this._completeDomain = "123456789";
        this._width = 9;
    }

    copy() {
        const copyGrid = new Grid();
        copyGrid._cells = this._cells.map(row => [...row]);
        return copyGrid;
    }

    getCells() {
        return this._cells;
    }

    getCell(row, col) {
        return this._cells[row][col];
    }

    setCell(row, col, value) {
        this._cells[row][col] = value;
    }

    get width() {
        return this._width;
    }

    readPuzzle(puzzleString) {
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            this._cells[row][col] = puzzleString[i] === '.' ? 
                this._completeDomain : puzzleString[i];
        }
    }

    printDomains() {
        this._cells.forEach(row => console.log(row.join(' ')));
    }

    isSolved() {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._width; j++) {
                if (this._cells[i][j].length !== 1 || 
                    !this.isValueConsistent(this._cells[i][j], i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    isValueConsistent(value, row, col) {
        // Check row
        for (let j = 0; j < this._width; j++) {
            if (j !== col && this._cells[row][j].length === 1 && 
                this._cells[row][j] === value) {
                return false;
            }
        }

        // Check column
        for (let i = 0; i < this._width; i++) {
            if (i !== row && this._cells[i][col].length === 1 && 
                this._cells[i][col] === value) {
                return false;
            }
        }

        // Check 3x3 box
        const rowStart = Math.floor(row / 3) * 3;
        const colStart = Math.floor(col / 3) * 3;
        
        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = colStart; j < colStart + 3; j++) {
                if (i !== row && j !== col && 
                    this._cells[i][j].length === 1 && 
                    this._cells[i][j] === value) {
                    return false;
                }
            }
        }

        return true;
    }
}

class MRV {
    selectVariable(grid) {
        let minDomainSize = Infinity;
        let selectedVar = null;

        for (let i = 0; i < grid.width; i++) {
            for (let j = 0; j < grid.width; j++) {
                const domainSize = grid.getCell(i, j).length;
                if (domainSize > 1 && domainSize < minDomainSize) {
                    minDomainSize = domainSize;
                    selectedVar = { row: i, col: j };
                }
            }
        }
        return selectedVar;
    }
}

class AC3 {
    removeDomainRow(grid, row, col) {
        const variablesAssigned = [];
        const value = grid.getCell(row, col);

        for (let j = 0; j < grid.width; j++) {
            if (j !== col) {
                const newDomain = grid.getCell(row, j).replace(value, '');
                if (newDomain.length === 0) {
                    return { variables: null, failure: true };
                }
                if (newDomain.length === 1 && grid.getCell(row, j).length > 1) {
                    variablesAssigned.push({ row, col: j });
                }
                grid.setCell(row, j, newDomain);
            }
        }
        return { variables: variablesAssigned, failure: false };
    }

    removeDomainColumn(grid, row, col) {
        const variablesAssigned = [];
        const value = grid.getCell(row, col);

        for (let i = 0; i < grid.width; i++) {
            if (i !== row) {
                const newDomain = grid.getCell(i, col).replace(value, '');
                if (newDomain.length === 0) {
                    return { variables: null, failure: true };
                }
                if (newDomain.length === 1 && grid.getCell(i, col).length > 1) {
                    variablesAssigned.push({ row: i, col });
                }
                grid.setCell(i, col, newDomain);
            }
        }
        return { variables: variablesAssigned, failure: false };
    }

    removeDomainUnit(grid, row, col) {
        const variablesAssigned = [];
        const value = grid.getCell(row, col);
        const rowStart = Math.floor(row / 3) * 3;
        const colStart = Math.floor(col / 3) * 3;

        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = colStart; j < colStart + 3; j++) {
                if (i !== row || j !== col) {
                    const newDomain = grid.getCell(i, j).replace(value, '');
                    if (newDomain.length === 0) {
                        return { variables: null, failure: true };
                    }
                    if (newDomain.length === 1 && grid.getCell(i, j).length > 1) {
                        variablesAssigned.push({ row: i, col: j });
                    }
                    grid.setCell(i, j, newDomain);
                }
            }
        }
        return { variables: variablesAssigned, failure: false };
    }

    preprocessConsistency(grid) {
        const queue = [];
        for (let i = 0; i < grid.width; i++) {
            for (let j = 0; j < grid.width; j++) {
                if (grid.getCell(i, j).length === 1) {
                    queue.push({ row: i, col: j });
                }
            }
        }
        return this.consistency(grid, queue);
    }

    consistency(grid, queue) {
        while (queue.length > 0) {
            const { row, col } = queue.shift();
            const value = grid.getCell(row, col);
            
            // Process row
            const rowResult = this.removeDomainRow(grid, row, col);
            if (rowResult.failure) return true;
            
            // Process column
            const colResult = this.removeDomainColumn(grid, row, col);
            if (colResult.failure) return true;
            
            // Process unit
            const unitResult = this.removeDomainUnit(grid, row, col);
            if (unitResult.failure) return true;
            
            [...rowResult.variables, ...colResult.variables, ...unitResult.variables]
                .forEach(varObj => {
                    if (!queue.some(item => 
                        item.row === varObj.row && item.col === varObj.col)) {
                        queue.push(varObj);
                    }
                });
        }
        return false;
    }
}

class Backtracking {
    search(grid, varSelector) {
        if (grid.isSolved()) {
            return { solution: grid, success: true };
        }

        const varObj = varSelector.selectVariable(grid);
        if (!varObj) {
            return { solution: grid, success: false };
        }

        const { row, col } = varObj;
        const possibleValues = grid.getCell(row, col);

        for (const value of possibleValues) {
            const gridCopy = grid.copy();
            gridCopy.setCell(row, col, value);
            
            const ac3 = new AC3();
            if (!ac3.consistency(gridCopy, [{ row, col }])) {
                const result = this.search(gridCopy, varSelector);
                if (result.success) {
                    return result;
                }
            }
        }

        return { solution: grid, success: false };
    }
}

export { Grid, MRV, AC3, Backtracking };