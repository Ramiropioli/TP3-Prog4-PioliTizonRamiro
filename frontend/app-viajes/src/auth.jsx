import { createContext, useCallback, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const login = useCallback(async (nombre, contrasena) => {
  setError(null);
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contrasena }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      let errorMessage = "Error en el inicio de sesión.";
      if (data.message) {
        errorMessage = data.message;
      }
      throw new Error(errorMessage);
    }

    window.localStorage.setItem("token", data.token);
    setToken(data.token);
    return { success: true };

  } catch (err) {
    console.error(err);
    setError(err.message);
    return { success: false };
  }
}, []);


  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    setToken(null);
  }, []);

  const fetchAuth = useCallback(async (url, options = {}) => {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const finalOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, finalOptions);
    
    if (response.status === 401) {
      logout(); 
      throw new Error("Tu sesión ha expirado. Por favor, ingresa de nuevo.");
    }

    return response;
  }, [token, logout]); 

  const value = { token, error, login, logout, fetchAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const Autenticar = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
    
  }

  return children;
};