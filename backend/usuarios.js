import express from "express";
import { db } from "./db.js";
import { verificarValidaciones, validarId } from "./validaciones.js";
import { autenticacion } from "./auth.js";
import bcrypt from "bcrypt";
import { body } from "express-validator";

const router = express.Router();

router.get("/", autenticacion, async (req, res) => {
  const [usuarios] = await db.execute(
    "SELECT id, nombre, email FROM usuarios"
  );
  res.json({ success: true, usuarios });
});

router.get("/:id", autenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  const [usuarios] = await db.execute(
    "SELECT id, nombre, email FROM usuarios WHERE id = ?",
    [id]
  );

  if (usuarios.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado" });
  }

  res.json({ success: true, usuario: usuarios[0] });
});

router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("El email no es válido"),
    body("contrasena")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero."
      ),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contrasena } = req.body;
    try {
      
      const [existingUser] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ? OR nombre = ?",
        [email, nombre]
      );

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "El email o nombre de usuario ya esta en uso." });
      }

      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const [resultado] = await db.execute(
        "INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword]
      );

      res.status(201).json({
        success: true,
        data: { id: resultado.insertId, nombre, email },
        message: "Usuario creado exitosamente",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear el usuario." });
    }
  }
);

router.put(
  "/:id",
  autenticacion,
  validarId,
  [
    body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
    body("email").optional().isEmail().withMessage("El email no es válido"),
    body("contrasena")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero."
      ),
  ],
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email, contrasena } = req.body;

    try {
      if (email || nombre) {
        const [existingUser] = await db.execute(
          "SELECT * FROM usuarios WHERE (email = ? OR nombre = ?) AND id != ?",
          [email, nombre, id]
        );
        if (existingUser.length > 0) {
          return res.status(400).json({ success: false, message: "El email o nombre de usuario ya esta en uso." });
        }
      }

      const hashedPassword = await bcrypt.hash(contrasena || "", 10);

      await db.execute("UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id = ?", [nombre, email, hashedPassword, id]);

      res.json({ success: true, message: "Usuario actualizado exitosamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar el usuario." });
    }
  }
);

router.delete("/:id", autenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  const [usuarios] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
    id,
  ]);

  if (usuarios.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado" });
  }

  await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);

  res.json({ success: true, message: "Usuario eliminado exitosamente" });
});

export default router;