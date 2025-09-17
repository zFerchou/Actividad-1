import React, { useEffect, useState } from 'react';
import { usersService } from '../services/api';
import authService from '../services/auth';
import '../styles/Usuarios.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [stateMessage, setStateMessage] = useState('');
  const [currentUser] = useState(() => {
    return authService.getCurrentUser();
  });

  const cargarUsuarios = async () => {
    setLoading(true);
    setStateMessage('Cargando usuarios…');
    try {
      const data = await usersService.obtenerTodos();
      setUsuarios(data);
      setStateMessage(`Listo (${data.length} usuario/s).`);
    } catch (err) {
      console.error(err);
      setUsuarios([]);
      setStateMessage('Error al cargar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const rol = e.target.rol.value;
    const telefono = e.target.telefono.value.trim();
    const direccion = e.target.direccion.value.trim();

    if (!authService.hasRole('admin')) {
      setFormMsg(' Solo los administradores pueden crear usuarios');
      return;
    }

    try {
      const usuario = await usersService.crear({ 
        nombre, email, password, rol, telefono, direccion 
      });
      setFormMsg(`✅ Usuario creado: ${usuario.nombre} (${usuario.email})`);
      e.target.reset();
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      setFormMsg('❌ ' + err.message);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (!authService.hasRole('admin')) {
    return (
      <div className="container">
        <header>
          <h1>Gestión de Usuarios</h1>
        </header>
        <div className="card">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección. Solo los administradores pueden gestionar usuarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>Gestión de Usuarios — Lista y Registro</h1>
        <p className="muted">Conectado como: {currentUser?.nombre} ({currentUser?.rol})</p>
      </header>

      <main className="grid">
        <section className="card">
          <div className="controls">
            <button id="btnRecargar" onClick={cargarUsuarios} disabled={loading}>
              {loading ? 'Cargando...' : 'Recargar lista'}
            </button>
            <span id="state" className="muted" aria-live="polite">{stateMessage}</span>
          </div>
          
          <h2>Lista de usuarios</h2>
          <table aria-describedby="state">
            <thead>
              <tr>
                <th style={{width: '80px'}}>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th style={{width: '120px'}}>Rol</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th style={{width: '100px'}}>Estado</th>
              </tr>
            </thead>
            <tbody id="tbodyUsuarios">
              {loading ? (
                <tr><td colSpan="7" className="muted">Cargando…</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="7" className="muted">No hay usuarios aún.</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.rol}</span></td>
                    <td>{u.telefono || '-'}</td>
                    <td>{u.direccion || '-'}</td>
                    <td>
                      <span className={`status ${u.activo ? 'active' : 'inactive'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <aside className="card">
          <h2>Nuevo usuario</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" required maxLength={100} />
            </div>
            <div className="field">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" name="telefono" maxLength={20} />
            </div>
            <div className="field">
              <label htmlFor="direccion">Dirección</label>
              <input id="direccion" name="direccion" maxLength={255} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required maxLength={150} />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" name="password" type="password" required minLength={6} maxLength={255} />
            </div>
            <div className="field">
              <label htmlFor="rol">Rol</label>
              <select id="rol" name="rol" required>
                <option value="">— Selecciona —</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="lector">lector</option>
              </select>
            </div>
            
            <div className="controls">
              <button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear usuario'}
              </button>
              <button className="secondary" type="reset">Limpiar</button>
            </div>
            <div className={`msg ${formMsg.includes('✅') ? 'ok' : 'err'}`} aria-live="polite">
              {formMsg}
            </div>
          </form>
          <p className="muted"></p>
        </aside>

        <footer className="grid-full"></footer>
      </main>
    </div>
  );
}
