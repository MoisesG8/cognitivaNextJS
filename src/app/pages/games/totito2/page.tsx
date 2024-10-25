"use client";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContextV2 } from '@/context/AuthContextV2';
import { calcularDiferenciaEnSegundos, getCookie, myFetch } from '@/app/services/funcionesService';
import { utilidades } from '@/app/utils/utilidades';
import Swal from 'sweetalert2';
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
  const [contador, setContador] = useState(0);
  const intervaloRef = useRef(null);

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
        guardarPuntaje(10,contador,new Date())//10 puntos por ganar
        detenerContador()
        return;
      }
    }
    if (!tableroActual.includes('')) {
      setGanador('Empate');
      guardarPuntaje(5,contador,new Date())//5 puntos por empate
      detenerContador()
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

  
  

  const iniciarContador = () => {
    intervaloRef.current = setInterval(() => {
      setContador(prevSeconds => prevSeconds + 1);
    }, 1000);
  };

  const detenerContador = () => {
    clearInterval(intervaloRef.current);
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
    setContador(0)
    iniciarContador()
  };

  const iniciarJuego = () => {
    setJuegoIniciado(true);
    iniciarContador()
  };

  const guardarPuntaje = async (puntuacion, timpo, fecha) => {
    const galletaUser = getCookie('user')
    let id = 0
    if (galletaUser != null) {
      const User = JSON.parse(galletaUser)
      id = User.id
    }
    let objetoPeticion = {
      "idUsuario": id,
      "idActividad": datosJuego?.id,
      "puntuacion": puntuacion,
      "tiempoTotal": timpo,
      "fechaRealizacion": fecha // Ejemplo de formato ISO 8601
    }

    const respuesta = await myFetch(utilidades.rutaApi + 'api/v1/registrarResultado', "POST", objetoPeticion)
    if (respuesta) {
      if (respuesta?.estado == "exito") {
        Swal.fire({
          icon: 'success',
          title: 'Registro puntaje',
          text: 'Puntaje registrado exitosamente.',
          confirmButtonColor: '#6b4226',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registro puntaje',
          text: 'Error al registrar la partida.',
          confirmButtonColor: '#db320e',
        });
      }
    }
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
                <h1><strong>Tiempo:{contador}</strong> { }</h1>
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