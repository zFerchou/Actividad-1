import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation';
import APICheck from './components/APICheck'; // ← Agrega esto
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Solo mostrar en desarrollo */}
        {process.env.NODE_ENV === 'development' && <APICheck />}
        <Navigation />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;