const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva tarea 
exports.crearTarea = async (req, res) => {

    // Revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    try {

        // Extraer el proyecto
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).send('Proyecto no encontrado');
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });


    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// Obtiene las tareas por poryecto
exports.obtenerTareas = async (req, res) => {
    
    try {

        // Extraer el proyecto
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).send('Proyecto no encontrado');
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Obtener las  tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({ tareas });


    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {

        // Extraer el proyecto
        const { proyecto, nombre, estado } = req.body;

        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea) {
            return res.status(404).send('La tarea no existe');
        }

        // Extarer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Crearun objeto con la nueva infroamcion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id }, {$set: nuevaTarea}, {new: true});
        res.json({ tarea });

    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {

        // Extraer el proyecto
        const { proyecto } = req.query;

        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea) {
            return res.status(404).send('La tarea no existe');
        }

        // Extarer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Tarea eliminada'});

    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}



