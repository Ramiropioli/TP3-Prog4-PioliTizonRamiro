import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth"; 

export const Ingresar = () => {
  const { error, login } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(nombre, contrasena);
    if (result.success) {
      navigate("/"); 
    }
  };

  useEffect(() => {
    setOpen(true);
  }, []);
  const handleCancel = () => {
    setOpen(false); 
    navigate("/"); 
  };

  return (
    <>
      <dialog open={open}>
        <article>
          <h2>Ingrese nombre y contraseña</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label>Usuario:</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <label>Contraseña:</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>
            <footer>
              <div className="grid">
                <button type="button" className="secondary" onClick={handleCancel}>Cancelar</button>
                <button type="submit">Ingresar</button>
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};
