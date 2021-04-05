// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesión
// api/auth
router.post('/', 
    [
        check('email', 'Debe agregar un email válido').isEmail(),
        check('email', 'El email es obligatorios').not().isEmpty(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6}),
        check('password', 'El password es obligatorios').not().isEmpty()
    ],
    authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router