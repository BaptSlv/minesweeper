export type CellStatus = 'untouched' | 'flagged' | 'dug' | 'detonated';
export type CellAction = 'dig' | 'flag';

export class Cell {
    public bomb: boolean;
    public flagged: boolean;
    public dug: boolean;
    public minesCount: number;
    public adjCells: Array<Cell>;

    static withBomb(): Cell {
        return new Cell(true, false, false, 0);
    }

    static withoutBomb(): Cell {
        return new Cell(false, false, false, 0);
    }

    constructor(withBomb: boolean, flagged: boolean, dug: boolean, minesCount: number) {
        this.bomb = withBomb;
        this.flagged = flagged;
        this.dug = dug;
        this.minesCount = minesCount;
        this.adjCells = [];
    }

    flag(): Cell {
        if (this.dug === true) {
            throw new Error('This cell has already been dug');
        }
        return new Cell(this.bomb, !this.flagged, this.dug, this.minesCount);
    }

    // propagation des cellules
    dig(propagation: boolean = true): Cell {
        this.flagged = false;
        this.dug = true;

        if (propagation) {
            this.adjCells.forEach((cell: Cell) => {
                if (!cell.bomb && !cell.dug) {
                    cell.dig(cell.minesCount === 0);
                }
            });
        }

        return this;
    }

    get detonated(): boolean {
        return this.bomb && this.dug;
    }

    get status(): CellStatus {
        if (this.detonated) {
            return 'detonated';
        }
        if (this.dug) {
            return 'dug';
        }
        if (this.flagged) {
            return 'flagged';
        }
        return 'untouched';
    }
}
