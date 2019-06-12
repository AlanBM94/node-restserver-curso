const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../modelos/producto');

//---------Buscar productos-----------
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    // la 'i' es para que sea insensible a las mayusculas
    let regExp = new RegExp(termino, 'i')

    Producto.find({nombre: regExp})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });
});

// --------Obtener productos----------
app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos
    // populate: usuario categoría
    // paginado
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre correo')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
                
            });
        });


});

// --------Obtener producto por id----------
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBD){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });

    })
    .populate('usuario', 'nombre correo')
    .populate('categoria', 'descripcion')


});

// --------Crea un nuevo producto----------
app.post('/producto/:id', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = req.params.id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBD){
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        })
    });


});

// ------Actualiza un producto----------
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
    .populate('categoria')
    .populate('usuario')
    .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });


});

// ------Borrar un producto----------
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true, runValidators: true}, (err, productoBD) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: `El producto ${productoBD.nombre} ha sido deshabilitado`
        });
    });


});





module.exports = app;