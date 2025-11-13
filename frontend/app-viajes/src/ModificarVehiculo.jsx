import {useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarVehiculo = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    marca: "",
    modelo: "",
    patente: "",
    ano: "",
    capacidad_carga: "",
  });

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al consultar el vehículo.");
        }
        setValues(data.data);
      } catch (err) {
        console.error(err);
        window.alert("Error: " + err.message);
        navigate("/vehiculos");
      }
    };
    fetchVehiculo();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al modificar el vehículo.");
        throw new Error(errorMessage);
      }

      window.alert("Vehículo modificado exitosamente");
      navigate("/vehiculos");
    } catch (err) {
      console.error(err);
      window.alert("Error: " + err.message);
    }
  };

  return (
    <article>
      <h2>Modificar Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Marca<input required value={values.marca} onChange={(e) => setValues({ ...values, marca: e.target.value })} /></label>
          <label>Modelo<input required value={values.modelo} onChange={(e) => setValues({ ...values, modelo: e.target.value })} /></label>
          <label>Patente<input required value={values.patente} onChange={(e) => setValues({ ...values, patente: e.target.value })} /></label>
          <label>Año<input required type="number" value={values.ano} onChange={(e) => setValues({ ...values, ano: e.target.value })} /></label>
          <label>
            Capacidad de Carga (kg)
            <input
              required
              type="number"
              step="0.01"
              value={values.capacidad_carga}
              onChange={(e) => setValues({ ...values, capacidad_carga: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Modificar Vehículo" />
      </form>
    </article>
  );
};