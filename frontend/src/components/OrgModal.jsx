// frontend/src/components/OrgModal.jsx
import React, { useState, useEffect } from 'react';

const OrgModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setNombre(initialData.nombre);
                setDescripcion(initialData.descripcion || '');
            } else {
                setNombre('');
                setDescripcion('');
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: initialData?.id, nombre, descripcion });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Editar Organización' : 'Nueva Organización'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                        <input
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="input-field"
                            required
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            className="input-field"
                            rows="3"
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px' }}
                        />
                    </div>

                    <div className="modal-footer" style={{ textAlign: 'right' }}>
                        <button type="button" onClick={onClose} style={{ marginRight: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                    </div>
                </form>
            </div>
            <style>{`
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; }
                .modal-content { background: #1e293b; width: 90%; max-width: 400px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                .modal-header { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
                .modal-body { padding: 1.5rem; }
            `}</style>
        </div>
    );
};

export default OrgModal;
