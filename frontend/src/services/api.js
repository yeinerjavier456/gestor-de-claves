// frontend/src/services/api.js
const API_URL = '/backend/api';

/* AUTH */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login.php`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (e) {
        return { success: false, message: 'Error de conexión' };
    }
};

export const logout = async () => {
    await fetch(`${API_URL}/auth/logout.php`);
};

export const checkAuth = async () => {
    const res = await fetch(`${API_URL}/auth/check.php`);
    return await res.json();
};

/* CREDENTIALS */
// scopeObj opcional: { type: 'personal' } o { type: 'org', id: 123 }
export const getCredentials = async (scopeObj = null) => {
    let url = `${API_URL}/read.php`;
    if (scopeObj) {
        const params = new URLSearchParams();
        if (scopeObj.type === 'personal') {
            params.append('scope', 'personal');
        } else if (scopeObj.type === 'org') {
            params.append('scope', 'org');
            params.append('org_id', scopeObj.id);
        }
        url += `?${params.toString()}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar credenciales');
    return await res.json();
};

export const createCredential = async (data) => {
    const res = await fetch(`${API_URL}/create.php`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

export const deleteCredential = async (id) => {
    const res = await fetch(`${API_URL}/delete.php`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

/* USERS */
export const getUserOrgs = async () => {
    const res = await fetch(`${API_URL}/users/get_orgs.php`);
    if (!res.ok) throw new Error('Error buscando organizaciones');
    return await res.json();
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users/list.php`);
    if (!res.ok) throw new Error('Error al cargar usuarios');
    return await res.json();
};

export const createUser = async (userData) => {
    const res = await fetch(`${API_URL}/users/create.php`, {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

export const updateUser = async (userData) => {
    const res = await fetch(`${API_URL}/users/update.php`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

export const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/users/delete.php`, {
        method: 'DELETE',
        body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

/* ORGANIZATIONS */
export const getOrganizations = async () => {
    const res = await fetch(`${API_URL}/organizations/list.php`);
    if (!res.ok) throw new Error('Error al cargar organizaciones');
    return await res.json();
};

export const createOrganization = async (orgData) => {
    const res = await fetch(`${API_URL}/organizations/create.php`, {
        method: 'POST',
        body: JSON.stringify(orgData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

export const updateOrganization = async (orgData) => {
    const res = await fetch(`${API_URL}/organizations/manage.php`, {
        method: 'PUT',
        body: JSON.stringify(orgData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};

export const deleteOrganization = async (id) => {
    const res = await fetch(`${API_URL}/organizations/manage.php`, {
        method: 'DELETE',
        body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json;
};
