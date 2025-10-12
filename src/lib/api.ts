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

export const enviarEstadoAnimo = async (payload: { usuarioId: number, estado: string }) => {
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

