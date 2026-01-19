// frontend/src/components/ScopeSelector.jsx
import React, { useEffect, useState } from 'react';
import { getUserOrgs } from '../services/api';

const ScopeSelector = ({ onSelectScope, user }) => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrgs() {
            try {
                const data = await getUserOrgs();
                setOrgs(data);
            } catch (error) {
                console.error("Error loading orgs", error);
            } finally {
                setLoading(false);
            }
        }
        loadOrgs();
    }, []);

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
                </div>

                {/* Org Cards */}
                {orgs.map(org => (
                    <div key={org.id} className="scope-card org" onClick={() => onSelectScope({ type: 'org', id: org.id, name: org.nombre })}>
                        <div className="icon">🏢</div>
                        <h3>{org.nombre}</h3>
                        <p>{org.descripcion || 'Espacio de trabajo compartido'}</p>
                    </div>
                ))}
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
                .scope-card .icon { font-size: 3rem; margin-bottom: 1rem; }
                .scope-card h3 { margin: 0.5rem 0; font-size: 1.5rem; color: var(--text-primary); }
                .scope-card p { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
                
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
