import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Registrarse = () => { 
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contrasena: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 400 && data.errors) {
          return setErrores(data.errors);
        }
        throw new Error(data.message || "Error al crear la cuenta.");
      }

      window.alert("Registro exitoso");
      navigate("/ingresar"); 

    } catch (err) {
      window.alert(err.message);
      console.error(err);
    }
  };

  return (
    <article>
      <h2>Crear una cuenta</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre de usuario
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "nombre")}
            />
            {errores && errores.some((e) => e.path === "nombre") && (
              <small>{errores.find((e) => e.path === "nombre").msg}</small>
            )}
          </label>

          <label>
            Correo electrónico
            <input
              required
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "email")}
            />
            {errores && errores.some((e) => e.path === "email") && (
              <small>{errores.find((e) => e.path === "email").msg}</small>
            )}
          </label>

          <label>
            Contraseña
            <input
              required
              type="password"
              value={values.contrasena}
              onChange={(e) => setValues({ ...values, contrasena: e.target.value })}
              aria-invalid={errores && errores.some((e) => e.path === "contrasena")}
            />
            {errores && errores.some((e) => e.path === "contrasena") && (
              <small>{errores.find((e) => e.path === "contrasena").msg}</small>
            )}
          </label>
        </fieldset>
        <input type="submit" value="Crear una cuenta" />
      </form>
      <p>¿Ya tienes una cuenta? <Link to="/ingresar">Inicia sesión aquí</Link></p>
    </article>
  );
};
