import {useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarUsuario = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    email: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al consultar el usuario.");
        }
        setValues({ nombre: data.usuario.nombre, email: data.usuario.email });
      } catch (err) {
        console.error(err);
        window.alert(err.message || "No se pudieron cargar los datos del usuario.");
        navigate("/usuarios");
      }
    };
    fetchUsuario();
  }, [fetchAuth, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error del servidor con estado: ${response.status}` }));
        throw new Error(errorData.message || `Error al modificar el usuario: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al modificar el usuario.");
        throw new Error(errorMessage);
      }

      window.alert("Usuario modificado exitosamente");
      navigate("/usuarios");
    } catch (err) {
      console.error(err);
      window.alert(err.message || "Ocurrió un error al modificar el usuario.");
    }
  };

  return (
    <article>
      <h2>Modificar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Nombre de Usuario<input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} /></label>
          <label>Email<input required type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label>
        </fieldset>
        <input type="submit" value="Modificar Usuario" />
      </form>
    </article>
  );
};