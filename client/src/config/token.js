const SESSION_KEY_NAME = 'token';

export const setToken = token => sessionStorage.setItem(SESSION_KEY_NAME, token);
export const removeToken = () => sessionStorage.removeItem(SESSION_KEY_NAME);
export const getToken = () => sessionStorage.getItem(SESSION_KEY_NAME);