// frontend/src/components/LoginPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: result.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Sistema de Gestión de Credenciales</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Correo Electrónico</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@admin.com"
            />
          </div>

          <div className="input-group">
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Iniciar Sesión
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        .login-card {
          background-color: var(--card-bg);
          backdrop-filter: blur(10px);
          border: var(--glass-border);
          padding: 3rem;
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 450px;
          box-shadow: var(--shadow-lg);
          animation: fadeIn 0.8s ease-out;
        }
        .login-title {
          text-align: center;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          color: transparent;
        }
        .login-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        .error-msg {
          background-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
