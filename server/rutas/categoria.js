const express = require('express');
const app = express();
let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');
const Categoria = require('../modelos/categoria');


// Muestra todas las categorías
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        //Ordena los resultados
        .sort('descripcion') 
        // Muestra que id's hay en esa solicitud y carga la información
        .populate('usuario', 'nombre correo')
        .exec((err, categorias) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        });
});


// Muestra una categoría por el id
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBD){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });
});

// Crea una nueva categoría
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBD){
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});


// Modifica una categoría
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descripcionCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descripcionCategoria, {new: true, runValidators: true}, (err, categoriaBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaBD){
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});

// Modifica una categoría
app.delete ('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaBD){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada'
        })
    });

});


module.exports = app;


