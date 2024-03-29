import { Grid } from './Grid';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }

    return false;
};

export const isVictorious = (grid: Grid) => {
    for (let cell of grid) {
        if ((!cell.dug && !cell.bomb) || cell.detonated) {
            return false;
        }
    }

    return true;
};
