require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Referencia al usuario.js

app.use(require('./rutas/usuario.js'));
// Conexión a mongoose

// Conecta la base de datos con mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true}, (err, res) => {
    if(err) throw error;
    console.log('Base de datos online');
});

// El servidor está escuchando
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});




