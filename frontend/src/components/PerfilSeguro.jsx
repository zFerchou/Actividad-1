import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PerfilSeguro.css';

const PerfilSeguro = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación antes de mostrar el perfil
    const estaAutenticado = localStorage.getItem('autenticado');
    if (!estaAutenticado) {
      navigate('/autenticacion');
    } else {
      // Cargar datos del usuario (simulado)
      setUsuario({
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        telefono: '+1234567890',
        direccion: 'Calle Principal 123'
      });
    }
  }, [navigate]);

  const handleGuardar = (datos) => {
    // Aquí iría la lógica para guardar en el backend
    setUsuario(datos);
    setEditando(false);
    alert('Información guardada exitosamente');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('autenticado');
    navigate('/autenticacion');
  };

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="perfil-seguro">
      <h2>Mi Perfil Seguro</h2>
      <button onClick={cerrarSesion} className="btn-cerrar-sesion">
        Cerrar Sesión
      </button>

      {editando ? (
        <FormularioEdicion 
          usuario={usuario} 
          onGuardar={handleGuardar}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <InformacionUsuario 
          usuario={usuario} 
          onEditar={() => setEditando(true)}
        />
      )}
    </div>
  );
};

const InformacionUsuario = ({ usuario, onEditar }) => (
  <div className="informacion-usuario">
    <div className="campo">
      <label>Nombre:</label>
      <span>{usuario.nombre}</span>
    </div>
    <div className="campo">
      <label>Email:</label>
      <span>{usuario.email}</span>
    </div>
    <div className="campo">
      <label>Teléfono:</label>
      <span>{usuario.telefono}</span>
    </div>
    <div className="campo">
      <label>Dirección:</label>
      <span>{usuario.direccion}</span>
    </div>
    <button onClick={onEditar} className="btn-editar">
      Editar Información
    </button>
  </div>
);

const FormularioEdicion = ({ usuario, onGuardar, onCancelar }) => {
  const [datos, setDatos] = useState(usuario);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(datos);
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-edicion">
      <div className="campo-form">
        <label>Nombre:</label>
        <input
          type="text"
          value={datos.nombre}
          onChange={(e) => setDatos({...datos, nombre: e.target.value})}
        />
      </div>
      <div className="campo-form">
        <label>Email:</label>
        <input
          type="email"
          value={datos.email}
          onChange={(e) => setDatos({...datos, email: e.target.value})}
        />
      </div>
      <div className="campo-form">
        <label>Teléfono:</label>
        <input
          type="tel"
          value={datos.telefono}
          onChange={(e) => setDatos({...datos, telefono: e.target.value})}
        />
      </div>
      <div className="campo-form">
        <label>Dirección:</label>
        <input
          type="text"
          value={datos.direccion}
          onChange={(e) => setDatos({...datos, direccion: e.target.value})}
        />
      </div>
      <div className="botones-form">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
};

export default PerfilSeguro;