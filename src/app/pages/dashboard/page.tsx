"use client";

import React, { useEffect, useState } from 'react';
import style from './dashboard.module.css';

import { AuthContextV2 } from '@/context/AuthContextV2';
import { useContext } from "react";
import { eliminarCookie, myFetchGET, getCookie } from '@/app/services/funcionesService';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { utilidades } from '@/app/utils/utilidades';
const Dashboard = () => {
  /*Contexto*/
  const { user, setAcceso,datosJuego,setDatosJuego } = useContext(AuthContextV2);
  const [planificaciones, setPlanificaciones] = useState<any[]>([]);

  const [lstJuegos, setLstJuegos] = useState<any[]>([]);

  const router = useRouter();

  const cerrarSesion = () => {
    eliminarCookie("auth")
    eliminarCookie("user")
    setAcceso(false)
  }

  const confirmarCerrarSesion = () => {
    Swal.fire({
      title: 'Cerrar Sesión',
      text: 'Desea cerrar session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarSesion()
        router.push('/pages/login')
      }
    });
  }

  const obtenerJuegos = async () => {
    const respuesta = await myFetchGET(utilidades.rutaApi + 'api/v1/listarActividades')
    setLstJuegos(respuesta)
  };
  useEffect(() => {
    obtenerJuegos();
  }, [])


  const jugar = (item) => {
    console.log(item)
    if (item.tipo === "1") {
      setDatosJuego(item)
      router.push(`/pages/games/sinonimosantonimos`);
    }
    if (item.tipo === "2") {
      setDatosJuego(item)
      router.push(`/pages/games/series`);
    }    
    if (item.tipo === "3") {
      setDatosJuego(item)
      router.push(`/pages/games/totito2`);
    }     
    if (item.tipo === "4") {
      setDatosJuego(item)
      router.push(`/pages/games/sudoku`);
    }      
  };
  return (
    <div className={style.dashboardpage}>
      <button onClick={() => { confirmarCerrarSesion() }} className='botonCerrarSesion'>❌ Cerrar Sesion</button>
      <div className={style.dashboardmenu}>
        <h2>Bienvenido, {user.nombre}</h2>
        <p>Selecciona un juego para comenzar:</p><br />
        <div className={style.buttoncontainer}>
          {
            lstJuegos.map((item) =>
              <button onClick={() => jugar(item)} style={{ height: 80 }} title={item.descripcion} key={item.id}>
                {item.nombre}

              </button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
