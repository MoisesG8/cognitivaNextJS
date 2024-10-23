'use client';
import React, { useState, useEffect, useContext } from 'react';
import { lstPreguntas } from '@/app/utils/lstPreguntas';
import { AuthContextV2 } from '@/context/AuthContextV2';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

const sinonimosAntonimos: React.FC = () => {

  /*Contexto*/
  const { user, datosJuego, setDatosJuego } = useContext(AuthContextV2);

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState<number>(10);
  const [juegoIniciado, setJuegoIniciado] = useState<boolean>(false); // Estado para controlar el inicio del juego

  const mezclarPreguntas = (array: Pregunta[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const preguntasMezcladas = mezclarPreguntas([...lstPreguntas]);
    setPreguntas(preguntasMezcladas);
  }, []);

  useEffect(() => {
    if (juegoIniciado && tiempoRestante > 0 && indice < preguntas.length) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else if (juegoIniciado && tiempoRestante === 0) {
      siguientePregunta();
    }
  }, [tiempoRestante, indice, preguntas.length, juegoIniciado]);

  const manejarSeleccion = (respuesta: string) => {
    setRespuestaSeleccionada(respuesta);
    if (respuesta === preguntas[indice].respuestaCorrecta) {
      setResultado("¡Correcto!");
    } else {
      setResultado("Incorrecto. La respuesta correcta era: " + preguntas[indice].respuestaCorrecta);
    }
  };

  const siguientePregunta = () => {
    setIndice(indice + 1);
    setRespuestaSeleccionada(null);
    setResultado(null);
    setTiempoRestante(10); // Reinicia el temporizador
  };

  const iniciarJuego = () => {
    setJuegoIniciado(true);
    setIndice(0);
    setTiempoRestante(10);
    setRespuestaSeleccionada(null);
    setResultado(null);
  };

  if (indice >= preguntas.length) {
    return (<div className='contenedor'>
       <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
       <h5 className='nombreJuego'>¡Juego terminado!</h5>
      </div>
    </div >)
  }

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
              <h2 style={{ fontSize: "25px" }}>{preguntas[indice].pregunta}</h2>
              <p>Tiempo restante: {tiempoRestante} segundos</p>
              <ul>
                {preguntas[indice].opciones.map((opcion) => (
                  <li style={{ textAlign: 'center', textTransform: 'uppercase' }} key={opcion} onClick={() => manejarSeleccion(opcion)}>
                    {opcion}
                  </li>
                ))}
              </ul>
              {respuestaSeleccionada && (
                <div>
                  <p className="result">{resultado}</p>
                  <button onClick={siguientePregunta}>Siguiente Pregunta</button>
                </div>
              )}
            </>
        }
      </div>
    </div>
  );
};

export default sinonimosAntonimos;