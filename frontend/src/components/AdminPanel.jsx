// frontend/src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../services/api';
import Swal from 'sweetalert2';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'orgs'
    const [users, setUsers] = useState([]);
    const [orgs, setOrgs] = useState([]);

    // USER FORM STATE
    const initialUserState = { id: null, nombre: '', email: '', password: '', rol: 'usuario', limite: 100, id_organizacion: '' };
    const [userForm, setUserForm] = useState(initialUserState);
    const [isEditingUser, setIsEditingUser] = useState(false);

    // ORG FORM STATE
    const initialOrgState = { id: null, nombre: '', descripcion: '' };
    const [orgForm, setOrgForm] = useState(initialOrgState);
    const [isEditingOrg, setIsEditingOrg] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const u = await getUsers();
        setUsers(u);
        const o = await getOrganizations();
        setOrgs(o);
    };

    /* --- HANDLERS USUARIOS --- */
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingUser) {
                await updateUser(userForm);
                Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success');
            } else {
                await createUser(userForm);
                Swal.fire('Creado', 'Usuario creado correctamente', 'success');
            }
            resetUserForm();
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    const handleEditUser = (user) => {
        // Cargar datos en el form
        setUserForm({
            id: user.id,
            nombre: user.nombre_completo,
            email: user.email,
            password: '', // No cargamos la pass original
            rol: user.rol,
            limite: user.limite_credenciales,
            id_organizacion: user.id_organizacion || ''
        });
        setIsEditingUser(true);
        window.scrollTo(0, 0); // Subir para ver el form
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "Se borrarán todas sus credenciales.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
                fetchData();
            } catch (err) { Swal.fire('Error', err.message, 'error'); }
        }
    };

    const resetUserForm = () => {
        setUserForm(initialUserState);
        setIsEditingUser(false);
    };


    /* --- HANDLERS ORGANIZACIONES --- */
    const handleOrgSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingOrg) {
                await updateOrganization(orgForm);
                Swal.fire('Actualizado', 'Organización actualizada', 'success');
            } else {
                await createOrganization(orgForm);
                Swal.fire('Creado', 'Organización creada', 'success');
            }
            resetOrgForm();
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    const handleEditOrg = (org) => {
        setOrgForm(org);
        setIsEditingOrg(true);
    };

    const handleDeleteOrg = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar Organización?',
            text: "Los usuarios asignados quedarán sin organización.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await deleteOrganization(id);
                Swal.fire('Eliminado', 'Organización eliminada.', 'success');
                fetchData();
            } catch (err) { Swal.fire('Error', err.message, 'error'); }
        }
    };

    const resetOrgForm = () => {
        setOrgForm(initialOrgState);
        setIsEditingOrg(false);
    };


    return (
        <div className="admin-panel">
            <h2 style={{ marginTop: 0 }}>Panel de Administración</h2>

            <div className="tabs">
                <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Usuarios</button>
                <button className={`tab ${activeTab === 'orgs' ? 'active' : ''}`} onClick={() => setActiveTab('orgs')}>Organizaciones</button>
            </div>

            <div className="tab-content">
                {/* --- USERS TAB --- */
                    activeTab === 'users' && (
                        <div>
                            <div className="form-header">
                                <h3>{isEditingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                                {isEditingUser && <button onClick={resetUserForm} className="btn-text">Cancelar Edición</button>}
                            </div>

                            <form onSubmit={handleUserSubmit} className="admin-form">
                                <input placeholder="Nombre Completo" value={userForm.nombre} onChange={e => setUserForm({ ...userForm, nombre: e.target.value })} required className="input-field-sm" />
                                <input placeholder="Email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required className="input-field-sm" />
                                <input placeholder={isEditingUser ? "Nueva Contraseña (Opcional)" : "Contraseña"} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={!isEditingUser} className="input-field-sm" />

                                <select value={userForm.rol} onChange={e => setUserForm({ ...userForm, rol: e.target.value })} className="input-field-sm">
                                    <option value="usuario">Usuario</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Límite (-1 = Ilimitado)"
                                    title="-1 para ilimitado"
                                    value={userForm.limite}
                                    onChange={e => setUserForm({ ...userForm, limite: e.target.value })}
                                    className="input-field-sm"
                                />

                                <select value={userForm.id_organizacion} onChange={e => setUserForm({ ...userForm, id_organizacion: e.target.value })} className="input-field-sm">
                                    <option value="">Sin Organización</option>
                                    {orgs.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                                </select>

                                <button type="submit" className={`btn sm ${isEditingUser ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditingUser ? 'Actualizar' : 'Crear'}
                                </button>
                            </form>

                            <h3 style={{ marginTop: '2rem' }}>Directorio de Usuarios</h3>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Límite</th>
                                            <th>Org</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.nombre_completo}</td>
                                                <td>{u.email}</td>
                                                <td>{u.rol}</td>
                                                <td>{u.limite_credenciales == -1 ? '∞' : u.limite_credenciales}</td>
                                                <td>{u.nombre_organizacion || '-'}</td>
                                                <td className="actions-cell">
                                                    <button className="btn-icon-sm edit" onClick={() => handleEditUser(u)} title="Editar">✏️</button>
                                                    <button className="btn-icon-sm delete" onClick={() => handleDeleteUser(u.id)} title="Eliminar">🗑️</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                {/* --- ORGS TAB --- */
                    activeTab === 'orgs' && (
                        <div>
                            <div className="form-header">
                                <h3>{isEditingOrg ? 'Editar Organización' : 'Crear Organización'}</h3>
                                {isEditingOrg && <button onClick={resetOrgForm} className="btn-text">Cancelar</button>}
                            </div>

                            <form onSubmit={handleOrgSubmit} className="admin-form">
                                <input placeholder="Nombre Organización" value={orgForm.nombre} onChange={e => setOrgForm({ ...orgForm, nombre: e.target.value })} required className="input-field-sm" />
                                <input placeholder="Descripción" value={orgForm.descripcion} onChange={e => setOrgForm({ ...orgForm, descripcion: e.target.value })} className="input-field-sm" />
                                <button type="submit" className={`btn sm ${isEditingOrg ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditingOrg ? 'Actualizar' : 'Crear'}
                                </button>
                            </form>

                            <h3 style={{ marginTop: '2rem' }}>Listado de Organizaciones</h3>
                            <ul className="org-list">
                                {orgs.map(o => (
                                    <li key={o.id} className="org-item">
                                        <div className="org-info">
                                            <strong>{o.nombre}</strong>
                                            <span className="org-desc">{o.descripcion}</span>
                                        </div>
                                        <div className="org-actions">
                                            <button className="btn-icon-sm edit" onClick={() => handleEditOrg(o)}>✏️</button>
                                            <button className="btn-icon-sm delete" onClick={() => handleDeleteOrg(o.id)}>🗑️</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </div>

            <style>{`
        .admin-panel {
          background-color: var(--bg-secondary);
          padding: 2rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .tabs { margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .tab { background: none; border: none; color: var(--text-secondary); padding: 1rem 1.5rem; cursor: pointer; font-size: 1rem; font-weight: 600; }
        .tab.active { color: var(--accent-color); border-bottom: 2px solid var(--accent-color); }
        
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .btn-text { background: none; border: none; color: var(--text-secondary); text-decoration: underline; cursor: pointer; }

        .admin-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin-bottom: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-md); }
        .input-field-sm { padding: 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: white; }
        
        .btn.sm { padding: 0.5rem 1rem; }
        .btn-warning { background-color: #f59e0b; color: white; border: none; cursor: pointer; border-radius: 6px; }
        
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .actions-cell { display: flex; gap: 0.5rem; }
        
        .btn-icon-sm { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.7; transition: opacity 0.2s; }
        .btn-icon-sm:hover { opacity: 1; transform: scale(1.1); }
        .btn-icon-sm.delete:hover { transform: scale(1.2); }

        .org-list { list-style: none; }
        .org-item { padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .org-desc { display: block; font-size: 0.85rem; color: var(--text-secondary); }
        .org-actions { display: flex; gap: 0.5rem; }
      `}</style>
        </div>
    );
};

export default AdminPanel;
