'use client';

import React, { useState } from 'react';
import styles from './estadoAnimoModal.module.css';
import { enviarEstadoAnimo } from '@/lib/api';

type EstadoAnimoModalProps = {
  usuarioId: number;
  onClose: () => void;
};

const emociones = ["Feliz", "Triste", "Ansioso", "Motivado", "Relajado", "Enojado"];

const EstadoAnimoModal: React.FC<EstadoAnimoModalProps> = ({ usuarioId, onClose }) => {
  const [seleccionado, setSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!seleccionado) return;

    try {
      setLoading(true);
      await enviarEstadoAnimo({ usuarioId, estado: seleccionado });
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al enviar estado de ánimo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>¿Cómo te sientes hoy?</h2>
        <select
          value={seleccionado}
          onChange={(e) => setSeleccionado(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecciona una opción</option>
          {emociones.map((emo) => (
            <option key={emo} value={emo}>{emo}</option>
          ))}
        </select>
        <button onClick={enviar} disabled={loading || !seleccionado}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default EstadoAnimoModal;
