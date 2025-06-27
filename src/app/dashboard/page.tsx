"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./dashboard.module.css";

type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha_creacion: string;
  ruta: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  // 1️⃣ Protegemos la ruta y cargamos actividades
  useEffect(() => {
    const token = localStorage.getItem("cognitiva_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/listarActividades`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar actividades");
        return res.json();
      })
      .then((data: Actividad[]) => setActividades(data))
      .catch((e) => {
        console.error(e);
        setError("No se pudo cargar las actividades");
      })
      .finally(() => setLoading(false));
  }, [router]);

  // 2️⃣ Lectura de usuario para el saludo
  const userString =
    typeof window !== "undefined"
      ? localStorage.getItem("cognitiva_user")
      : null;
  const user = userString ? JSON.parse(userString) : null;

  // 3️⃣ Cerrar sesión
   const handleLogout = async () => {
    localStorage.removeItem("cognitiva_token");
    localStorage.removeItem("cognitiva_user");
    const sesionId = localStorage.getItem("cognitiva_session");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${sesionId}/endSession`, { method: 'PUT' });
    localStorage.removeItem("cognitiva_session");
    router.replace("/login");
  };

  if (loading) {
    return <div className={style.dashboardpage}>Cargando...</div>;
  }

  if (error) {
    return <div className={style.dashboardpage}>{error}</div>;
  }

  return (
    <div className={style.dashboardpage}>
      <div className={style.dashboardmenu}>
        <div className={style.header}>
          <h2>Bienvenido, {user?.nombre ?? "Usuario"}</h2>
          <button className={style.logoutButton} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <p>Selecciona un juego para comenzar:</p>
        <div className={style.buttoncontainer}>
          {actividades.map((act) => (
            <button
              key={act.id}
              className={style.gameButton}
              onClick={() => router.push(`/${act.ruta}`)}
            >
              {act.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
