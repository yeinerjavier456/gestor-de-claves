import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CredentialForm from './components/CredentialForm';
import CredentialTable from './components/CredentialTable';
import ScopeSelector from './components/ScopeSelector';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import Sidebar from './components/Sidebar';
import OrgModal from './components/OrgModal'; // Importar Modal
import {
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
  createOrganization,
  updateOrganization,
  deleteOrganization
} from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Contenido Principal (Dashboard)
 * Gestiona layout y vistas
 */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'admin'
  const [scope, setScope] = useState(null); // null (selector), { type: 'personal' }, { type: 'org', id: X }
  const [editingCredential, setEditingCredential] = useState(null); // Credencial siendo editada
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  useEffect(() => {
    // Cargar credenciales SOLO si tenemos un scope definido y estamos en vista lista
    if (currentView === 'list' && scope) {
      fetchCredentials();
    }
  }, [currentView, scope]); // Recargar si cambia la vista o el scope

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const data = await getCredentials(scope);
      setCredentials(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleScopeSelect = (selectedScope) => {
    setScope(selectedScope);
    // fetchCredentials se disparará por el useEffect
  };

  const handleChangeView = (viewId) => {
    setCurrentView(viewId);
    if (viewId === 'list') {
      setEditingCredential(null);
      setScope(null);
    }
    if (viewId === 'create' && currentView !== 'create') {
      setEditingCredential(null);
    }
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
      fetchCredentials(); // recargar
      handleChangeView('list');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Error al crear la credencial: " + (error.message || "Desconocido")
      });
    }
  };

  const handleUpdateCredential = async (updatedCredential) => {
    try {
      await updateCredential(updatedCredential);
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Credencial modificada exitosamente',
        timer: 1500,
        showConfirmButton: false
      });
      setEditingCredential(null);
      // Actualizar lista local o refetch
      setCredentials(prev => prev.map(c => c.id === updatedCredential.id ? { ...c, ...updatedCredential } : c));
      fetchCredentials();
      handleChangeView('list');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleStartEdit = (credential) => {
    setEditingCredential(credential);
    setCurrentView('create');
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

  /* ----- ORGANIZATIONS LOGIC ----- */
  const handleOpenCreateOrg = () => {
    setEditingOrg(null);
    setShowOrgModal(true);
  };
  const handleOpenEditOrg = (org) => {
    setEditingOrg(org);
    setShowOrgModal(true);
  };
  const handleSaveOrg = async (orgData) => {
    try {
      if (orgData.id) {
        await updateOrganization(orgData);
        Swal.fire('Actualizado', 'Organización actualizada', 'success');
      } else {
        await createOrganization(orgData);
        Swal.fire('Creado', 'Organización creada exitosamente', 'success');
      }
      setShowOrgModal(false);
      // Forzar recarga de orgs en ScopeSelector. 
      // Truco: cambiar currentView momentáneamente o usar key en ScopeSelector
      handleChangeView('list'); // Esto debería remontar ScopeSelector si estamos ahí
      setScope(null); // Asegura refresco
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };
  const handleDeleteOrg = async (id) => {
    Swal.fire({
      title: '¿Eliminar Organización?',
      text: "Se borrará permanentemente. ¡Cuidado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrganization(id);
          Swal.fire('Eliminado', 'La organización ha sido eliminada.', 'success');
          setScope(null);
          handleChangeView('list'); // Refrescar
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  };

  const handleQuickCreateCredential = (scopeObj) => {
    setScope(scopeObj);
    setEditingCredential(null);
    setCurrentView('create');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onChangeView={handleChangeView}
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
                {/* Si no hay scope, título genérico. Si hay, título del scope + botón volver */}
                {!scope ? (
                  <h2>Mis Espacios</h2>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-icon-back" onClick={() => setScope(null)}>⬅ Volver</button>
                    <div>
                      <h2 style={{ margin: 0 }}>{scope.type === 'personal' ? 'Mis Credenciales' : scope.name}</h2>
                      <span className="subtitle-scope">{scope.type === 'personal' ? 'Privado' : 'Organización'}</span>
                    </div>
                  </div>
                )}

                {scope && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn-primary-sm" onClick={() => handleQuickCreateCredential(scope)}>+ Nueva Credencial</button>
                    <div className="stats-badge">
                      {credentials.length} Registros
                    </div>
                  </div>
                )}
              </div>

              {loading ? <p>Cargando...</p> : (
                <>
                  {!scope ? (
                    <ScopeSelector
                      onSelectScope={handleScopeSelect}
                      user={user}
                      onCreateOrg={handleOpenCreateOrg}
                      onEditOrg={handleOpenEditOrg}
                      onDeleteOrg={handleDeleteOrg}
                      onCreateCredential={handleQuickCreateCredential}
                    />
                  ) : (
                    <CredentialTable
                      credentials={credentials}
                      onDelete={handleDeleteCredential}
                      currentUser={user}
                      onEdit={handleStartEdit}
                    />
                  )}
                </>
              )}
            </>
          )}

          {currentView === 'create' && (
            <>
              <div className="view-header">
                <h2>{editingCredential ? 'Editar Credencial' : 'Nueva Credencial'}</h2>
              </div>
              <CredentialForm
                onAdd={handleAddCredential}
                onUpdate={handleUpdateCredential}
                userHasOrg={!!user.id_organizacion || (scope?.type === 'org')}
                initialData={editingCredential}
                onCancel={() => handleChangeView('list')}
                defaultOrgId={scope?.type === 'org' ? scope.id : ''}
              />
            </>
          )}

          {currentView === 'admin' && user.rol === 'superadmin' && (
            <AdminPanel />
          )}
        </div>
      </div>

      {/* Org Modal */}
      <OrgModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        onSave={handleSaveOrg}
        initialData={editingOrg}
      />

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
            .subtitle-scope { font-size: 0.9rem; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px; }
            .btn-icon-back { background: none; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
            .btn-icon-back:hover { background: rgba(255,255,255,0.1); }
            .stats-badge {
                 background: rgba(255,255,255,0.1); 
                 padding: 0.5rem 1rem; 
                 border-radius: 20px; 
                 font-size: 0.9rem;
                 border: 1px solid rgba(255,255,255,0.1);
            }
            .btn-primary-sm {
                  background: var(--accent-color);
                  border: none;
                  color: var(--bg-dark);
                  padding: 0.5rem 1rem;
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: bold;
                  transition: filter 0.2s;
            }
            .btn-primary-sm:hover { filter: brightness(1.2); }

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
