import express from "express";
import { conectarDB } from "./db.js";
import VehiculosRoutes from "./routes/vehiculos.routes.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());

app.use("/vehiculos", VehiculosRoutes);

app.get("/", (req, res) => {
  
  res.send("Hola mundo!");
});

app.listen(port, () => {
    console.log(`La app esta funcionando en el puerto ${port}`);
})