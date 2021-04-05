const Grupo = require('../models/Grupo')
const { validationResult } = require('express-validator');

// Crear nuevo grupo
exports.crearGrupo = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // Crear un nuevo proyecto
        const grupo = new Grupo(req.body);

        // Guardar el creador via JWT
        grupo.creador = req.usuario.id
        await grupo.save();
        res.json(grupo);

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

// Obtiene todos los grupos
exports.obtenerGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.find({});
        res.json({ grupos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualiza un proyecto
exports.actualizarGrupo = async (req, res) => {
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer la info del proyecto
    const { nombre } = req.body;
    const nuevoGrupo = {};
    
    if(nombre) {
        nuevoGrupo.nombre = nombre;
    }

    try {
        // Revisar el ID
        let grupo = await Grupo.findById(req.params.id);

        // Si el grupo existe o no
        if(!grupo) {
            return res.status(404).json({msg: 'Grupo no encontrado'})
        }

        // Verificar el creador del grupo
        if(grupo.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Sólo el creador de este grupo puede modificarlo'})
        }

        // Actualizar
        grupo = await Grupo.findByIdAndUpdate(
            {_id: req.params.id }, 
            { $set: nuevoGrupo }, 
            { new: true }
        );        
        res.json({grupo});

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor');
    }
};

exports.eliminarGrupo = async (req, res) => {
    try {
        // Revisar el ID
        let grupo = await Grupo.findById(req.params.id);
    
        // Si el grupo existe o no
        if(!grupo) {
            return res.status(404).json({msg: 'Grupo no encontrado'})
        }
    
        // Verificar el creador del grupo
        if(grupo.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Sólo el creador de este grupo puede modificarlo'});
        }

        // Eliminar el grupo
        await Grupo.findOneAndRemove({ _id : req.params.id })
        res.json({ msg: 'Grupo eliminado'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
