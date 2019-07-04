// Modification de la logique CellProps pour récupérer l'objet et non pas le status. Cela nous permet d'accéder à toutes les propriétés de cell et non pas simplement au status
import React from 'react';
import { CellStatus, Cell as CellClass } from '../Domain/Cell';

type CellProps = {
    cell: CellClass;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor:
        status === 'untouched' || status === 'flagged' ? '#ccc' : undefined,
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.cell.status)}
        >
            {props.cell.status === 'dug' && props.cell.minesCount > 0 ? props.cell.minesCount : emojis[props.cell.status]}
        </div>
    );
};
