// frontend/src/components/CredentialForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrganizations, getUserOrgs } from '../services/api';

const CredentialForm = ({ onAdd, onUpdate, userHasOrg, initialData, onCancel, defaultOrgId }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        plataforma: '',
        url: '',
        usuario: '',
        password: '',
        ip_servidor: '',
        ruta_almacenamiento: '',
        notas: '',
        compartir: false,
        id_organizacion: ''
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        // Cargar organizaciones: Todas si es superadmin, Própias si es usuario normal
        if (user) {
            if (user.rol === 'superadmin') {
                getOrganizations().then(setOrgs).catch(console.error);
            } else {
                getUserOrgs().then(setOrgs).catch(console.error);
            }
        }

        if (initialData) {
            setFormData({
                id: initialData.id,
                plataforma: initialData.plataforma,
                url: initialData.url,
                usuario: initialData.usuario,
                password: initialData.password,
                ip_servidor: initialData.ip_servidor || '',
                ruta_almacenamiento: initialData.ruta_almacenamiento || '',
                notas: initialData.notas || '',
                compartir: !!initialData.id_organizacion,
                id_organizacion: initialData.id_organizacion || ''
            });

            if (initialData.ip_servidor || initialData.ruta_almacenamiento || initialData.notas) {
                setShowAdvanced(true);
            }
        } else if (defaultOrgId) {
            // Si es nueva y viene con defaultOrgId (scope)
            setFormData(prev => ({ ...prev, id_organizacion: defaultOrgId, compartir: true }));
        }
    }, [user, initialData, defaultOrgId]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            onUpdate(formData);
        } else {
            onAdd(formData);
            setFormData({
                plataforma: '', url: '', usuario: '', password: '',
                ip_servidor: '', ruta_almacenamiento: '', notas: '',
                compartir: false, id_organizacion: ''
            });
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">{initialData ? 'Editar Credencial' : 'Agregar Nueva Credencial'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-group">
                        <label className="label">Plataforma *</label>
                        <input name="plataforma" value={formData.plataforma} onChange={handleChange} placeholder="Ej: Servidor Prod" className="input-field" required />
                    </div>

                    <div className="input-group">
                        <label className="label">URL *</label>
                        <input name="url" value={formData.url} onChange={handleChange} placeholder="Ej: 192.168.1.10 o midominio.com" className="input-field" required />
                    </div>

                    <div className="input-group">
                        <label className="label">Usuario / Correo *</label>
                        <input name="usuario" value={formData.usuario} onChange={handleChange} placeholder="Ej: root" className="input-field" required />
                    </div>

                    <div className="input-group">
                        <label className="label">Contraseña *</label>
                        <input name="password" value={formData.password} onChange={handleChange} placeholder="********" className="input-field" required />
                    </div>
                </div>

                {/* Toggle para opciones avanzadas */}
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        className="btn-text"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}
                    >
                        {showAdvanced ? '▼ Ocultar Opciones Adicionales' : '▶ Ver Opciones Adicionales (IP, Rutas, Notas)'}
                    </button>
                </div>

                {showAdvanced && (
                    <div className="advanced-fields" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label className="label">IP de Servidor (Opcional)</label>
                            <input name="ip_servidor" value={formData.ip_servidor} onChange={handleChange} placeholder="Ej: 10.0.0.5" className="input-field" />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label className="label">Ruta Almacenamiento (Opcional)</label>
                            <input name="ruta_almacenamiento" value={formData.ruta_almacenamiento} onChange={handleChange} placeholder="Ej: /var/www/html/proyecto" className="input-field" />
                        </div>
                        <div className="input-group">
                            <label className="label">Notas Adicionales</label>
                            <textarea
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                placeholder="Instrucciones especiales, puertos, etc..."
                                className="input-field"
                                rows="3"
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>
                )}


                {/* Selector de Organización para TODOS (si tienen orgs o es superadmin) */}
                {(orgs.length > 0 || user?.rol === 'superadmin') && (
                    <div className="org-selector" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <label className="label" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--accent-color)' }}>
                            {user.rol === 'superadmin' ? 'Asignar a Organización (SuperAdmin)' : 'Guardar en Organización'}
                        </label>
                        <select name="id_organizacion" value={formData.id_organizacion} onChange={handleChange} className="input-field" style={{ width: '100%' }}>
                            <option value="">-- Personal (Solo yo) --</option>
                            {orgs.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                        </select>
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    {initialData ? 'Actualizar Credencial' : 'Guardar Credencial'}
                </button>
                {initialData && (
                    <button type="button" onClick={onCancel} className="btn-text" style={{ width: '100%', marginTop: '0.5rem', color: '#f87171' }}>
                        Cancelar Edición
                    </button>
                )}
            </form>

            <style>{`
        .form-container {
          background-color: var(--card-bg);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: var(--radius-lg);
          border: var(--glass-border);
          max-width: 600px;
          margin: 0 auto 3rem auto;
          box-shadow: var(--shadow-lg);
        }
        .form-title { margin-bottom: 1.5rem; text-align: center; color: var(--text-primary); }
        .form-grid { display: grid; gap: 0.5rem; }
        @media (min-width: 640px) { .form-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; } }
        .checkbox-group { margin-top: 1rem; margin-bottom: 0.5rem; }
        .btn-text { background: none; border: none; cursor: pointer; padding: 0; }
        .btn-text:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
};

export default CredentialForm;
