import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export const Conductores = () => {
  const { fetchAuth } = useAuth();
  const [conductores, setConductores] = useState([]);

  const fetchConductores = async () => {
    const response = await fetchAuth("http://localhost:3000/conductores");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error obteniendo los conductores: ", data.error);
      return;
    }

    setConductores(data.conductores);
  };

  useEffect(() => {
    fetchConductores();
  }, []);

  const eliminarconductor= async (id) => {
    if (window.confirm("¿Desea quitar este conductor?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al quitar el conductor");
        }
        await fetchConductores();
      } catch (err) {
        console.error(err);
        window.alert(err.message || "Ocurrió un error al intentar eliminar el conductor.");
      }
    }
  };

  return (
    <>
      <h2>Conductores</h2>
      <Link role="button" to="/conductores/crear">
        Nuevo conductor
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Licencia</th>
            <th>Vencimiento de Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((conductor) => (
            <tr key={conductor.id}>
              <td>{conductor.id}</td>
              <td>{conductor.nombre}</td>
              <td>{conductor.apellido}</td>
              <td>{conductor.dni}</td>
              <td>{conductor.licencia}</td>
              <td>{conductor.vencimiento_licencia}</td>
              <td>
                <div>
                  <Link role="button" to={`/conductores/${conductor.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => eliminarconductor(conductor.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};