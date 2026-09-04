import { invoke } from '@tauri-apps/api/core';

export async function saveToFile(path: string, data: unknown): Promise<void> {
  const payload = JSON.stringify(data);
  await invoke('save_data', { path, data: payload });
}

export async function loadFromFile<T = unknown>(path: string): Promise<T | null> {
  try {
    const data = await invoke<string>('load_data', { path });
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}
