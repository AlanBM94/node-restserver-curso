

const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

// Se hace una colección de las categorías
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoría es necesario']
    },
    usuario: {
        // Se ocupará el usuario del usuarioSchema
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

// Válida que la descripción tiene que ser única
// categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Categoria', categoriaSchema);