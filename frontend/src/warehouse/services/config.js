const mockFlag = import.meta.env.VITE_USE_MOCK;
export const USE_MOCK = mockFlag === undefined ? true : mockFlag === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '');