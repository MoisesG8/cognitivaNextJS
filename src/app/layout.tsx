// /app/layout.tsx
"use client"
import './globals.css';
import React, { useState, useEffect } from "react";
import { AuthContextV2 } from '@/context/AuthContextV2';
import { useRouter } from 'next/navigation';

import { eliminarCookie, getCookie, isTokenValid, myFetch } from './services/funcionesService';

import { useIdleTimer } from 'react-idle-timer'
import { obtenerFechaActual,obtenerHoraActual,restarHoras } from './utils/utilidades';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [acceso, setAcceso] = useState(false);
  const [user, setUser] = useState(false);
  const [datosJuego, setDatosJuego] = useState(null);
  const [fechaInicio, setFechaInicio] = useState<any>(null);
  const [fechaFin, setFechaFin] = useState<any>(null);
  const [horaInicio, setHoraInicio] = useState<any>(obtenerHoraActual());
  const [horaFin, setHoraFin] = useState<any>('');

  useEffect(() => {
    //setCookie("auth","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",1)
    const galletaAuth = getCookie('auth')
    const galletaUser = getCookie('user')
    if (galletaAuth != null) {
      //verificar el token
      const esValida = isTokenValid(galletaAuth)
      if (esValida) {
        setAcceso(true)
        setUser(JSON.parse(galletaUser))
        router.push('/pages/dashboard');
      } else {
        setAcceso(false)
        eliminarCookie("auth")
        eliminarCookie("user")
        router.push('/pages/login'); // Redirige a login si el token no es válido
      }
    } else {
      //sin acceso
      setAcceso(false)
      router.push('/pages/login'); // Redirige a login si no hay token
    }
    setHoraInicio(obtenerHoraActual())
  }, [])

  const onIdle = async () => {
    //Inactivo despues de tanto tiempo
    setFechaInicio(new Date())
    const galletaUser = getCookie('user')
    let id = 0
    if (galletaUser != null) {
      const User = JSON.parse(galletaUser)
      id = User.id
    }
    let objetoPeticion={
      "idUsuario": id,
      "fechaInicio": fechaInicio,
      "fechaFin": new Date(),
      "duracionTotal": restarHoras(horaInicio,obtenerHoraActual())
    }
    const respuesta= await myFetch("http://localhost:8080/api/v1/registrarSesion","POST",objetoPeticion)     
    console.log(respuesta)

  }

  const onActive = (event) => {
    setFechaInicio(new Date()) 
    setHoraInicio(obtenerHoraActual())

  }


  const {
  } = useIdleTimer({
    onIdle,
    onActive,
    //timeout: 1000 * 60 * 20,
    timeout: 1000 * 60, //60 segundos
    promptTimeout: 0,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: false,
    name: 'idle-timer',
    syncTimers: 0,
    leaderElection: false
  })




  return (
    <html lang="en">
      <body>
        <AuthContextV2.Provider value={{ acceso, setAcceso, user, setUser, datosJuego, setDatosJuego }} >
          {
            children
          }
        </AuthContextV2.Provider>
      </body>
    </html>
  );
}