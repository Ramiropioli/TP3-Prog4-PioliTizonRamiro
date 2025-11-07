import express from "express";
import { body, param } from "express-validator";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import passport from "passport";

const router = express.Router();

const validarId = param("id").isInt().withMessage("el id debe ser positivo");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM vehiculos");
    res.json({ success: true, vehiculos: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener los vehiculos" });
  }
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.execute("SELECT * FROM vehiculos WHERE id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "vehiculo no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener el vehiculo" });
  }
});

router.post("/", [
    body("marca").trim().notEmpty().withMessage("la marca es obligatoria").bail().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("marca solo puede usar letras, numeros y espacios"),
    body("modelo").trim().notEmpty().withMessage("el modelo es obligatorio").bail().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("modelo solo puede usar letras, numeros y espacios"),
    body("patente").trim().notEmpty().withMessage("la patente es obligatoria").bail().isAlphanumeric().withMessage("patente solo puede usar letras y numeros"),
    body("ano").notEmpty().withMessage("el año es obligatorio").bail().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("el año no es valido"),
    body("capacidad_carga").notEmpty().withMessage("la capacidad de carga es obligatoria").bail().isDecimal({ decimal_digits: '1,2' }).withMessage("la capacidad de carga tiene que se un numero con 2 decimales")
  ],
  verificarValidaciones,
  async (req, res) => {
    const { marca, modelo, patente, ano, capacidad_carga } = req.body;
    try {
      
      const [patenteExistente] = await db.execute("SELECT id FROM vehiculos WHERE patente = ?", [patente]);
      if (patenteExistente.length > 0) {
        return res.status(400).json({ success: false, message: "la patente ya existe" });
      }

      const [result] = await db.execute(
        "INSERT INTO vehiculos (marca, modelo, patente, ano, capacidad_carga) VALUES (?,?,?,?,?)",
        [marca, modelo, patente, ano, capacidad_carga]
      );
      res.status(201).json({
        success: true,
        data: { id: result.insertId, ...req.body },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al crear el vehiculo" });
    }
  }
);

router.put("/:id", [
    validarId,
    body("marca").optional().trim().notEmpty().withMessage("la marca no puede estar vacia").bail().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("marca solo puede usar letras, numeros y espacios"),
    body("modelo").optional().trim().notEmpty().withMessage("el modelo no puede estar vacio").bail().isAlphanumeric('es-ES', { ignore: ' ' }).withMessage("modelo solo puede usar letras, numeros y espacios"),
    body("patente").optional().trim().notEmpty().withMessage("la patente no puede estar vacia").bail().isAlphanumeric().withMessage("patente solo puede usar letras y numeros"),
    body("ano").optional().notEmpty().withMessage("el año no puede estar vacio").bail().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("el año no es valido"),
    body("capacidad_carga").optional().notEmpty().withMessage("la capacidad de carga no puede estar vacia").bail().isDecimal({ decimal_digits: '1,2' }).withMessage("la capacidad de carga tiene que se un numero con 2 decimales")
  ],
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { marca, modelo, patente, ano, capacidad_carga } = req.body;
    try {
     
      if (patente) {
        const [patenteExistente] = await db.execute("SELECT id FROM vehiculos WHERE patente = ? AND id != ?", [patente, id]);
        if (patenteExistente.length > 0) {
          return res.status(400).json({ success: false, message: "la patente ya existe" });
        }
      }

      const [result] = await db.execute(
          "UPDATE vehiculos SET marca=?, modelo=?, patente=?, ano=?, capacidad_carga=? WHERE id=?",
          [marca, modelo, patente, ano, capacidad_carga, id]
      );
      if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "vehiculo no encontrado" });
      }
      res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al actualizar el vehiculo." });
    } 
});

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    try {
      
      const [viajesAsociados] = await db.execute("SELECT id FROM viajes WHERE vehiculo_id = ?", [id]);

      if (viajesAsociados.length > 0) {
        return res.status(400).json({ success: false, message: "no se puede eliminar el vehiculo.Tiene viajes asociados" });
      }

      const [result] = await db.execute("DELETE FROM vehiculos WHERE id=?", [id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "vehiculo no encontrado" });
      }
      res.json({ success: true, message: "vehiculo eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al eliminar el vehiculo" });
    }
});

export default router;