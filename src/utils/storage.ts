export function safeSet(key: string, value: any): boolean {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, v);
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeSet failed for key', key, e);
    return false;
  }
}

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeGet failed for key', key, e);
    return null;
  }
}

export function safeGetJSON<T = any>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeGetJSON failed for key', key, e);
    return null;
  }
}

export function safeRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeRemove failed for key', key, e);
    return false;
  }
}
