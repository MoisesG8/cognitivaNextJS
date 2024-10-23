"use client";
import React, { useState, useEffect,useContext } from 'react';
import { AuthContextV2 } from '@/context/AuthContextV2';

const totito2: React.FC = () => {

      /*Contexto*/
      const { user, datosJuego, setDatosJuego } = useContext(AuthContextV2);

  const [tablero, setTablero] = useState<string[]>(Array(9).fill(''));
  const [jugador, setJugador] = useState<string>('X');
  const [ganador, setGanador] = useState<string | null>(null);
  const [juegoIniciado, setJuegoIniciado] = useState<boolean>(false); // Estado para controlar el inicio del juego
  const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const manejarClick = (indice: number) => {
    if (tablero[indice] === '' && !ganador) {
      const nuevoTablero = [...tablero];
      nuevoTablero[indice] = jugador;
      setTablero(nuevoTablero);
      verificarGanador(nuevoTablero);
      setJugador('O'); // Cambia a la IA
    }
  };

  const verificarGanador = (tableroActual: string[]) => {
    for (const combinacion of combinacionesGanadoras) {
      const [a, b, c] = combinacion;
      if (tableroActual[a] && tableroActual[a] === tableroActual[b] && tableroActual[a] === tableroActual[c]) {
        setGanador(tableroActual[a]);
        return;
      }
    }
    if (!tableroActual.includes('')) {
      setGanador('Empate');
    }
  };

  const jugarIA = () => {
    const nuevoTablero = [...tablero];

    // IA simple: juega en la primera casilla vacía
    const indiceIA = nuevoTablero.findIndex(casilla => casilla === '');
    if (indiceIA !== -1) {
      nuevoTablero[indiceIA] = 'O';
      setTablero(nuevoTablero);
      verificarGanador(nuevoTablero);
      setJugador('X'); // Cambia de vuelta al jugador
    }
  };

  useEffect(() => {
    if (jugador === 'O' && !ganador) {
      jugarIA();
    }
  }, [jugador, ganador]);

  const reiniciarJuego = () => {
    setTablero(Array(9).fill(''));
    setGanador(null);
    setJugador('X');
  };

  const iniciarJuego = () => {
    setJuegoIniciado(true);
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
              <div className="tres-en-raya">
                <h1>Tres en Raya</h1>
                {ganador && <h2>{ganador === 'Empate' ? '¡Empate!' : `Ganador: ${ganador}`}</h2>}
                <div className="tablero">
                  {tablero.map((valor, indice) => (
                    <div key={indice} className="casilla" onClick={() => manejarClick(indice)}>
                      {valor}
                    </div>
                  ))}
                </div>
                <button onClick={reiniciarJuego}>Reiniciar Juego</button>
              </div>
            </>
        }
      </div>
    </div>








  );
};

export default totito2;