import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];

        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const randomIndex = index + Math.floor(Math.random() * (length - index));
            const cell = cells[randomIndex];

            // Medium
            cells[randomIndex] = cells[index];
            cells[index] = cell;
        }

        // Medium
        let topIndexes: Array<number> = [];
        for (let topIndex: number = 0; topIndexes.length !== column; topIndex++) {
            topIndexes.push(topIndex);
        }

        let rightIndexes: Array<number> = [];
        for (let rightIndex: number = column - 1; rightIndexes.length !== row; rightIndex += column) {
            rightIndexes.push(rightIndex);
        }

        let bottomIndexes: Array<number> = [];
        for (let bottomIndex: number = length - 1; bottomIndexes.length !== column; bottomIndex--) {
            bottomIndexes.push(bottomIndex);
        }

        let leftIndexes: Array<number> = [];
        for (let leftIndex: number = length - column; leftIndexes.length !== row; leftIndex -= column) {
            leftIndexes.push(leftIndex);
        }

        // Medium
        cells = cells.map(function (cell: Cell, index: number) {
            if (!topIndexes.includes(index) && cells[index - column]) {
                cell.adjCells.push(cells[index - column]);
            }

            if (!rightIndexes.includes(index) && cells[index + 1]) {
                cell.adjCells.push(cells[index + 1]);
            }

            if (!bottomIndexes.includes(index) && cells[index + column]) {
                cell.adjCells.push(cells[index + column]);
            }

            if (!leftIndexes.includes(index) && cells[index - 1]) {
                cell.adjCells.push(cells[index - 1]);
            }

            cell.adjCells.forEach((adjCell: Cell) => {
                if (adjCell.bomb) {
                    cell.minesCount += 1;
                }
            });

            return cell;
        });

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }
}
