const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id
        proyecto.grupo = req.usuario.grupo
        await proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

// Obtiene todos los proyectos según el grupo al que forma parte el usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ grupo: req.usuario.grupo });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer la info del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    
    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Sólo el creador de este proyecto puede modificarlo'})
        }

        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate(
            {_id: req.params.id }, 
            { $set: nuevoProyecto }, 
            { new: true }
        );        
        res.json({proyecto});

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor');
    }
};

exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        
        // Revisar si ese proyecto tiene tareas asociadas
        let tareas = await Tarea.find({ proyecto: proyecto._id })
    
        // Si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
    
        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Sólo el creador de este proyecto puede modificarlo'});
        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id : req.params.id })

        // Eliminar tareas asociadas a ese proyecto
        if(tareas !== 0) {
            await Tarea.deleteMany({ proyecto: proyecto._id })
        }
        res.json({ msg: 'Proyecto eliminado'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
