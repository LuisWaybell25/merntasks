const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    
    // Revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado

        let usuario = await Usuario.findOne({ email });

        if(!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' })
        }

        // Rvisar el password
        const pasCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!pasCorrecto) {
            return res.status(400).json({ msg: 'Password incorrecto' })
        }

        // Si todo es correcto crear y firmar el json web token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el json web token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            res.json({ token }); 
        });
        
    } catch(error) {
        console.log(error);
    }
}

// Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error' })
    }
}