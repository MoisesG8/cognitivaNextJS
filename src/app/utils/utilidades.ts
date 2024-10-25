import jwt from 'jsonwebtoken';

export const utilidades  = {
    "rutaApi": "http://localhost:8080/"
}

export const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');  // Día con dos dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');  // Mes con dos dígitos (los meses empiezan desde 0)
    const año = hoy.getFullYear();  // Año con cuatro dígitos

    return `${dia}/${mes}/${año}`;
}

export const obtenerHoraActual = () => {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');  // Horas con dos dígitos
    const minutos = String(ahora.getMinutes()).padStart(2, '0');  // Minutos con dos dígitos
    const segundos = String(ahora.getSeconds()).padStart(2, '0');  // Segundos con dos dígitos
    return `${horas}:${minutos}:${segundos}`;
}

export const setCookie = (name: string, token: string, days: number): void => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Convertir días a milisegundos
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${token};${expires};path=/;Secure;SameSite=Lax`;
}

export const getCookie = (name: string): string | null => {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].trim();
        if (cookiePair.startsWith(`${name}=`)) {
            return cookiePair.split('=')[1];
        }
    }
    return null; // Cookie no encontrada
}

export const eliminarCookie = (nombre: string) => {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwt.decode(token) as { exp?: number };

        // Verificar si el token tiene una propiedad "exp" y si no ha expirado
        if (decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            return decoded.exp > currentTime; // Verifica si no ha expirado
        }
    } catch (error) {
        return false; // Si no hay "exp" o hay un error, consideramos el token inválido
    }

}

export const myFetch = async <T>(ruta: string, method: string, data: Object): Promise<T> => {
    const config: RequestInit = {
        method: method,
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    try {
        const respuesta = await fetch(ruta, config);
        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
        }

        const respuestaJson: T = await respuesta.json();
        return respuestaJson;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const myFetchGET = (ruta: string) => {
    return new Promise(async function (resolve, reject) {
        var Config = {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
        await fetch(ruta, Config)
            .then((respuesta) => respuesta.json())
            .then((respuestaJson) => resolve(respuestaJson))
            .catch((error) => reject(error))

    })
}


export const restarHoras=(horaInicio, horaFin)=> {
    // Función para convertir una hora en formato HH:MM:SS a segundos
    console.log("inicio:",horaInicio,"fin:",horaFin)
    function horaASegundos(hora) {
      const partes = hora.split(':');
      return parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]);
    }
  
    // Convertimos las horas a segundos
    const inicioEnSegundos = horaASegundos(horaInicio);
    const finEnSegundos = horaASegundos(horaFin);
  
    // Calculamos la diferencia en segundos
    const diferenciaEnSegundos = finEnSegundos - inicioEnSegundos;
  
    return diferenciaEnSegundos;
  }