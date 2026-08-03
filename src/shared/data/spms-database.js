/**
 * SPMS frontend database
 * A small localStorage-backed database shared by every portal.
 */
(function createSPMSDatabase(global) {
  'use strict';

  const STORAGE_KEY = 'spms_database';
  const EVENT_NAME = 'spms:database-changed';
  const SCHEMA_VERSION = 1;

  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

  function now() {
    return new Date().toISOString();
  }

  function makeId(collection) {
    const prefix = String(collection || 'item')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-z0-9]+/gi, '_')
      .toUpperCase()
      .slice(0, 12);
    return `${prefix}_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  function seedDatabase() {
    if (!global.SPMSSeedData) {
      throw new Error('SPMSSeedData chưa được nạp trước spms-database.js');
    }
    const db = clone(global.SPMSSeedData);
    db.schemaVersion = SCHEMA_VERSION;
    db.meta = {
      createdAt: now(),
      updatedAt: now(),
      revision: 1,
      source: 'seed'
    };
    db.studentProfileDrafts = db.studentProfileDrafts || [];
    db.studentRecordDrafts = db.studentRecordDrafts || [];
    db.auditLogs = db.auditLogs || [];
    return db;
  }

  function parseStored() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value && typeof value === 'object' ? value : null;
    } catch {
      return null;
    }
  }

  function persist(db, detail) {
    db.meta = db.meta || {};
    db.meta.updatedAt = now();
    db.meta.revision = Number(db.meta.revision || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    global.dispatchEvent(new CustomEvent(EVENT_NAME, {
      detail: { revision: db.meta.revision, ...(detail || {}) }
    }));
    return clone(db);
  }

  function ensure() {
    let db = parseStored();
    if (!db || Number(db.schemaVersion) !== SCHEMA_VERSION) {
      db = seedDatabase();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } else if (global.SPMSSeedData) {
      // Bổ sung collection mới khi fixture được mở rộng, không ghi đè dữ liệu người dùng.
      let changed = false;
      Object.entries(global.SPMSSeedData).forEach(([name, value]) => {
        if (Array.isArray(value) && !Array.isArray(db[name])) {
          db[name] = clone(value);
          changed = true;
        } else if (Array.isArray(value) && Array.isArray(db[name])) {
          value.forEach(seedItem => {
            if (seedItem?.id && !db[name].some(item => String(item.id) === String(seedItem.id))) {
              db[name].push(clone(seedItem));
              changed = true;
            }
          });
        }
      });
      if (changed) {
        db.meta = db.meta || {};
        db.meta.updatedAt = now();
        db.meta.revision = Number(db.meta.revision || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      }
    }
    return db;
  }

  function collection(db, name) {
    if (!Array.isArray(db[name])) db[name] = [];
    return db[name];
  }

  const api = {
    storageKey: STORAGE_KEY,
    eventName: EVENT_NAME,

    init() {
      return clone(ensure());
    },

    read() {
      return clone(ensure());
    },

    reset() {
      const db = seedDatabase();
      return persist(db, { action: 'reset' });
    },

    list(name, predicate) {
      const rows = collection(ensure(), name);
      return clone(typeof predicate === 'function' ? rows.filter(predicate) : rows);
    },

    find(name, idOrPredicate) {
      const rows = collection(ensure(), name);
      const row = typeof idOrPredicate === 'function'
        ? rows.find(idOrPredicate)
        : rows.find(item => String(item.id) === String(idOrPredicate));
      return clone(row || null);
    },

    insert(name, value, options) {
      const db = ensure();
      const rows = collection(db, name);
      const row = { ...clone(value) };
      if (!row.id) row.id = makeId(name);
      if (rows.some(item => String(item.id) === String(row.id))) {
        throw new Error(`${name}.${row.id} đã tồn tại`);
      }
      row.createdAt = row.createdAt || now();
      row.updatedAt = now();
      rows.push(row);
      persist(db, { collection: name, action: 'insert', id: row.id, ...(options || {}) });
      return clone(row);
    },

    update(name, id, changes, options) {
      const db = ensure();
      const rows = collection(db, name);
      const index = rows.findIndex(item => String(item.id) === String(id));
      if (index < 0) return null;
      const patch = typeof changes === 'function' ? changes(clone(rows[index])) : changes;
      rows[index] = { ...rows[index], ...clone(patch), id: rows[index].id, updatedAt: now() };
      persist(db, { collection: name, action: 'update', id: rows[index].id, ...(options || {}) });
      return clone(rows[index]);
    },

    upsert(name, value, matcher, options) {
      const rows = this.list(name);
      const existing = typeof matcher === 'function'
        ? rows.find(matcher)
        : rows.find(item => String(item.id) === String(value.id));
      return existing
        ? this.update(name, existing.id, value, options)
        : this.insert(name, value, options);
    },

    remove(name, id, options) {
      const db = ensure();
      const rows = collection(db, name);
      const index = rows.findIndex(item => String(item.id) === String(id));
      if (index < 0) return false;
      rows.splice(index, 1);
      persist(db, { collection: name, action: 'remove', id, ...(options || {}) });
      return true;
    },

    transaction(mutator, detail) {
      const db = ensure();
      const result = mutator(db);
      persist(db, { action: 'transaction', ...(detail || {}) });
      return clone(result);
    },

    currentUser() {
      let session = null;
      try { session = JSON.parse(sessionStorage.getItem('spms_user')); } catch { /* no session */ }
      if (!session) return null;
      const username = String(session.username || session.userName || '').toLowerCase();
      const user = collection(ensure(), 'users').find(item =>
        String(item.id) === String(session.id || session.userId || '') ||
        String(item.username).toLowerCase() === username
      );
      return clone(user || session);
    },

    subscribe(listener) {
      const handler = event => listener(event.detail || {}, this.read());
      global.addEventListener(EVENT_NAME, handler);
      return () => global.removeEventListener(EVENT_NAME, handler);
    }
  };

  global.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) {
      global.dispatchEvent(new CustomEvent(EVENT_NAME, {
        detail: { action: 'external-update', revision: parseStored()?.meta?.revision || 0 }
      }));
    }
  });

  global.SPMSDatabase = api;
  api.init();
})(typeof window !== 'undefined' ? window : globalThis);
