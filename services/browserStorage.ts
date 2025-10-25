import { BrowserStorage, StoredQuery } from '../types';

class BrowserStorageService implements BrowserStorage {
  private dbName = 'geminiCache';
  private storeName = 'queries';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('queryIndex', 'geminiQuery', { unique: false });
        }
      };
    });
  }

  async saveQuery(query: string, answer: string): Promise<void> {
    if (!this.db) await this.initDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.add({
        geminiQuery: query.trim(),
        geminiAnswer: answer,
        created_at: new Date().toISOString()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAnswer(query: string): Promise<string | null> {
    if (!this.db) await this.initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('queryIndex');
      
      const request = index.get(query.trim());

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.geminiAnswer);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllQueries(): Promise<StoredQuery[]> {
    if (!this.db) await this.initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const queries = request.result.map(row => ({
          id: row.id,
          geminiQuery: row.geminiQuery,
          geminiAnswer: row.geminiAnswer,
          created_at: row.created_at
        }));
        resolve(queries);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const browserStorage = new BrowserStorageService();