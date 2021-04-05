const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: Number,
        default: 0
    },
    creado: {
        type: Date,
        default: Date.now
    },
    sesion: {
        type: Date
    },
    enable: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);