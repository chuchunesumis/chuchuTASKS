const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController')
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea grupos
// api/grupos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    grupoController.crearGrupo
)
router.get('/',
    auth,
    grupoController.obtenerGrupos
),
// Actualizar grupo vía ID
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del grupo es obligatorio').not().isEmpty()
    ],
    grupoController.actualizarGrupo
);

// Eliminar un grupo
router.delete('/:id', 
    auth,
    grupoController.eliminarGrupo
);

module.exports = router;