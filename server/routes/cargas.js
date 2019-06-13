const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// Todo lo que se suba lo coloca en '/upload'
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if(!req.files){
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha subido ningún archivo'
                }
            });
    }
    // Valida el tipo de archivo
    let tiposPermitidos = ['usuario', 'producto'];
    if(tiposPermitidos.indexOf(tipo) < 0){
        res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposPermitidos.join(', ')}`,
                tipo
            }
        })
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // Extensiones permitidas
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
    if(extensionesPermitidas.indexOf(extension) < 0 ){
        res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesPermitidas.join(', ')}`,
                ext: extension
            }
        })
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if(err){
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }
        // Aquí la imagen ya está cargada
        if(tipo === 'usuario'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }

    });

});
// Sube la imagen del usuario
function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioBD) => {
        if(err){
            // Si hay un error elimina la imagen que se subio
            borraArchivo(nombreArchivo, 'usuario');
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioBD){
            // Si el usuario de la BD no existe elimina la imagen
            borraArchivo(nombreArchivo, 'usuario');
            res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario ${usuarioBD} no existe en la base de datos`
                }
            });
        }
        // Elimina la imagen para que no se repita
        borraArchivo(usuarioBD.imagen, 'usuario');
        usuarioBD.imagen = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

// Sube la imagen del producto
function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoBD) => {
        if(err){
            // Si hay un error elimina la imagen que se subio
            borraArchivo(nombreArchivo, 'producto');
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoBD){
            // Si el producto de la BD no existe elimina la imagen
            borraArchivo(nombreArchivo, 'producto');
            res.status(400).json({
                ok: false,
                err: {
                    message: `El producto ${productoBD} no existe en la base de datos`
                }
            });
        }
        // Elimina la imagen para que no se repita
        borraArchivo(productoBD.imagen, 'producto');
        productoBD.imagen = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

// Función que elimina la imagen
function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}


module.exports = app;