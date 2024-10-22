// /services/farmService.ts
export interface Farm {
    id: number;
    nombre: string;
    ubicacion: string;
    tamanioHectareas: number;
    cultivo: string;
  }
  
  // Datos simulados
  let farms: Farm[] = [
    { id: 1, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 2, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 3, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 4, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 5, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 6, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 7, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 8, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 9, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 10, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 11, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 12, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 13, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 14, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 15, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 16, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
    { id: 17, nombre: 'Finca El Paraiso', ubicacion: 'Guatemala', tamanioHectareas: 10, cultivo: 'Café' },
    { id: 18, nombre: 'Finca La Esperanza', ubicacion: 'Jutiapa', tamanioHectareas: 15, cultivo: 'Plátano' },
  ];
  
  // Obtener todas las fincas
  export const getFarms = async (): Promise<Farm[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(farms), 1000);
    });
  };
  
  // Eliminar una finca
  export const deleteFarm = async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        farms = farms.filter((farm) => farm.id !== id);
        resolve();
      }, 500);
    });
  };