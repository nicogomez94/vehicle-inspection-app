import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Admin from './pages/Admin.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={
          <>
            <div style={{ 
              position: 'fixed', 
              top: '20px', 
              display: 'none',
              left: '20px', 
              zIndex: 1000 
            }}>
              <Link 
                to="/" 
                style={{
                  padding: '10px 20px',
                  background: '#4CAF50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                ← Volver al Registro
              </Link>
            </div>
            <Admin />
          </>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
