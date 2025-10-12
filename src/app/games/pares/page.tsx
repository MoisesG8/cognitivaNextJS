"use client";

import React, { useEffect, useState } from "react";
import styles from "./pares.module.css";
import { actualizarPuntos } from "@/lib/api";
import { useRouter } from "next/navigation";

type Card = {
  id: number;
  pairId: number;
  flipped: boolean;
  matched: boolean;
  label: string;
};

type Dificultad = "facil" | "dificil";

export default function ParesPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [firstPick, setFirstPick] = useState<Card | null>(null);
  const [secondPick, setSecondPick] = useState<Card | null>(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [dificultad, setDificultad] = useState<Dificultad | null>(null);
  const [pointsSent, setPointsSent] = useState(false);

  const allLabels = ["🐶", "🐱", "🦊", "🐸", "🐵", "🦁", "🐰", "🐼", "🦄", "🐯", "🐨", "🐮"];

  const iniciarJuego = (nivel: Dificultad) => {
    const token = localStorage.getItem("cognitiva_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setDificultad(nivel);

    const cantidadPares = nivel === "facil" ? 6 : 12;
    const labels = allLabels.slice(0, cantidadPares);
    let deck: Card[] = [];

    labels.forEach((lbl, i) => {
      deck.push({ id: i * 2, pairId: i, flipped: false, matched: false, label: lbl });
      deck.push({ id: i * 2 + 1, pairId: i, flipped: false, matched: false, label: lbl });
    });

    deck = deck
      .map((c) => ({ ...c, id: Math.random() }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFirstPick(null);
    setSecondPick(null);
    setLockBoard(false);
    setMoves(0);
    setPointsSent(false);
  };

  const resetPicks = () => {
    setFirstPick(null);
    setSecondPick(null);
    setLockBoard(false);
  };

  const handleClick = (card: Card) => {
    if (lockBoard || card.flipped || card.matched) return;
    setCards((curr) =>
      curr.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    );
    if (!firstPick) {
      setFirstPick({ ...card, flipped: true });
    } else {
      setSecondPick({ ...card, flipped: true });
    }
  };

  useEffect(() => {
    if (firstPick && secondPick) {
      setLockBoard(true);
      setMoves((m) => m + 1);
      if (firstPick.pairId === secondPick.pairId) {
        setCards((curr) =>
          curr.map((c) =>
            c.pairId === firstPick.pairId ? { ...c, matched: true } : c
          )
        );
        resetPicks();
      } else {
        setTimeout(() => {
          setCards((curr) =>
            curr.map((c) =>
              c.id === firstPick.id || c.id === secondPick.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetPicks();
        }, 1000);
      }
    }
  }, [firstPick, secondPick]);

  const completed = cards.length > 0 && cards.every((c) => c.matched);

  useEffect(() => {
    if (completed && !pointsSent) {
      const puntos = Math.max(10, 150 - moves * 3); // más difícil, menos puntos por muchos movimientos
      actualizarPuntos(puntos)
        .then(() => console.log("Puntos actualizados"))
        .catch((e) => console.error(e))
        .finally(() => setPointsSent(true));
    }
  }, [completed, pointsSent, moves]);

  const resetGame = () => {
    if (dificultad) iniciarJuego(dificultad);
  };

  if (!dificultad) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Selecciona nivel de dificultad</h1>
        <div className={styles.menu}>
          <button onClick={() => iniciarJuego("facil")} className={styles.resetBtn}>Fácil</button>
          <button onClick={() => iniciarJuego("dificil")} className={styles.resetBtn}>Difícil</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Juego de Pares ({dificultad})</h1>
      <p className={styles.moves}>Movimientos: {moves}</p>
      <div className={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.flipped || card.matched ? styles.flipped : ""}`}
            onClick={() => handleClick(card)}
          >
            <div className={`${styles.cardFace} ${styles.front}`}>
              {card.label}
            </div>
            <div className={`${styles.cardFace} ${styles.back}`}>?</div>
          </div>
        ))}
      </div>
      {completed && (
        <div className={styles.message}>
          ¡Felicidades, terminaste en {moves} movimientos!
          <button onClick={resetGame} className={styles.resetBtn}>
            Jugar otra vez
          </button>
        </div>
      )}
    </div>
  );
}
