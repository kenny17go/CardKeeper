/* =========================================================
   db.js — tiny IndexedDB wrapper for local card storage
   Store: "cards"  keyPath: "id"
   ========================================================= */
const CardDB = (() => {
  const DB_NAME = 'cardkeeper-db';
  const DB_VERSION = 1;
  const STORE = 'cards';
  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(mode) {
    const db = await open();
    const t = db.transaction(STORE, mode);
    return { t, store: t.objectStore(STORE) };
  }

  return {
    async getAll() {
      const { store } = await tx('readonly');
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result.sort((a, b) => b.updatedAt - a.updatedAt));
        req.onerror = () => reject(req.error);
      });
    },

    async get(id) {
      const { store } = await tx('readonly');
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    },

    async put(card) {
      const { store, t } = await tx('readwrite');
      store.put(card);
      return new Promise((resolve, reject) => {
        t.oncomplete = () => resolve(card);
        t.onerror = () => reject(t.error);
      });
    },

    async delete(id) {
      const { store, t } = await tx('readwrite');
      store.delete(id);
      return new Promise((resolve, reject) => {
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
      });
    },

    async clearAll() {
      const { store, t } = await tx('readwrite');
      store.clear();
      return new Promise((resolve, reject) => {
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
      });
    },

    async bulkPutIfNotExists(cards) {
      const { store, t } = await tx('readwrite');
      let added = 0;
      for (const c of cards) {
        const existing = await new Promise((res) => {
          const r = store.get(c.id);
          r.onsuccess = () => res(r.result);
          r.onerror = () => res(null);
        });
        if (!existing) {
          store.put(c);
          added++;
        }
      }
      return new Promise((resolve, reject) => {
        t.oncomplete = () => resolve(added);
        t.onerror = () => reject(t.error);
      });
    }
  };
})();
