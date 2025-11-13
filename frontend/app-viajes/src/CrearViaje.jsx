import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export const CrearViaje = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    vehiculo_id: "",
    conductor_id: "",
    origen: "",
    destino: "",
    fecha_salida: "",
    fecha_llegada: "",
    kilometros: "",
    observaciones: "",
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
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
        console.error("Error al cargar datos para el formulario.", err);
        window.alert("Error al cargar datos para el formulario.");
      }
    };
    fetchDropdownData();
  }, [fetchAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth("http://localhost:3000/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al crear el viaje.");
        throw new Error(errorMessage);
      }

      window.alert("Viaje creado exitosamente");
      navigate("/viajes");
    } catch (err) {
      console.error(err);
      window.alert("Error: " + err.message);
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Viaje</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="grid">
            <label>
              Vehículo
              <select required value={values.vehiculo_id} onChange={(e) => setValues({ ...values, vehiculo_id: e.target.value })}>
                <option value="" disabled>Seleccione un vehículo</option>
                {vehiculos.map(v => <option key={v.id} value={v.id}>{`${v.marca} ${v.modelo} (${v.patente})`}</option>)}
              </select>
            </label>
            <label>
              Conductor
              <select required value={values.conductor_id} onChange={(e) => setValues({ ...values, conductor_id: e.target.value })}>
                <option value="" disabled>Seleccione un conductor</option>
                {conductores.map(c => <option key={c.id} value={c.id}>{`${c.nombre} ${c.apellido}`}</option>)}
              </select>
            </label>
          </div>
          <div className="grid">
            <label>
              Origen
              <input required value={values.origen} onChange={(e) => setValues({ ...values, origen: e.target.value })} />
            </label>
            <label>
              Destino
              <input required value={values.destino} onChange={(e) => setValues({ ...values, destino: e.target.value })} />
            </label>
          </div>
          <div className="grid">
            <label>
              Fecha de Salida
              <input required type="date" value={values.fecha_salida} onChange={(e) => setValues({ ...values, fecha_salida: e.target.value })} />
            </label>
            <label>
              Fecha de Llegada
              <input required type="date" value={values.fecha_llegada} onChange={(e) => setValues({ ...values, fecha_llegada: e.target.value })} />
            </label>
          </div>
          <label>
            Kilómetros
            <input required type="number" step="0.1" value={values.kilometros} onChange={(e) => setValues({ ...values, kilometros: e.target.value })} />
          </label>
          <label>
            Observaciones
            <textarea value={values.observaciones} onChange={(e) => setValues({ ...values, observaciones: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Crear Viaje" />
      </form>
    </article>
  );
};