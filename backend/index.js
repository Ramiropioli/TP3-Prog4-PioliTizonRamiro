import express from "express";
import { conectarDB } from "./db.js";
import cors from "cors";
import VehiculosRoutes from "./vehiculos.js";
import ConductoresRoutes from "./conductores.js";
import ViajesRoutes from "./viajes.js";
import UsuariosRoutes from "./usuarios.js";
import AuthRoutes, { authConfig } from "./auth.js";
import passport from "passport";

conectarDB();

const app = express();
const port = 3000;

authConfig();
app.use(passport.initialize());
app.use(express.json());
app.use(cors()); 

app.use("/vehiculos", VehiculosRoutes);
app.use("/conductores", ConductoresRoutes);
app.use("/viajes", ViajesRoutes);
app.use("/usuarios", UsuariosRoutes);

app.use("/", AuthRoutes); 


app.get("/", (req, res) => {
  
  res.send("Hola mundo!");
});

app.listen(port, () => {
    console.log(`La app esta funcionando en el puerto ${port}`);
})