import { param, validationResult } from "express-validator";

export const validarId = param("id").isInt({ min: 1 }).withMessage("el id debe ser positivo");

export const verificarValidaciones = (req, res, next) => {
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    const errores = validacion.array();
    return res.status(400).json({ success: false, message: errores[0].msg });
  }
  next();
};
