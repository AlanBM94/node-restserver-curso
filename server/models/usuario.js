const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es válido'
}

let Schema = mongoose.Schema;


// Se hace una colección llamada usuarioSchema (una colección es una tabla de una BD)
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    imagen: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Hace que el password no se muestre en el JSON
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// Valida que el correo tiene que ser único
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);