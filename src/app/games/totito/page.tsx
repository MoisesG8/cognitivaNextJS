"use client";

import React, { useEffect, useState } from 'react';
import style from './totito.module.css';
import { actualizarPuntos } from '@/lib/api';
import { useRouter } from "next/navigation";

const TicTacToe = () => {
  const router = useRouter();
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [lockBoard, setLockBoard] = useState(false);
  const [pointsSent, setPointsSent] = useState(false);

  const calculateWinner = (squares: string[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const emptyIndices = (b: string[]) => b.map((val, i) => val === "" ? i : null).filter(v => v !== null) as number[];

  const aiMove = (b: string[]) => {
    const empty = emptyIndices(b);
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || lockBoard) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    if (newBoard.every(cell => cell !== "")) {
      setWinner("Empate");
      return;
    }

    setLockBoard(true);
    setTimeout(() => {
      const aiIndex = aiMove(newBoard);
      if (aiIndex !== undefined) {
        newBoard[aiIndex] = "O";
        setBoard([...newBoard]);
        const aiWin = calculateWinner(newBoard);
        if (aiWin) setWinner(aiWin);
        else if (newBoard.every(cell => cell !== "")) setWinner("Empate");
      }
      setLockBoard(false);
    }, 400);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setWinner(null);
    setLockBoard(false);
    setPointsSent(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("cognitiva_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (winner && !pointsSent) {
      if (winner === "X") {
        setScore(prev => prev + 10);
        if ((score + 10) % 50 === 0) setLevel(prev => prev + 1);
        actualizarPuntos(10)
          .then(() => console.log("Puntos enviados"))
          .catch((e) => console.error(e));
      }
      setPointsSent(true);
    }
  }, [winner, pointsSent, router, score]);

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
          <h3>{winner === "Empate" ? "¡Empate!" : `¡Ganador: ${winner}!`}</h3>
          <button onClick={resetGame}>Reiniciar Juego</button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
