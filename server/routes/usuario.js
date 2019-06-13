const express = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/usuario');
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');


// Obtener registros 
// --verificaToken es el middleware
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
        Usuario.find({estado: true}, 'nombre correo role estado google imagen')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
                
            });
        });
});

// Crear nuevos registros
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    
    // Guarda el usuario en la base de datos
    usuario.save((err, usuarioDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }
        
        // usuarioDB.password = null;
        
        res.json({
            ok: true,
            usuario: usuarioDB
        })
        
    });
    
});

// Actualizar registros
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    // Estos son los campos que va a aceptar
    let body = _.pick(req.body, ['nombre', 'correo', 'imagen', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


// Cambia el estado de registro para que no esté disponible
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    //  ----------------Borra el registro totalmente de la base de datos----------
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if(err){
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
        
    //     if(!usuarioBorrado){
    //         res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });

    //     }
        
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // });
});


module.exports = app;