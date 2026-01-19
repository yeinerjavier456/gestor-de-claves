// frontend/src/components/CredentialTable.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const CredentialTable = ({ credentials, onDelete, currentUser, onEdit }) => { // onEdit para futuro o si queremos editar inline
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCred, setSelectedCred] = useState(null); // Para el Modal

    const itemsPerPage = 10;

    // 1. Filtrar
    const filtered = credentials.filter(c =>
        c.plataforma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Paginar
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
        Toast.fire({ icon: 'success', title: 'Copiado' });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar'
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(id);
                setSelectedCred(null); // Cerrar modal si estaba abierto
            }
        });
    };

    return (
        <div className="table-container fade-in">
            {/* Buscador */}
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="🔍 Buscar credencial..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Tabla */}
            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Plataforma</th>
                            <th>Usuario</th>
                            <th>URL</th>
                            <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map(cred => (
                            <tr key={cred.id}>
                                <td className="font-bold">{cred.plataforma}</td>
                                <td>{cred.usuario}</td>
                                <td>
                                    <a href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`} target="_blank" className="link-truncate">
                                        {cred.url}
                                    </a>
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-icon view" title="Ver Detalles" onClick={() => setSelectedCred(cred)}>👁️</button>
                                    <button className="btn-icon copy" title="Copiar Pass" onClick={() => handleCopy(cred.password)}>📋</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron resultados</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&laquo; Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Siguiente &raquo;</button>
                </div>
            )}

            {/* Modal de Detalle */}
            {selectedCred && (
                <div className="modal-overlay" onClick={() => setSelectedCred(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCred.plataforma}</h2>
                            <button className="close-btn" onClick={() => setSelectedCred(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <DetailRow label="URL" value={selectedCred.url} isLink />
                            <DetailRow label="Usuario" value={selectedCred.usuario} copyable />
                            <DetailRow label="Contraseña" value={selectedCred.password} copyable isPass />

                            {selectedCred.ip_servidor && <DetailRow label="IP Servidor" value={selectedCred.ip_servidor} copyable />}
                            {selectedCred.ruta_almacenamiento && <DetailRow label="Ruta" value={selectedCred.ruta_almacenamiento} copyable />}
                            {selectedCred.notas && <DetailRow label="Notas" value={selectedCred.notas} pre />}

                            <div className="modal-footer">
                                {(selectedCred.owner_id == currentUser.id || currentUser.rol === 'superadmin') && (
                                    <button className="btn-danger" onClick={() => handleDelete(selectedCred.id)}>
                                        🗑️ Eliminar Credencial
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .table-container { margin-top: 1rem; }
                .search-input {
                    width: 100%;
                    max-width: 300px;
                    padding: 0.8rem 1rem;
                    border-radius: var(--radius-md);
                    border: var(--glass-border);
                    background: rgba(0,0,0,0.2);
                    color: white;
                    margin-bottom: 1rem;
                }
                .modern-table { width: 100%; border-collapse: collapse; background: rgba(30, 41, 59, 0.4); border-radius: var(--radius-md); overflow: hidden; }
                .modern-table th { background: rgba(0,0,0,0.3); padding: 1rem; text-align: left; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; }
                .modern-table td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .link-truncate { display: block; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--accent-color); text-decoration: none; }
                
                .actions-cell { text-align: center; white-space: nowrap; }
                .btn-icon { background: none; border: none; font-size: 1.2rem; cursor: pointer; margin: 0 5px; opacity: 0.7; transition: transform 0.2s; }
                .btn-icon:hover { opacity: 1; transform: scale(1.2); }
                .btn-icon.view { color: #60a5fa; }
                .btn-icon.copy { color: #a855f7; }

                .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; }
                .pagination button { background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
                .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Modal Styles */
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; animation: fadeIn 0.2s; }
                .modal-content { background: #1e293b; width: 90%; max-width: 500px; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); overflow: hidden; animation: slideIn 0.3s; }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
                .modal-header h2 { margin: 0; font-size: 1.5rem; color: var(--accent-color); }
                .close-btn { background: none; border: none; font-size: 2rem; color: var(--text-secondary); cursor: pointer; line-height: 1; }
                .modal-body { padding: 2rem; }
                .detail-row { margin-bottom: 1rem; }
                .detail-label { display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.3rem; }
                .detail-value-box { background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; word-break: break-all; }
                .modal-footer { margin-top: 2rem; text-align: right; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
            `}</style>
        </div>
    );
};

const DetailRow = ({ label, value, copyable, isLink, isPass, pre }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Copiado', showConfirmButton: false, timer: 1000 });
    };

    return (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            <div className="detail-value-box">
                {isLink ? <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" style={{ color: '#60a5fa' }}>{value}</a> :
                    pre ? <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{value}</pre> :
                        <span>{isPass ? '••••••••' : value}</span>
                }

                {copyable && (
                    <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px', fontSize: '1.1rem' }}>📋</button>
                )}
            </div>
        </div>
    );
};

export default CredentialTable;
