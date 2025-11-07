import express from "express";
import { conectarDB } from "./db.js";
import VehiculosRoutes from "./vehiculos.js";
import ConductoresRoutes from "./conductores.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());

app.use("/vehiculos", VehiculosRoutes);
app.use("/conductores", ConductoresRoutes);


app.get("/", (req, res) => {
  
  res.send("Hola mundo!");
});

app.listen(port, () => {
    console.log(`La app esta funcionando en el puerto ${port}`);
})