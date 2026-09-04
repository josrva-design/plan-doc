export interface BackupEntry {
  id: string;
  fecha: string;
  data: any;
}

const DB_NAME = 'docfitness-backup';
const DB_VERSION = 1;
const STORE_NAME = 'backups';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('fecha', 'fecha', { unique: false });
      }
    };
  });
}

export async function createBackup(data: any): Promise<string> {
  const db = await openDB();
  const id = `backup-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const entry: BackupEntry = {
    id,
    fecha: new Date().toISOString(),
    data,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
  return id;
}

export async function getBackups(): Promise<BackupEntry[]> {
  const db = await openDB();
  const entries = await new Promise<BackupEntry[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return entries.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function restoreBackup(id: string): Promise<any> {
  const db = await openDB();
  const entry = await new Promise<BackupEntry | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return entry?.data || null;
}

export async function deleteBackup(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

export async function clearOldBackups(keepLast: number = 20): Promise<void> {
  const backups = await getBackups();
  if (backups.length > keepLast) {
    const toDelete = backups.slice(keepLast);
    for (const entry of toDelete) {
      await deleteBackup(entry.id);
    }
  }
}
