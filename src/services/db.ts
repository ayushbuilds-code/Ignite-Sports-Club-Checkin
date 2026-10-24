import { Team, ActivityLog, TournamentSettings } from '../types';
import { INITIAL_SAMPLE_TEAMS, INITIAL_SAMPLE_ACTIVITY, INITIAL_TOURNAMENT_SETTINGS } from './sampleData';

const DB_NAME = 'IgniteTournament_FreeFire_Dummy_2026';
const DB_VERSION = 1;

// Clean up old databases if exists
try {
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    window.indexedDB.deleteDatabase('IgniteEsportsCheckIn_DB');
    window.indexedDB.deleteDatabase('IgniteTournament_FreeFire_Official_2026');
  }
} catch {
  // Ignore
}

const STORES = {
  TEAMS: 'teams',
  ACTIVITY: 'activity_logs',
  SETTINGS: 'tournament_settings',
} as const;

class TournamentDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported by your browser environment.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.TEAMS)) {
          db.createObjectStore(STORES.TEAMS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.ACTIVITY)) {
          const actStore = db.createObjectStore(STORES.ACTIVITY, { keyPath: 'id' });
          actStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB database'));
      };
    });

    return this.dbPromise;
  }

  // Initialize and seed if empty or old data
  async initialize(): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction([STORES.TEAMS, STORES.SETTINGS, STORES.ACTIVITY], 'readwrite');
    const teamsStore = tx.objectStore(STORES.TEAMS);
    const settingsStore = tx.objectStore(STORES.SETTINGS);
    const activityStore = tx.objectStore(STORES.ACTIVITY);

    const checkReq = teamsStore.get('IGN-01');
    checkReq.onsuccess = () => {
      const existing = checkReq.result as Team | undefined;
      // If store is empty or has old data (VOID REAPERS, Total Gaming, etc.), reseed with dummy data
      if (!existing || existing.name === 'Total Gaming Esports' || existing.name === 'VOID REAPERS' || existing.name !== 'PHOENIX ESPORTS') {
        teamsStore.clear();
        activityStore.clear();
        for (const team of INITIAL_SAMPLE_TEAMS) {
          teamsStore.put(team);
        }
        for (const act of INITIAL_SAMPLE_ACTIVITY) {
          activityStore.put(act);
        }
        settingsStore.put(INITIAL_TOURNAMENT_SETTINGS);
      }
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- TEAMS ---
  async getAllTeams(): Promise<Team[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.TEAMS, 'readonly');
      const store = tx.objectStore(STORES.TEAMS);
      const request = store.getAll();

      request.onsuccess = () => {
        const teams = (request.result as Team[]) || [];
        // Sort by slot number by default
        teams.sort((a, b) => a.slotNumber - b.slotNumber);
        resolve(teams);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.TEAMS, 'readonly');
      const store = tx.objectStore(STORES.TEAMS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result as Team | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  async saveTeam(team: Team): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.TEAMS, 'readwrite');
      const store = tx.objectStore(STORES.TEAMS);
      store.put(team);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteTeam(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.TEAMS, 'readwrite');
      const store = tx.objectStore(STORES.TEAMS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async bulkSaveTeams(teams: Team[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.TEAMS, 'readwrite');
      const store = tx.objectStore(STORES.TEAMS);
      for (const t of teams) {
        store.put(t);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- ACTIVITY LOGS ---
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ACTIVITY, 'readonly');
      const store = tx.objectStore(STORES.ACTIVITY);
      const req = store.getAll();
      req.onsuccess = () => {
        const logs = (req.result as ActivityLog[]) || [];
        // Sort descending by timestamp
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(logs);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async addActivityLog(log: ActivityLog): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ACTIVITY, 'readwrite');
      const store = tx.objectStore(STORES.ACTIVITY);
      store.put(log);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- TOURNAMENT SETTINGS ---
  async getSettings(): Promise<TournamentSettings> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.get('tournament_config');
      req.onsuccess = () => {
        resolve(req.result || INITIAL_TOURNAMENT_SETTINGS);
      };
      req.onerror = () => {
        resolve(INITIAL_TOURNAMENT_SETTINGS);
      };
    });
  }

  async saveSettings(settings: TournamentSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      store.put({ ...settings, id: 'tournament_config' });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- DEMO RESET ---
  async resetToDemoData(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.TEAMS, STORES.SETTINGS, STORES.ACTIVITY], 'readwrite');
      const tStore = tx.objectStore(STORES.TEAMS);
      const aStore = tx.objectStore(STORES.ACTIVITY);
      const sStore = tx.objectStore(STORES.SETTINGS);

      tStore.clear();
      aStore.clear();
      sStore.clear();

      for (const team of INITIAL_SAMPLE_TEAMS) {
        tStore.put(team);
      }
      for (const act of INITIAL_SAMPLE_ACTIVITY) {
        aStore.put(act);
      }
      sStore.put(INITIAL_TOURNAMENT_SETTINGS);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- BACKUP & RESTORE ---
  async exportFullBackup(): Promise<{
    version: number;
    exportedAt: string;
    tournament: TournamentSettings;
    teams: Team[];
    activityLogs: ActivityLog[];
  }> {
    const [teams, logs, settings] = await Promise.all([
      this.getAllTeams(),
      this.getAllActivityLogs(),
      this.getSettings(),
    ]);

    return {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      tournament: settings,
      teams,
      activityLogs: logs,
    };
  }

  async restoreFullBackup(data: {
    tournament?: TournamentSettings;
    teams?: Team[];
    activityLogs?: ActivityLog[];
  }): Promise<{ teamsCount: number; logsCount: number }> {
    if (!data || !Array.isArray(data.teams)) {
      throw new Error('Invalid backup file: missing teams array.');
    }

    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.TEAMS, STORES.SETTINGS, STORES.ACTIVITY], 'readwrite');
      const tStore = tx.objectStore(STORES.TEAMS);
      const aStore = tx.objectStore(STORES.ACTIVITY);
      const sStore = tx.objectStore(STORES.SETTINGS);

      tStore.clear();
      if (data.activityLogs) aStore.clear();

      for (const t of data.teams!) {
        tStore.put(t);
      }

      if (data.activityLogs && Array.isArray(data.activityLogs)) {
        for (const log of data.activityLogs) {
          aStore.put(log);
        }
      }

      if (data.tournament) {
        sStore.put({ ...data.tournament, id: 'tournament_config' });
      }

      tx.oncomplete = () =>
        resolve({
          teamsCount: data.teams!.length,
          logsCount: data.activityLogs ? data.activityLogs.length : 0,
        });
      tx.onerror = () => reject(tx.error);
    });
  }

  async getStorageEstimate(): Promise<{ usageMB: string; quotaMB: string; percentUsed: number }> {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        const usageMB = ((est.usage || 0) / (1024 * 1024)).toFixed(2);
        const quotaMB = ((est.quota || 0) / (1024 * 1024)).toFixed(1);
        const percentUsed = est.quota ? Math.round(((est.usage || 0) / est.quota) * 100) : 0;
        return { usageMB, quotaMB, percentUsed };
      } catch {
        return { usageMB: '0.5', quotaMB: '2048', percentUsed: 0 };
      }
    }
    return { usageMB: 'N/A', quotaMB: 'N/A', percentUsed: 0 };
  }
}

export const dbService = new TournamentDatabase();
