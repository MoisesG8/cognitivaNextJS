export async function actualizarPuntos(puntos: number) {
  const userStr = localStorage.getItem("cognitiva_user");
  if (!userStr) throw new Error("Usuario no encontrado");
  const { id } = JSON.parse(userStr); // tu dto trae id

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/actualizarPuntos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, puntos }),
  });

  if (!res.ok) {
    throw new Error("No se pudo actualizar puntos");
  }
  return res.text(); // o res.json() según tu backend
}

export const enviarEstadoAnimo = async (payload: { usuarioId: number, estado: string, descripcion: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/registrarEstadoAnimo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("No se pudo registrar el estado de ánimo");
  return await res.json();
};

export const descargarReporteEstadoAnimo = async (): Promise<Blob> => {
  const userStr = localStorage.getItem("cognitiva_user");
  if (!userStr) throw new Error("Usuario no encontrado");
  const { id } = JSON.parse(userStr);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/descargar/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo descargar el reporte de estado de ánimo");
  }

  return await response.blob(); // Devuelve el blob listo para usar en el frontend
};

export const enviarReporte = async() => {
  const userStr = localStorage.getItem("cognitiva_user");
  if (!userStr) throw new Error("Usuario no encontrado");
  const { id } = JSON.parse(userStr);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enviar-reporte/${id}`, )
  if (!res.ok) throw new Error("No se pudo enviar el reporte de estado de ánimo");
  return await res.json();
}


