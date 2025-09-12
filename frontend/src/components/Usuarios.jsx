import React, { useEffect, useState } from 'react';
import { usersService } from '../services/api';
import authService from '../services/auth';
import './styles.css';

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
      const data = await usersService.obtenerUsuarios();
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

    // Verificar permisos
    if (!authService.hasRole('admin')) {
      setFormMsg('❌ Solo los administradores pueden crear usuarios');
      return;
    }

    try {
      const usuario = await usersService.crearUsuario({ nombre, email, password, rol });
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

  // Si el usuario no es admin, mostrar mensaje de no autorizado
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
                <th style={{width: '100px'}}>Estado</th>
              </tr>
            </thead>
            <tbody id="tbodyUsuarios">
              {loading ? (
                <tr><td colSpan="5" className="muted">Cargando…</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="5" className="muted">No hay usuarios aún.</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.rol}</span></td>
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
          <p className="muted">
            Al crear, se usará <span className="badge">POST /usuarios/nuevo</span>. 
            La lista consume <span className="badge">GET /usuarios</span>.
          </p>
        </aside>

        <footer className="grid-full">
          <p>Conectado a tu API Express/Node. Asegúrate de exponer las rutas <strong>/usuarios</strong> y <strong>/usuarios/nuevo</strong>.</p>
        </footer>
      </main>
    </div>
  );
}