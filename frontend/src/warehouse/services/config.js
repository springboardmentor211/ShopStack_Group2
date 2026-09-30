const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const USE_MOCK = env.VITE_USE_MOCK !== 'false';
export const API_BASE_URL = env.VITE_API_BASE_URL || '';
