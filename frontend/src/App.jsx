import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CredentialForm from './components/CredentialForm';
import CredentialList from './components/CredentialList';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import Sidebar from './components/Sidebar';
import { getCredentials, createCredential, deleteCredential } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Contenido Principal (Dashboard)
 * Gestiona layout y vistas
 */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'admin'
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle

  useEffect(() => {
    // Cargar credenciales al inicio solo si vamos a listar
    if (currentView === 'list') fetchCredentials();
  }, [currentView]);

  const fetchCredentials = async () => {
    setLoading(true);
    const data = await getCredentials();
    setCredentials(data);
    setLoading(false);
  };

  const handleAddCredential = async (newCredential) => {
    try {
      await createCredential(newCredential);
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'Credencial guardada correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      setCurrentView('list'); // Volver a la lista después de crear
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Error al crear la credencial: " + (error.message || "Desconocido")
      });
    }
  };

  const handleDeleteCredential = async (id) => {
    try {
      await deleteCredential(id);
      setCredentials(credentials.filter(c => c.id !== id));
      Swal.fire('Eliminado', 'La credencial ha sido eliminada.', 'success');
    } catch (error) {
      Swal.fire('Error', "Error al eliminar: " + (error.message || "No autorizado"), 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        user={user}
        onLogout={logout}
        isMobileOpen={sidebarOpen}
        toggleMobile={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Header Toggle */}
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="mobile-title">Gestor de Credenciales</h1>
        </div>

        {/* View Container */}
        <div className="view-container">
          {currentView === 'list' && (
            <>
              <div className="view-header">
                <h2>Mis Credenciales</h2>
                <div className="stats-badge">
                  Uso: {credentials.filter(c => c.owner_id === user.id).length} / {user.limite_credenciales === -1 ? '∞' : user.limite_credenciales}
                </div>
              </div>
              {loading ? <p>Cargando...</p> : (
                <CredentialList
                  credentials={credentials}
                  onDelete={handleDeleteCredential}
                  currentUserId={user.id}
                />
              )}
            </>
          )}

          {currentView === 'create' && (
            <>
              <div className="view-header">
                <h2>Nueva Credencial</h2>
              </div>
              <CredentialForm onAdd={handleAddCredential} userHasOrg={!!user.id_organizacion} />
            </>
          )}

          {currentView === 'admin' && user.rol === 'superadmin' && (
            <AdminPanel />
          )}
        </div>
      </div>

      <style>{`
            .app-layout {
                display: flex;
                min-height: 100vh;
            }
            .main-content {
                flex: 1;
                margin-left: 260px; /* Sidebar width */
                padding: 2rem;
                transition: margin 0.3s ease;
            }
            .mobile-header { display: none; }

            .view-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            .view-header h2 { margin: 0; font-size: 2rem; color: var(--text-primary); }
            .stats-badge {
                 background: rgba(255,255,255,0.1); 
                 padding: 0.5rem 1rem; 
                 border-radius: 20px; 
                 font-size: 0.9rem;
                 border: 1px solid rgba(255,255,255,0.1);
            }

            @media (max-width: 768px) {
                .main-content {
                    margin-left: 0;
                    padding: 1rem;
                }
                .mobile-header {
                    display: flex;
                    align-items: center;
                    padding: 1rem 0;
                    margin-bottom: 1.5rem;
                }
                .menu-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-right: 1rem;
                }
                .mobile-title {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .view-header h2 { font-size: 1.5rem; }
            }
        `}</style>
    </div>
  );
};

/**
 * Componente Raíz
 */
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  return user ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
