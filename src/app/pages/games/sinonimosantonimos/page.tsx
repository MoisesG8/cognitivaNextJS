'use client';
import React, { useState, useEffect, useContext } from 'react';
import { lstPreguntas } from '@/app/utils/lstPreguntas';
import { AuthContextV2 } from '@/context/AuthContextV2';
import { calcularDiferenciaEnSegundos, getCookie, myFetch } from '@/app/services/funcionesService';
import { useRouter } from 'next/navigation';

import { utilidades } from '@/app/utils/utilidades';
import Swal from 'sweetalert2';
interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

const sinonimosAntonimos: React.FC = () => {
  const router = useRouter();
  /*Contexto*/
  const { user, datosJuego, setDatosJuego } = useContext(AuthContextV2);

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState<number>(10);
  const [juegoIniciado, setJuegoIniciado] = useState<boolean>(false); // Estado para controlar el inicio del juego

  const [tiempoInicio, setTiempoInicio] = useState<any>(new Date());
  const [puntaje, setPuntaje] = useState<any>(0);


  let tiempoXPregunta = 5

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
      setPuntaje(puntaje + 1)
    } else {
      setResultado("Incorrecto. La respuesta correcta era: " + preguntas[indice].respuestaCorrecta);
    }
  };

  const siguientePregunta = () => {
    setIndice(indice + 1);
    setRespuestaSeleccionada(null);
    setResultado(null);
    setTiempoRestante(tiempoXPregunta); // Reinicia el temporizador
  };

  const iniciarJuego = () => {
    setJuegoIniciado(true);
    setIndice(0);
    setTiempoRestante(tiempoXPregunta);
    setRespuestaSeleccionada(null);
    setResultado(null);
    setTiempoInicio(new Date())
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
    router.push(`/pages/dashboard`);
  };
  if (indice >= preguntas.length) {
    let tiempoSeg = calcularDiferenciaEnSegundos(tiempoInicio, new Date())

    return (<div className='contenedor'>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h5 className='nombreJuego'>¡Juego terminado!</h5>
        <h5 className='nombreJuego'>Tu puntaje fue: {puntaje} en {tiempoSeg} seg. / {preguntas.length * tiempoXPregunta} seg.</h5>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => { guardarPuntaje(puntaje, tiempoSeg, new Date()) }}>Finalizar</button>
        </div>
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