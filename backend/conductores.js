import express from "express";
import { body } from "express-validator";
import { db } from "./db.js";
import { verificarValidaciones, validarId } from "./validaciones.js";
import { autenticacion} from "./auth.js";

const router = express.Router();

router.get("/",autenticacion, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM conductores");
    res.json({ success: true, conductores: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener los conductores" });
  }
});

router.get("/:id",autenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.execute("SELECT * FROM conductores WHERE id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Conductor no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener el conductor" });
  }
});

router.post("/", autenticacion, [
    body("nombre").trim().notEmpty().withMessage("el nombre es obligatorio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("nombre solo puede usar letras y espacios"),
    body("apellido").trim().notEmpty().withMessage("el apellido es obligatorio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("apellido solo puede usar letras y espacios"),
    body("dni").trim().notEmpty().withMessage("el dni es obligatorio").bail().isNumeric().withMessage("dni debe ser numerico"),
    body("licencia").trim().notEmpty().withMessage("la licencia es obligatoria").bail().isString().withMessage("licencia tiene que ser una cadena de texto"),
    body("vencimiento_licencia").notEmpty().withMessage("el vencimiento de la licencia es obligatorio").bail().isISO8601().withMessage("la fecha de vencimiento no es valida"),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, licencia, vencimiento_licencia } = req.body;
    try {
     
      const [dniExistente] = await db.execute("SELECT id FROM conductores WHERE dni = ?", [dni]);
      if (dniExistente.length > 0) {
        return res.status(400).json({ success: false, message: "el dni ya existe" });
      }

      const [result] = await db.execute(
        "INSERT INTO conductores (nombre, apellido, dni, licencia, vencimiento_licencia) VALUES (?,?,?,?,?)",
        [nombre, apellido, dni, licencia, vencimiento_licencia]
      );
      res.status(201).json({
        success: true,
        data: { id: result.insertId, ...req.body },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al crear el conductor" });
    }
  }
);

router.put("/:id",autenticacion, [
    validarId,
    body("nombre").optional().trim().notEmpty().withMessage("el nombre no puede estar vacio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("nombre solo puede usar letras y espacios"),
    body("apellido").optional().trim().notEmpty().withMessage("el apellido no puede estar vacio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("apellido solo puede usar letras y espacios"),
    body("dni").optional().trim().notEmpty().withMessage("el dni no puede estar vacio").bail().isNumeric().withMessage("dni debe ser numerico"),
    body("licencia").optional().trim().notEmpty().withMessage("la licencia no puede estar vacia").bail().isString().withMessage("licencia tiene que ser una cadena de texto"),
    body("vencimiento_licencia").optional().notEmpty().withMessage("el vencimiento de la licencia no puede estar vacio").bail().isISO8601().withMessage("la fecha de vencimiento no es valida"),
  ],
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni, licencia, vencimiento_licencia } = req.body;
    try {
      
      if (dni) {
        const [dniExistente] = await db.execute("SELECT id FROM conductores WHERE dni = ? AND id != ?", [dni, id]);
        if (dniExistente.length > 0) {
          return res.status(400).json({ success: false, message: "el dni ya existe" });
        }
      }

      const [result] = await db.execute(
          "UPDATE conductores SET nombre=?, apellido=?, dni=?, licencia=?, vencimiento_licencia=? WHERE id=?",
          [nombre, apellido, dni, licencia, vencimiento_licencia, id]
      );
      if (result.length === 0) {
          return res.status(404).json({ success: false, message: "conductor no encontrado" });
      }
      res.json({ success: true, data: { id, ...req.body } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al actualizar el conductor" });
    }
});

router.delete("/:id",autenticacion, validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    try {
      
      const [viajesAsociados] = await db.execute("SELECT id FROM viajes WHERE conductor_id = ?", [id]);

      if (viajesAsociados.length > 0) {
        return res.status(400).json({ success: false, message: "no se puede eliminar el vehiculo.Tiene viajes asociados" });
      }

      const [result] = await db.execute("DELETE FROM conductores WHERE id=?", [id]);
      if (result.length === 0) {
          return res.status(404).json({ success: false, message: "conductor no encontrado" });
      }
      res.json({ success: true, message: "conductor eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al eliminar el conductor" });
    }
});

export default router;
