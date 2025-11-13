import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export const CrearVehiculo = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    marca: "",
    modelo: "",
    patente: "",
    ano: "",
    capacidad_carga: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al crear el vehículo.");
        throw new Error(errorMessage);
      }

      window.alert("Vehículo creado exitosamente");
      navigate("/vehiculos");
    } catch (err) {
      console.error(err);
      window.alert("Error: " + err.message);
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Marca
            <input required value={values.marca} onChange={(e) => setValues({ ...values, marca: e.target.value })} />
          </label>
          <label>
            Modelo
            <input required value={values.modelo} onChange={(e) => setValues({ ...values, modelo: e.target.value })} />
          </label>
          <label>
            Patente
            <input required value={values.patente} onChange={(e) => setValues({ ...values, patente: e.target.value })} />
          </label>
          <label>
            Año
            <input required type="number" value={values.ano} onChange={(e) => setValues({ ...values, ano: e.target.value })} />
          </label>
          <label>
            Capacidad de Carga (kg)
            <input required type="number" step="0.01" value={values.capacidad_carga} onChange={(e) => setValues({ ...values, capacidad_carga: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Crear Vehículo" />
      </form>
    </article>
  );
};