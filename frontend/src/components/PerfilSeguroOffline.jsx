// src/components/PerfilSeguroOffline.jsx
import React from 'react';
import { profileService } from '../services/api';
import { useOnlineSync } from '../hooks/useOnlineSync';

export default function PerfilSeguroOffline() {
  // Sincroniza y cachea el perfil del usuario autenticado
  const { data: usuario, online } = useOnlineSync(profileService.obtenerPerfil, 'perfil');

  if (!usuario) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-seguro">
      <h2>Mi Perfil Seguro {online ? '(en línea)' : '(offline)'}</h2>
      <div className="informacion-usuario">
        <div className="campo">
          <label>Nombre:</label>
          <span>{usuario.nombre || 'No especificado'}</span>
        </div>
        <div className="campo">
          <label>Email:</label>
          <span>{usuario.email}</span>
        </div>
        <div className="campo">
          <label>Teléfono:</label>
          <span>{usuario.telefono || 'No especificado'}</span>
        </div>
        <div className="campo">
          <label>Dirección:</label>
          <span>{usuario.direccion || 'No especificado'}</span>
        </div>
        <div className="campo">
          <label>Rol:</label>
          <span>{usuario.rol || 'Usuario'}</span>
        </div>
      </div>
      {!online && <p style={{color:'orange'}}>Estás en modo solo lectura. No puedes editar tu perfil sin conexión.</p>}
    </div>
  );
}
