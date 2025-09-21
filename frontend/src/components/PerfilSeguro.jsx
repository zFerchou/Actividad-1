import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/api'; // ← CAMBIADO: Importar profileService en lugar de authAPI
import authService from '../services/auth';
import '../styles/PerfilSeguro.css';

const PerfilSeguro = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const online = useOnlineStatus();

  useEffect(() => {
    cargarPerfilUsuario();
  }, []);

  const cargarPerfilUsuario = async () => {
    try {
      setCargando(true);
      
      // Verificar si el usuario está autenticado
      const token = authService.getToken();
      if (!token) {
        navigate('/autenticacion');
        return;
      }

      // Obtener datos reales del usuario desde el backend
      const datosUsuario = await profileService.obtenerPerfil(); // ← CAMBIADO: authAPI → profileService
      setUsuario(datosUsuario);
      
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError('Error al cargar la información del usuario');
      
      // Si hay error de autenticación, redirigir al login
      if (err.message.includes('401') || err.message.includes('403')) {
        authService.logout();
        navigate('/autenticacion');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async (datosActualizados) => {
    try {
      setCargando(true);
      
      // Actualizar en el backend
      const usuarioActualizado = await profileService.actualizarPerfil(datosActualizados); // ← CAMBIADO: authAPI → profileService
      setUsuario(usuarioActualizado);
      setEditando(false);
      
      alert('Información guardada exitosamente');
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError('Error al guardar la información');
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    authService.logout();
    navigate('/autenticacion');
  };

  if (cargando) return <div className="cargando">Cargando perfil...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!usuario) return <div>No se pudo cargar la información del usuario</div>;

  return (
    <div className="perfil-seguro">
      <h2>Mi Perfil Seguro {online ? '' : '(offline)'}</h2>
      <button onClick={cerrarSesion} className="btn-cerrar-sesion">
        Cerrar Sesión
      </button>
      {!online && (
        <div style={{color:'orange', marginBottom: 10}}>
          Estás en modo solo lectura. No puedes editar tu perfil sin conexión.
        </div>
      )}
      {editando && online ? (
        <FormularioEdicion 
          usuario={usuario} 
          onGuardar={handleGuardar}
          onCancelar={() => setEditando(false)}
          cargando={cargando}
        />
      ) : (
        <InformacionUsuario 
          usuario={usuario} 
          onEditar={online ? () => setEditando(true) : undefined}
          online={online}
        />
      )}
    </div>
  );
};

const InformacionUsuario = ({ usuario, onEditar, online }) => (
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
    <button onClick={onEditar} className="btn-editar" disabled={!online}>
      Editar Información
    </button>
  </div>
);

const FormularioEdicion = ({ usuario, onGuardar, onCancelar, cargando }) => {
  const [datos, setDatos] = useState(usuario);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!datos.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!datos.email.trim()) {
      setError('El email es requerido');
      return;
    }
    
    setError('');
    onGuardar(datos);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-edicion">
      {error && <div className="error-message">{error}</div>}
      
      <div className="campo-form">
        <label>Nombre:</label>
        <input
          type="text"
          value={datos.nombre || ''}
          onChange={(e) => setDatos({...datos, nombre: e.target.value})}
          required
        />
      </div>
      <div className="campo-form">
        <label>Email:</label>
        <input
          type="email"
          value={datos.email || ''}
          onChange={(e) => setDatos({...datos, email: e.target.value})}
          required
        />
      </div>
      <div className="campo-form">
        <label>Teléfono:</label>
        <input
          type="tel"
          value={datos.telefono || ''}
          onChange={(e) => setDatos({...datos, telefono: e.target.value})}
          placeholder="+1234567890"
        />
      </div>
      <div className="campo-form">
        <label>Dirección:</label>
        <input
          type="text"
          value={datos.direccion || ''}
          onChange={(e) => setDatos({...datos, direccion: e.target.value})}
          placeholder="Calle Principal 123"
        />
      </div>
      <div className="botones-form">
        <button type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default PerfilSeguro;