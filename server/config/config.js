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

// ---------------------------
// --SEED DE AUTENTICACIÓN----
// ---------------------------

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

let urlDb;

if(process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe'
}else{
    urlDb = process.env.MONGO_URII;
}


process.env.URLDB = urlDb;


