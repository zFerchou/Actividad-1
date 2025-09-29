import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geolocAPI } from '../services/api';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

// Fix default icon (Leaflet expects images from node_modules path)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const CenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => { if (position) map.setView(position, 15); }, [position, map]);
  return null;
};

const Geolocalizacion = () => {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('Obteniendo ubicación...');
  const watchIdRef = useRef(null);
  const online = useOnlineStatus();

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocalización no soportada');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const p = { lat: latitude, lng: longitude };
      setPosition(p);
      setStatus('Ubicación obtenida');
      if (online) {
        try { await geolocAPI.track({ lat: latitude, lng: longitude, accuracy }); } catch {}
      }
    }, (err) => {
      console.warn(err);
      setStatus('No se pudo obtener tu ubicación');
    }, { enableHighAccuracy: true });

    watchIdRef.current = navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const p = { lat: latitude, lng: longitude };
      setPosition(p);
      if (online) {
        try { await geolocAPI.track({ lat: latitude, lng: longitude, accuracy }); } catch {}
      }
    }, (err) => console.warn('watchPosition', err), { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });

    return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [online]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ padding: 8, color: '#555' }}>{status}{!online && ' (offline: el tracking se enviará cuando haya conexión)'}</div>
      <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer center={position || [0,0]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {position && <Marker position={position} />}
          {position && <CenterMap position={position} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Geolocalizacion;
