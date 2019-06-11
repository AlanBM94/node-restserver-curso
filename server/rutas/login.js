const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../modelos/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({correo: body.correo}, (err, usuarioBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioBD){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        
        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })
    });

});

// Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        correo: payload.email,
        imagen: payload.picture,
        google: true
    };
  };
//   verify().catch(console.error);

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({correo: googleUser.correo}, (err, usuarioBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(usuarioBD){
            // Si no se ha autenticado mediante google tiene que mandar el mensaje de 'Debe de usar su autenticación normal'
            if(usuarioBD.google === false){
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
                // Si se ha autenticado por google renueva el token
            }else{
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            }
            // Si el usuario no existe en la base de datos
        }else{
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.correo = googleUser.correo;
            usuario.imagen = googleUser.imagen;
            usuario.google = true;
            usuario.password = ':)';
            console.log(googleUser);
            usuario.save((err, usuarioBD) => {
                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            });
        }

    });
});




module.exports = app;