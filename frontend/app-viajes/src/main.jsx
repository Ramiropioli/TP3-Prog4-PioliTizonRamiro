import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider, Autenticar } from './auth.jsx' 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import { App } from './App.jsx'
import { Ingresar } from './ingresar.jsx'
import { Usuarios } from './usuarios.jsx'
import { CrearUsuario } from './CrearUsuario.jsx'
import { ModificarUsuario } from './ModificarUsuario.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />

           
            <Route path="ingresar" element={<Ingresar />} />
            
            <Route path="usuarios/crear" element={<CrearUsuario />} />
            <Route path="usuarios" element={<Autenticar><Usuarios /></Autenticar>} />
            <Route path="usuarios/:id/modificar" element={<Autenticar><ModificarUsuario /></Autenticar>} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
