// src/hooks/useOnlineSync.js
import { useEffect, useState } from 'react';
import { saveData, getData } from '../utils/db';

export function useOnlineSync(fetchApiData, key) {
  const [online, setOnline] = useState(navigator.onLine);
  const [data, setData] = useState(null);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    if (online) {
      fetchApiData()
        .then((freshData) => {
          setData(freshData);
          saveData(key, freshData);
        })
        .catch(async () => {
          // Si falla la API, intenta cargar local
          const offlineData = await getData(key);
          setData(offlineData);
        });
    } else {
      getData(key).then(setData);
    }
  }, [online, fetchApiData, key]);

  return { data, online };
}
