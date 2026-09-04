import { listen } from '@tauri-apps/api/event';
import { check, type Update, type DownloadEvent } from '@tauri-apps/plugin-updater';

export type UpdaterStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'installing' | 'uptodate' | 'error';

export interface UpdateInfo {
  version: string;
  notes?: string;
  pubDate?: string;
}

export interface UpdaterState {
  status: UpdaterStatus;
  update: UpdateInfo | null;
  progress: number | null;
  error: string | null;
}

export function createAutoUpdater() {
  let onStatusChange: ((state: UpdaterState) => void) | undefined;

  const notify = (patch: Partial<UpdaterState>) => {
    if (onStatusChange) {
      onStatusChange((prev) => ({ ...prev, ...patch }));
    }
  };

  const checkForUpdates = async () => {
    notify({ status: 'checking', error: null, progress: null, update: null });
    try {
      const update = await check();
      if (update) {
        notify({
          status: 'available',
          update: {
            version: update.version,
            notes: update.body ?? undefined,
            pubDate: update.date ?? undefined,
          },
        });
        return update;
      }
      notify({ status: 'uptodate' });
      return null;
    } catch (error) {
      notify({ status: 'error', error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  const downloadAndInstall = async (update: Update) => {
    notify({ status: 'downloading', error: null, progress: 0 });
    try {
      await update.downloadAndInstall(
        (event: DownloadEvent) => {
          if (event.event === 'Progress') {
            notify({ status: 'downloading' });
          } else if (event.event === 'Finished') {
            notify({ status: 'installing', progress: 100 });
          }
        }
      );
    } catch (error) {
      notify({ status: 'error', error: error instanceof Error ? error.message : String(error) });
    }
  };

  return {
    check: checkForUpdates,
    downloadAndInstall,
    onChange: (fn: (state: UpdaterState) => void) => {
      onStatusChange = fn;
    },
  };
}
