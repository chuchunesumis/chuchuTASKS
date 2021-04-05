const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }

    // extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que el usuario registrado sea único
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'Este email ya está en uso'})
        }
        // crear el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // 24h adicionales a la fecha de hoy para almacenar el tiempo de caducidad de la sesión
        usuario.sesion = Math.floor(Date.now() + 86400000);
        
        // guardar usuario
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: '24h'
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmación
            res.json({ token });
        });

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error'});
    }
}