// frontend/src/components/Sidebar.jsx
import React from 'react';
import Swal from 'sweetalert2';

const Sidebar = ({ currentView, onChangeView, user, onLogout, isMobileOpen, toggleMobile }) => {
    const menuItems = [
        { id: 'list', label: 'Mis Credenciales', icon: '🔑' },
        { id: 'create', label: 'Nueva Credencial', icon: '➕' },
    ];

    if (user.rol === 'superadmin') {
        menuItems.push({ id: 'admin', label: 'Administración', icon: '⚙️' });
    }

    return (
        <>
            {/* Overlay para cerrar en móvil */}
            <div
                className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
                onClick={toggleMobile}
            ></div>

            <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="logo">🔐 Gestor</h2>
                    <div className="user-info">
                        <p className="user-name">{user.nombre}</p>
                        <span className="user-role">{user.rol}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => {
                                onChangeView(item.id);
                                if (window.innerWidth < 768) toggleMobile();
                            }}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout" onClick={() => {
                        Swal.fire({
                            title: '¿Cerrar Sesión?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, salir',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                onLogout();
                            }
                        });
                    }}>
                        <span className="icon">🚪</span>
                        <span className="label">Cerrar Sesión</span>
                    </button>
                </div>

                <style>{`
                .sidebar {
                    width: 260px;
                    height: 100vh;
                    background: rgba(17, 24, 39, 0.95);
                    backdrop-filter: blur(10px);
                    border-right: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                    transition: transform 0.3s ease;
                }
                
                /* Mobile styles */
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                    .sidebar-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.5);
                        z-index: 999;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s;
                    }
                    .sidebar-overlay.open {
                        opacity: 1;
                        pointer-events: auto;
                    }
                }

                .sidebar-header {
                    padding: 2rem 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .logo { margin: 0 0 1rem 0; font-size: 1.5rem; color: var(--accent-color); }
                .user-info { font-size: 0.9rem; }
                .user-name { margin: 0; font-weight: bold; color: white; }
                .user-role { font-size: 0.8rem; color: var(--text-secondary); text-transform: capitalize; }

                .sidebar-nav {
                    padding: 1.5rem 1rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: none;
                    background: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    border-radius: 8px;
                    text-align: left;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .nav-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .nav-item.active {
                    background: var(--accent-color);
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.4);
                }
                .nav-item .icon { margin-right: 0.8rem; font-size: 1.2rem; }
                
                .sidebar-footer {
                    padding: 1.5rem 1rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .nav-item.logout:hover {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                }
            `}</style>
            </aside>
        </>
    );
};

export default Sidebar;
