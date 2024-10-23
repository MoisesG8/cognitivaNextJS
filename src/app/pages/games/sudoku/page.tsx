"use client";

import React, { useState, useContext } from 'react';

import { AuthContextV2 } from '@/context/AuthContextV2';

// Tipo para representar la cuadrícula del Sudoku
type SudokuGrid = number[][];

const initialGrid: SudokuGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const Sudoku: React.FC = () => {

    /*Contexto*/
    const { user, datosJuego, setDatosJuego } = useContext(AuthContextV2);
    const [grid, setGrid] = useState<SudokuGrid>(initialGrid);

    const [juegoIniciado, setJuegoIniciado] = useState<boolean>(false); // Estado para controlar el inicio del juego
    const handleChange = (row: number, col: number, value: string) => {
        const newGrid = grid.map(arr => [...arr]);
        newGrid[row][col] = value === "" ? 0 : parseInt(value);
        setGrid(newGrid);
    };

    const iniciarJuego = () => {
        setJuegoIniciado(true);
      };
    
    const renderCell = (row: number, col: number) => {
        return (
            <input
                type="number"
                value={grid[row][col] === 0 ? "" : grid[row][col]}
                onChange={(e) => handleChange(row, col, e.target.value)}
                maxLength={1}
                style={{
                    width: '40px',
                    height: '40px',
                    fontSize: '18px',
                    textAlign: 'center'
                }}
                disabled={grid[row][col] !== 0} // Deshabilitar las celdas que ya tienen un número
            />
        );
    };

    return (
        <div className='contenedor'>
            <div className="juego-container">
                {
                    !juegoIniciado ?
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <h5 className='nombreJuego'>{datosJuego?.nombre}</h5>
                            <span className='descripcionJuego'>{datosJuego?.descripcion}</span>
                            <button onClick={iniciarJuego}>Iniciar Juego</button>
                        </div>
                        :
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '5px' }}>
                                {grid.map((row, rowIndex) =>
                                    row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                                )}
                            </div>
                        </>
                }
            </div>
        </div>

    );
};

export default Sudoku;