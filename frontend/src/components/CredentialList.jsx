// frontend/src/components/CredentialList.jsx
import React, { useState } from 'react';

const CredentialCard = ({ cred, isOwner, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  const hasExtraDetails = cred.ip_servidor || cred.ruta_almacenamiento || cred.notas;
  const isShared = !isOwner;

  return (
    <div className={`card ${isShared ? 'shared-card' : ''}`}>
      <div className="card-header">
        <h3 className="platform-name">
          {cred.plataforma}
          {isShared && <span className="badge">Compartido</span>}
        </h3>
        <span className="date">{new Date(cred.fecha_creacion).toLocaleDateString()}</span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="label-text">URL:</span>
          <a href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`} target="_blank" rel="noopener noreferrer" className="link">{cred.url}</a>
        </div>

        <div className="info-row">
          <span className="label-text">Usuario:</span>
          <span className="value">{cred.usuario}</span>
        </div>

        <div className="info-row password-row">
          <span className="label-text">Contraseña:</span>
          <div className="password-display">
            <span className="value">••••••••</span>
            <button className="btn-icon" onClick={() => copyToClipboard(cred.password)} title="Copiar Contraseña">📋</button>
          </div>
        </div>

        {hasExtraDetails && (
          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn-text-sm"
              onClick={() => setShowDetails(!showDetails)}
              style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}
            >
              {showDetails ? '▲ Ocultar Detalles' : '▼ Ver Detalles (IP, Ruta, Notas)'}
            </button>

            {showDetails && (
              <div className="extra-details" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {cred.ip_servidor && (
                  <div className="info-row">
                    <span className="label-text">IP Servidor:</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="value mono">{cred.ip_servidor}</span>
                      <button className="btn-icon-xs" onClick={() => copyToClipboard(cred.ip_servidor)}>📋</button>
                    </div>
                  </div>
                )}
                {cred.ruta_almacenamiento && (
                  <div className="info-row">
                    <span className="label-text">Ruta:</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="value mono" style={{ wordBreak: 'break-all' }}>{cred.ruta_almacenamiento}</span>
                      <button className="btn-icon-xs" onClick={() => copyToClipboard(cred.ruta_almacenamiento)}>📋</button>
                    </div>
                  </div>
                )}
                {cred.notas && (
                  <div className="info-row" style={{ marginTop: '0.5rem' }}>
                    <span className="label-text">Notas:</span>
                    <p className="param-value" style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', margin: 0 }}>{cred.notas}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        {isOwner ? (
          <button className="btn-danger-sm" onClick={() => onDelete(cred.id)}>Eliminar</button>
        ) : (
          <span className="readonly-text">Solo lectura</span>
        )}
      </div>

      <style>{`
                .mono { font-family: monospace; color: #a5f3fc; }
                .btn-text-sm { background: none; border: none; cursor: pointer; padding: 0; width: 100%; text-align: left; }
                .btn-icon-xs { background: none; border: none; cursor: pointer; font-size: 0.9rem; opacity: 0.6; padding: 0; margin-left: 5px; }
                .btn-icon-xs:hover { opacity: 1; }
                .btn-danger-sm { background: rgba(220, 38, 38, 0.2); color: #fca5a5; border: 1px solid rgba(220, 38, 38, 0.5); padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
                .btn-danger-sm:hover { background: rgba(220, 38, 38, 0.5); color: white; }
            `}</style>
    </div>
  );
};

const CredentialList = ({ credentials, onDelete, currentUserId }) => {
  return (
    <div className="credential-grid">
      {credentials.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
          No hay credenciales visibles.
        </p>
      ) : (
        credentials.map((cred) => (
          <CredentialCard
            key={cred.id}
            cred={cred}
            isOwner={cred.owner_id == currentUserId}
            onDelete={() => {
              if (window.confirm('¿Seguro que deseas eliminar?')) onDelete(cred.id);
            }}
          />
        ))
      )}

      <style>{`
        .credential-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .card {
          background-color: var(--card-bg);
          backdrop-filter: blur(10px);
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }
        .shared-card { border-color: rgba(168, 85, 247, 0.3); background: rgba(30, 41, 59, 0.85); }
        .card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .platform-name { font-size: 1.25rem; color: var(--accent-color); display: flex; align-items: center; gap: 0.5rem; }
        .badge { font-size: 0.6rem; background: #a855f7; color: white; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .date { font-size: 0.75rem; color: var(--text-secondary); }
        .info-row { margin-bottom: 0.75rem; display: flex; flex-direction: column; }
        .label-text { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.2rem; }
        .value, .link { font-size: 1rem; color: var(--text-primary); overflow-wrap: break-word; }
        .link { color: var(--accent-hover); text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .password-row { background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 8px; }
        .password-display { display: flex; justify-content: space-between; align-items: center; }
        .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; opacity: 0.7; transition: opacity 0.2s; }
        .btn-icon:hover { opacity: 1; }
        .card-footer { margin-top: 1rem; text-align: right; }
        .readonly-text { font-size: 0.8rem; color: var(--text-secondary); font-style: italic; }
      `}</style>
    </div>
  );
};

export default CredentialList;
