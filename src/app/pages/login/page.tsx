"use client"; 

import styles from './login.module.css';

export default function Login() {


  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Estimule sus habilidades cognitivas</h1>
        <br />
        <form>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className={styles.loginButton}>Iniciar sesión</button>
        </form>
        <p className={styles.registerPrompt}>
          ¿No tienes cuenta?{' '}
          <button className={styles.registerButton} >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
