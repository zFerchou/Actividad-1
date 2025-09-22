// src/components/UsuariosOffline.jsx
import React from 'react';
import { usersService } from '../services/api';
import { useOnlineSync } from '../hooks/useOnlineSync';

export default function UsuariosOffline() {
  // Sincroniza y cachea la lista de usuarios
  const { data: usuarios, online } = useOnlineSync(usersService.obtenerTodos, 'usuarios');

  return (
    <div>
      <h2>Usuarios {online ? '(en línea)' : '(offline)'}</h2>
      {usuarios ? (
        <ul>
          {usuarios.map(u => (
            <li key={u.id}>{u.nombre} ({u.email})</li>
          ))}
        </ul>
      ) : (
        <p>Cargando usuarios...</p>
      )}
      {!online && <p style={{color:'orange'}}>Estás en modo solo lectura. No puedes crear ni editar usuarios sin conexión.</p>}
    </div>
  );
}
