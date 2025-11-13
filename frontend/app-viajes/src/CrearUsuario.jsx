import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export const CrearUsuario = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contrasena: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error del servidor con estado: ${response.status}` }));
        throw new Error(errorData.message || `Error al crear el usuario: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al crear el usuario.");
        throw new Error(errorMessage);
      }

      window.alert("Usuario creado exitosamente");
      navigate("/usuarios");
    } catch (err) {
      console.error(err);
      window.alert(err.message || "Ocurrió un error al crear el usuario.");
    }
  };

  return (
    <article>

      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre de Usuario
            <input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
          </label>
          <label>
            Email
            <input required type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
          </label>
          <label>
            Contraseña
            <input required type="password" value={values.contrasena} onChange={(e) => setValues({ ...values, contrasena: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Crear Usuario" />
      </form>
    </article>
  );
};