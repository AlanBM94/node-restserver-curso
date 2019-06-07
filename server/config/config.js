// ---------------------------
// -----------PUERTO----------
// ---------------------------

process.env.PORT = process.env.PORT || 3000;

// ---------------------------
// -----------ENTORNO---------
// ---------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ---------------------------
// -------------BD------------
// ---------------------------

let urlDb;

if(urlDb){
    urlDb = 'mongodb://localhost:27017/cafe'
}else{
    urlDb = 'mongodb+srv://AlanBM94:ioja7f9uIQ146cnn@cluster0-0zbmm.mongodb.net/cafe';
}


process.env.URLDB = urlDb;