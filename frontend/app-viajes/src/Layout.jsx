import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./auth";

export const Layout = () => {

  const { token, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          {token && <li><Link to="/usuarios">Usuarios</Link></li>}
          {token && <li><Link to="/conductores">Conductores</Link></li>}
          {token && <li><Link to="/vehiculos">Vehículos</Link></li>}
          {token && <li><Link to="/viajes">Viajes</Link></li>}
          {token && <li><Link to="/reportes">Reportes</Link></li>}
        </ul>
       
        <li>
          {token ? (
            <button onClick={() => logout()}>Salir</button>
          ) : (            <div className="grid">
              <Link to="/ingresar" role="button">Ingresar</Link>
              <Link to="/Registrarse" role="button">Registrarse</Link>
            </div>
          )}
        </li>
      </nav>
      <Outlet />
    </main>
  );
};
