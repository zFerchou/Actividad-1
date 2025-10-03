import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../styles/Navigation.css';
import { useNotificaciones } from '../hooks/useNotificaciones';

// Simulación del servicio de autenticación (reemplazar con tu implementación real)
const authService = {
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user')) || null;
  },
  hasRole: (role) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    return user && user.rol === role;
  },
  logout: () => {
    localStorage.removeItem('user');
  }
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const usuarioId = user?.id;
  const { noLeidas } = useNotificaciones(usuarioId);

  useEffect(() => {
    // Verificar usuario al cargar o al cambiar de página
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // No mostrar navegación si no hay usuario logueado
  if (!user) {
    return null;
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3 custom-navbar">
      <Container fluid>
        <Navbar.Brand
          href="#"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          🛡️ Sistema Seguro
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Menú de Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              {/* Notificaciones */}
              <Nav.Link 
                className={isActive('/notificaciones') ? 'active' : ''}
                onClick={() => navigate('/notificaciones')}
                style={{cursor: 'pointer', position: 'relative'}}
                aria-label="Notificaciones"
              >
                <span style={{fontSize: '1.5rem'}}>🔔</span>
                {noLeidas > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '0.8rem',
                    padding: '2px 6px',
                    minWidth: 18,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>{noLeidas}</span>
                )}
              </Nav.Link>

              {/* Inicio */}
              <Nav.Link
                className={isActive('/') ? 'active' : ''}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                🏠 Inicio
              </Nav.Link>

              {/* Perfil */}
              <Nav.Link
                className={isActive('/perfil') ? 'active' : ''}
                onClick={() => navigate('/autenticacion')}
                style={{ cursor: 'pointer' }}
              >
                👤 Perfil
              </Nav.Link>

              {/* Administración */}
              {authService.hasRole('admin') && (
                <Nav.Link
                  className={isActive('/usuarios') ? 'active' : ''}
                  onClick={() => navigate('/usuarios')}
                  style={{ cursor: 'pointer' }}
                >
                  👥 Gestión de Usuarios
                </Nav.Link>
              )}
            </Nav>

            {/* Sección derecha con saludo y logout */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <span className="text-nowrap">
                👋 Hola, {user.nombre}{' '}
                <span className="user-role">({user.rol})</span>
              </span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Navigation;
