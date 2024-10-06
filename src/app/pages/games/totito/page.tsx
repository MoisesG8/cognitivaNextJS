"use client"; 

import React, { useState } from 'react';
import style from './totito.module.css';

const TicTacToe = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null)); 
  const [isXNext, setIsXNext] = useState<boolean>(true); 
  const [score, setScore] = useState<number>(0); 
  const [level, setLevel] = useState<number>(1); 
  const [winner, setWinner] = useState<string | null>(null); 

  const calculateWinner = (squares: string[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => { 
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const currentWinner = calculateWinner(newBoard);

    if (currentWinner) {
      setWinner(currentWinner);
      setScore(score + (currentWinner === 'X' ? 10 : 5));
      if (score % 50 === 0 && score > 0) {
        setLevel(level + 1);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className={style.tictactoepage}>
      <div className={style.scoreboard}>
        <p>Puntuación: {score}</p>
        <p>Nivel: {level}</p>
      </div>
      <div className={style.board}>
        {board.map((value, index) => (
          <button key={index} className={style.square} onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>
      {winner && (
        <div className={style.winnermessage}>
          <h3>¡Ganador: {winner}!</h3>
          <button onClick={resetGame}>Reiniciar Juego</button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
