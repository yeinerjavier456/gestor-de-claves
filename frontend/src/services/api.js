// frontend/src/services/api.js

const API_URL = '/backend/api';

/* --- CREDENCIALES --- */

export const getCredentials = async () => {
    try {
        const response = await fetch(`${API_URL}/read.php`);
        if (!response.ok) throw new Error('Error al obtener credenciales');
        const data = await response.json();
        return data.records || [];
    } catch (error) {
        console.error("Error getCredentials:", error);
        return [];
    }
};

export const createCredential = async (credential) => {
    try {
        const response = await fetch(`${API_URL}/create.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al crear credencial');
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteCredential = async (id) => {
    try {
        const response = await fetch(`${API_URL}/delete.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error('Error al eliminar credencial');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

/* --- USUARIOS (ADMIN) --- */

export const getUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users/list.php`);
        if (!response.ok) throw new Error('Error al listar usuarios');
        const data = await response.json();
        return data.records || [];
    } catch (error) {
        return [];
    }
};

export const createUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}/users/create.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al crear');
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}/users/update.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al actualizar');
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/users/delete.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al eliminar');
        return data;
    } catch (error) {
        throw error;
    }
};

/* --- ORGANIZACIONES (ADMIN) --- */

export const getOrganizations = async () => {
    try {
        const response = await fetch(`${API_URL}/organizations/manage.php`);
        if (!response.ok) throw new Error('Error al listar organizaciones');
        const data = await response.json();
        return data.records || [];
    } catch (error) {
        return [];
    }
};

export const createOrganization = async (org) => {
    try {
        const response = await fetch(`${API_URL}/organizations/manage.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(org),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateOrganization = async (org) => {
    try {
        // Usamos POST pero el backend espera el método HTTP o un campo hidden?
        // manage.php usa $_SERVER['REQUEST_METHOD'].
        // Fetch API 'PUT' funciona si el servidor lo acepta.
        // Pero en PHP puro a veces PUT payload no se lee con file_get_contents si no es x-www-form-urlencoded o raw.
        // Hemos programado manage.php para leer php://input, asi que PUT JSON deberia funcionar.
        const response = await fetch(`${API_URL}/organizations/manage.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(org),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteOrganization = async (id) => {
    try {
        const response = await fetch(`${API_URL}/organizations/manage.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        throw error;
    }
};
