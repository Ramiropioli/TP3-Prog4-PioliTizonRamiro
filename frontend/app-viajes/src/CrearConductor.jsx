import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export const CrearConductor = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    vencimiento_licencia: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth("http://localhost:3000/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al crear el conductor.");
        throw new Error(errorMessage);
      }

      window.alert("Conductor creado exitosamente");
      navigate("/conductores");
    } catch (err) {
      console.error(err);
      window.alert(err.message || "Ocurrió un error al crear el conductor.");
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Conductor</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} />
          </label>
          <label>
            Apellido
            <input required value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} />
          </label>
          <label>
            DNI
            <input required value={values.dni} onChange={(e) => setValues({ ...values, dni: e.target.value })} />
          </label>
          <label>
            Licencia
            <input required value={values.licencia} onChange={(e) => setValues({ ...values, licencia: e.target.value })} />
          </label>
          <label>
            Vencimiento de Licencia
            <input required type="date" value={values.vencimiento_licencia} onChange={(e) => setValues({ ...values, vencimiento_licencia: e.target.value })} />
          </label>
        </fieldset>
        <input type="submit" value="Crear Conductor" />
      </form>
    </article>
  );
};