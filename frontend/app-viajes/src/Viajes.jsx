import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export const Viajes = () => {
  const { fetchAuth } = useAuth();
  const [viajes, setViajes] = useState([]);

  const fetchViajes = async () => {
    const response = await fetchAuth("http://localhost:3000/viajes");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error obteniendo los viajes: ", data.error);
      return;
    }
    setViajes(data.viajes);
  };

  useEffect(() => {
    fetchViajes();
  }, []);

  return (
    <>
      <h2>Viajes</h2>
      <Link role="button" to="/viajes/crear">
        Nuevo Viaje
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilómetros</th>
            <th>Conductor</th>
            <th>Vehículo</th>
            <th>observaciones</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((viaje) => (
            <tr key={viaje.id}>
              <td>{viaje.id}</td>
              <td>{viaje.origen}</td>
              <td>{viaje.destino}</td>
              <td>{viaje.kilometros}</td>
              <td>{`${viaje.conductor_nombre} ${viaje.conductor_apellido}`}</td>
              <td>{`${viaje.vehiculo_marca} ${viaje.vehiculo_modelo} (${viaje.vehiculo_patente})`}</td>
              <td>{viaje.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};