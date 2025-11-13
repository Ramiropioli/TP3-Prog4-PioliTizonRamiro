import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export const Vehiculos = () => {
  const { fetchAuth } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);

  const fetchVehiculos = async () => {
    const response = await fetchAuth("http://localhost:3000/vehiculos");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error obteniendo los vehiculos: ", data.error);
      return;
    }
    setVehiculos(data.vehiculos);
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const eliminarvehiculo = async (id) => {
    if (window.confirm("¿Desea quitar el vehículo?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al quitar el vehículo");
        }
        await fetchVehiculos();
      } catch (err) {
        console.error(err);
        window.alert(err.message || "Ocurrió un error al intentar eliminar el vehículo.");
      }
    }
  };

  return (
    <>
      <h2>Vehículos</h2>
      <Link role="button" to="/vehiculos/crear">
        Nuevo vehículo
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad (kg)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.id}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.ano}</td>
              <td>{vehiculo.capacidad_carga}</td>
              <td>
                <div>
                  <Link role="button" to={`/vehiculos/${vehiculo.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => eliminarvehiculo(vehiculo.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};