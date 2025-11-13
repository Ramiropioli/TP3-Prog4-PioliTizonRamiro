import { useEffect, useState } from "react";
import { useAuth } from "./auth";

export const Reportes = () => {
  const { fetchAuth } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState("");
  const [selectedConductor, setSelectedConductor] = useState("");
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const [totalKilometros, setTotalKilometros] = useState(null);

  useEffect(() => {
    const fetchVehiculosYConductores = async () => {
      try {
        const [vehiculosRes, conductoresRes] = await Promise.all([
          fetchAuth("http://localhost:3000/vehiculos"),
          fetchAuth("http://localhost:3000/conductores"),
        ]);
        const vehiculosData = await vehiculosRes.json();
        const conductoresData = await conductoresRes.json();

        if (vehiculosData.success) setVehiculos(vehiculosData.vehiculos);
        if (conductoresData.success) setConductores(conductoresData.conductores);
      } catch (err) {
        console.error("Error al cargar las listas de selección.", err);
        window.alert("Error al cargar las listas de selección.");
      }
    };
    fetchVehiculosYConductores();
  }, [fetchAuth]);
  const seleccionarvehiculo = async (vehiculoId) => {
    if (!vehiculoId) return;
    setSelectedVehiculo(vehiculoId);
    setSelectedConductor(""); 
    setViajesFiltrados([]);
    setTotalKilometros(null);

    try {
      const [viajesRes, kmRes] = await Promise.all([
        fetchAuth(`http://localhost:3000/viajes/vehiculo/${vehiculoId}`),
        fetchAuth(`http://localhost:3000/viajes/kilometros/vehiculo/${vehiculoId}`),
      ]);

      const viajesData = await viajesRes.json();
      const kmData = await kmRes.json();

      if (viajesData.success) setViajesFiltrados(viajesData.data);
      if (kmData.success) setTotalKilometros(kmData.data.total_kilometros);

    } catch (err) {
      console.error(err);
      window.alert("Error al generar el reporte para el vehículo.");
    }
  };

  const seleccionarconductor = async (conductorId) => {
    if (!conductorId) return;
    setSelectedConductor(conductorId);
    setSelectedVehiculo(""); 
    setViajesFiltrados([]);
    setTotalKilometros(null);

    try {
      const [viajesRes, kmRes] = await Promise.all([
        fetchAuth(`http://localhost:3000/viajes/conductor/${conductorId}`),
        fetchAuth(`http://localhost:3000/viajes/kilometros/conductor/${conductorId}`),
      ]);

      const viajesData = await viajesRes.json();
      const kmData = await kmRes.json();

      if (viajesData.success) setViajesFiltrados(viajesData.data);
      if (kmData.success) setTotalKilometros(kmData.data.total_kilometros);

    } catch (err) {
      console.error(err);
      window.alert("Error al generar el reporte para el conductor.");
    }
  };

  return (
    <article>
      <h2>Reportes de Viajes</h2>
      <p>Seleccione un vehículo o un conductor para ver su historial de viajes y el total de kilómetros recorridos.</p>

      <div className="grid">
        <label>
          Consultar por Vehículo
          <select value={selectedVehiculo} onChange={(e) => seleccionarvehiculo(e.target.value)}>
            <option value="">-- Seleccione un vehículo --</option>
            {vehiculos.map(v => <option key={v.id} value={v.id}>{`${v.marca} ${v.modelo} (${v.patente})`}</option>)}
          </select>
        </label>
        <label>
          Consultar por Conductor
          <select value={selectedConductor} onChange={(e) => seleccionarconductor(e.target.value)}>
            <option value="">-- Seleccione un conductor --</option>
            {conductores.map(c => <option key={c.id} value={c.id}>{`${c.nombre} ${c.apellido}`}</option>)}
          </select>
        </label>
      </div>

      {(selectedVehiculo || selectedConductor) && (
        <div className="report-results">
          <h3>Resultados del Reporte</h3>
          {totalKilometros !== null ? (
            <div className="report-summary">
              <h4>Total de Kilómetros Recorridos: {Number(totalKilometros).toFixed(2)} km</h4>
            </div>
          ) : <p>No se encontraron kilómetros.</p>}

          <h4>Historial de Viajes</h4>
          {viajesFiltrados.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Kilómetros</th>
                </tr>
              </thead>
              <tbody>
                {viajesFiltrados.map((viaje) => (
                  <tr key={viaje.id}>
                    <td>{viaje.id}</td>
                    <td>{viaje.origen}</td>
                    <td>{viaje.destino}</td>
                    <td>{viaje.kilometros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No se encontraron viajes.</p>}
        </div>
      )}
    </article>
  );
};