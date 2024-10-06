"use client";

import React from 'react';
import style from './dashboard.module.css'; 

const Dashboard = () => {
  return (
    <div className={style.dashboardpage}>
      <div className={style.dashboardmenu}>
        <h2>Bienvenido, Juan Perez</h2>
        <p>Selecciona un juego para comenzar:</p>
        <div className={style.buttoncontainer}>
          <button onClick={() => alert('Iniciando juego de Totito')}>
            Totito
          </button>
          <button onClick={() => alert('Iniciando juego de Memoria')}>
            Memoria
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
