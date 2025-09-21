// src/utils/db.js
import { openDB } from 'idb';

export const getDB = async () => {
  return openDB('app-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('datos')) {
        db.createObjectStore('datos');
      }
    },
  });
};

export const saveData = async (key, data) => {
  const db = await getDB();
  await db.put('datos', data, key);
};

export const getData = async (key) => {
  const db = await getDB();
  return db.get('datos', key);
};
