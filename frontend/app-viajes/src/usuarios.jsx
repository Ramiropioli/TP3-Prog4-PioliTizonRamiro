import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export const Usuarios = () => {
  const { fetchAuth } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    const response = await fetchAuth("http://localhost:3000/usuarios");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error obteniendo los usuarios: ", data.error);
      return;
    }

    setUsuarios(data.usuarios);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const eliminarusuario = async (id) => {
    if (window.confirm("¿Desea quitar este usuario?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al quitar el usuario");
        }
        await fetchUsuarios();
      } catch (err) {
        console.error(err);
        window.alert("Error: " + err.message);
      }
    }
  };

  return (
    <>
      <h2>Usuarios</h2>
      <Link role="button" to="/usuarios/crear">
        Nuevo usuario
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>
                <div>
                  <Link role="button" to={`/usuarios/${usuario.id}/modificar`}>Modificar</Link>
                  <button onClick={() => eliminarusuario(usuario.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};