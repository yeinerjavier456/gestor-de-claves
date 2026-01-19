// frontend/src/components/ScopeSelector.jsx
import React, { useEffect, useState } from 'react';
import { getUserOrgs } from '../services/api';

const ScopeSelector = ({ onSelectScope, user, onCreateOrg, onEditOrg, onDeleteOrg, onCreateCredential }) => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrgs = async () => {
        try {
            const data = await getUserOrgs();
            setOrgs(data);
        } catch (error) {
            console.error("Error loading orgs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrgs();
    }, []); // Cargar al inicio y cuando cambie algo (podríamos exponer loadOrgs)


    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando organizaciones...</div>;

    return (
        <div className="scope-container">
            <h2 className="title-center">Selecciona un Espacio de Trabajo</h2>
            <div className="scope-grid">
                {/* Personal Card */}
                <div className="scope-card personal" onClick={() => onSelectScope({ type: 'personal' })}>
                    <div className="icon">👤</div>
                    <h3>Personal</h3>
                    <p>Mis credenciales privadas</p>
                    <button className="btn-quick-create" onClick={(e) => { e.stopPropagation(); onCreateCredential({ type: 'personal' }); }}>
                        + Crear
                    </button>
                </div>

                {/* Org Cards */}
                {orgs.map(org => (
                    <div key={org.id} className="scope-card org" onClick={() => onSelectScope({ type: 'org', id: org.id, name: org.nombre })}>
                        <div className="icon">🏢</div>
                        <h3>{org.nombre}</h3>
                        <p>{org.descripcion || 'Espacio de trabajo compartido'}</p>

                        <button className="btn-quick-create" onClick={(e) => {
                            e.stopPropagation();
                            onCreateCredential({ type: 'org', id: org.id, name: org.nombre });
                        }}>
                            + Crear
                        </button>

                        {(org.id_creador == user.id || user.rol === 'superadmin') && (
                            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => onEditOrg(org)} className="btn-icon-xs">✏️</button>
                                <button onClick={() => onDeleteOrg(org.id)} className="btn-icon-xs danger">🗑️</button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Create Org Card */}
                <div className="scope-card create-new" onClick={onCreateOrg}>
                    <div className="icon">➕</div>
                    <h3>Nueva Organización</h3>
                    <p>Crear espacio de trabajo</p>
                </div>
            </div>

            <style>{`
                .title-center { text-align: center; margin-bottom: 2rem; color: var(--text-primary); }
                .scope-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    padding: 1rem;
                }
                .scope-card {
                    background: var(--card-bg);
                    border: var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .scope-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);
                    border-color: var(--accent-color);
                }
                .scope-card.create-new {
                    border-style: dashed;
                    background: rgba(255,255,255,0.05);
                }
                .scope-card.create-new:hover {
                     border-color: #34d399;
                     color: #34d399;
                }

                .scope-card .icon { font-size: 3rem; margin-bottom: 1rem; }
                .scope-card h3 { margin: 0.5rem 0; font-size: 1.5rem; color: var(--text-primary); }
                .scope-card p { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
                
                .card-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 5px;
                }
                .btn-icon-xs {
                    background: rgba(0,0,0,0.5);
                    border: none;
                    color: white;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.8rem;
                    transition: transform 0.2s;
                }
                .btn-icon-xs:hover { transform: scale(1.1); background: var(--accent-color); }
                .btn-icon-xs.danger:hover { background: #ef4444; }

                .btn-quick-create {
                    margin-top: 1rem;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }
                .btn-quick-create:hover {
                    background: var(--accent-color);
                    border-color: var(--accent-color);
                }

                .scope-card.personal::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(to right, #34d399, #10b981);
                }
                .scope-card.org::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(to right, #60a5fa, #3b82f6);
                }
            `}</style>
        </div>
    );
};

export default ScopeSelector;
