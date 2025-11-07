import express from "express";
import { body, param } from "express-validator";
import { db } from "./db.js";
import { verificarValidaciones, validarId } from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        v.id, 
        co.nombre as conductor_nombre, co.apellido as conductor_apellido,
        ve.marca as vehiculo_marca, ve.modelo as vehiculo_modelo, ve.patente as vehiculo_patente,
        v.origen, v.destino, v.fecha_salida, v.fecha_llegada, v.kilometros, v.observaciones
      FROM viajes v
      JOIN vehiculos ve ON v.vehiculo_id = ve.id
      JOIN conductores co ON v.conductor_id = co.id
      ORDER BY v.id ASC
    `);
    res.json({ success: true, viajes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener los viajes" });
  }
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.execute("SELECT * FROM viajes WHERE id=?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "viaje no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener el viaje" });
  }
});

router.post("/", [
    body("vehiculo_id").isInt({ min: 1 }).withMessage("el id de vehiculo debe ser positivo"),
    body("conductor_id").isInt({ min: 1 }).withMessage("el id de conductor debe ser positivo"),
    body("fecha_salida").notEmpty().withMessage("la fecha de salida es obligatoria").bail().isISO8601().withMessage("la fecha de salida no es valida"),
    body("fecha_llegada").notEmpty().withMessage("la fecha de llegada es obligatoria").bail().isISO8601().withMessage("la fecha de llegada no es valida"),
    body("origen").trim().notEmpty().withMessage("el origen es obligatorio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("origen solo puede usar letras y espacios"),
    body("destino").trim().notEmpty().withMessage("el destino es obligatorio").bail().isAlpha('es-ES', { ignore: ' ' }).withMessage("destino solo puede usar letras y espacios"),
    body("kilometros").notEmpty().withMessage("los kilometros son obligatorios").bail().isDecimal().withMessage("los kilometros tienen que ser un numero"),
    body("observaciones").optional().isString().trim().isLength({ max: 45 }).withMessage("las observaciones no deben exceder los 45 caracteres"),
    body('fecha_llegada').custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fecha_salida)) { throw new Error("la fecha de llegada no puede ser anterior a la fecha de salida"); } return true;
    }),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;
    try {
      
      const [vehiculoExistente] = await db.execute("SELECT id FROM vehiculos WHERE id = ?", [vehiculo_id]);
      if (vehiculoExistente.length === 0) {
        return res.status(400).json({ success: false, message: 'el vehiculo no existe' });
      }

      const [conductorExistente] = await db.execute("SELECT id FROM conductores WHERE id = ?", [conductor_id]);
      if (conductorExistente.length === 0) {
        return res.status(400).json({ success: false, message: 'el conductor no existe' });
      }

      const [result] = await db.execute(
        "INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?,?,?,?,?,?,?,?)",
        [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones]
      );
      res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "error al crear el viaje" });
    }
  }
);

const validarVehiculoId = param("vehiculo_id").isInt({ min: 1 }).withMessage("el id de vehiculo no es valido");
const validarConductorId = param("conductor_id").isInt({ min: 1 }).withMessage("el id de conductor no es valido");

router.get("/vehiculo/:vehiculo_id", validarVehiculoId, verificarValidaciones, async (req, res) => {
  const vehiculo_id = Number(req.params.vehiculo_id);
  try {
    const [rows] = await db.execute("SELECT * FROM viajes WHERE vehiculo_id=?", [vehiculo_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "no se encontraron viajes para este vehiculo" });
    }
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener los viajes" });
  }
});

router.get("/conductor/:conductor_id", validarConductorId, verificarValidaciones, async (req, res) => {
  const conductor_id = Number(req.params.conductor_id);
  try {
    const [rows] = await db.execute("SELECT * FROM viajes WHERE conductor_id=?", [conductor_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "no se encontraron viajes para este conductor" });
    }
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al obtener los viajes" });
  }
});

router.get("/kilometros/vehiculo/:vehiculo_id", validarVehiculoId, verificarValidaciones, async (req, res) => {
  const vehiculo_id = Number(req.params.vehiculo_id);
  try {
    const [rows] = await db.execute(
      "SELECT SUM(kilometros) AS total_kilometros FROM viajes WHERE vehiculo_id=?",
      [vehiculo_id]
    );
    if (rows.length === 0 || rows[0].total_kilometros === null) {
      return res.status(404).json({
        success: false,
        message: "no se encontraron viajes para este vehiculo o no hay kilometros registrados",});
    }
    res.json({ success: true, data: { total_kilometros: rows[0].total_kilometros } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al calcular los kilometros totales" });
  }
});

router.get("/kilometros/conductor/:conductor_id", validarConductorId, verificarValidaciones, async (req, res) => {
  const conductor_id = Number(req.params.conductor_id);
  try {
    const [rows] = await db.execute(
      "SELECT SUM(kilometros) AS total_kilometros FROM viajes WHERE conductor_id=?",
      [conductor_id]
    );
    if (rows.length === 0 || rows[0].total_kilometros === null) {
      return res.status(404).json({
        success: false,
        message: "no se encontraron viajes para este conductor o no hay kilometros registrados",
      });
    }
    res.json({ success: true, data: { total_kilometros: rows[0].total_kilometros } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "error al calcular los kilometros totales" });
  }
});

export default router;
