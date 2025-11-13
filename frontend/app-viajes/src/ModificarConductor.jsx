import {useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarConductor = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    vencimiento_licencia: "",
  });

  useEffect(() => {
    const fetchConductor = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/conductores/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Error al consultar el conductor.");
        }
        if (data.data.vencimiento_licencia) {
          data.data.vencimiento_licencia = data.data.vencimiento_licencia.slice(0, 10);
        }
        setValues(data.data);
      } catch (err) {
        console.error(err);
        window.alert(err.message || "No se pudieron cargar los datos del conductor.");
        navigate("/conductores");
      }
    };
    fetchConductor();
  }, [fetchAuth, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.errors ? data.errors[0].msg : (data.message || "Error al modificar el conductor.");
        throw new Error(errorMessage);
      }

      window.alert("Conductor modificado exitosamente");
      navigate("/conductores");
    } catch (err) {
      console.error(err);
      window.alert(err.message || "Ocurrió un error al modificar el conductor.");
    }
  };

  return (
    <article>
      <h2>Modificar Conductor</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Nombre<input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} /></label>
          <label>Apellido<input required value={values.apellido} onChange={(e) => setValues({ ...values, apellido: e.target.value })} /></label>
          <label>DNI<input required value={values.dni} onChange={(e) => setValues({ ...values, dni: e.target.value })} /></label>
          <label>Licencia<input required value={values.licencia} onChange={(e) => setValues({ ...values, licencia: e.target.value })} /></label>
          <label>Vencimiento de Licencia<input required type="date" value={values.vencimiento_licencia} onChange={(e) => setValues({ ...values, vencimiento_licencia: e.target.value })} /></label>
        </fieldset>
        <input type="submit" value="Modificar Conductor" />
      </form>
    </article>
  );
};