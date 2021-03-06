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

process.env.CADUCIDAD_TOKEN = '48h';

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

let urlDb;

if(process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe'
}else{
    urlDb = ' mongodb+srv://AlanBM94:BmXB2blz1mAUrPFq@cluster0-0zbmm.mongodb.net/cafe';
}
process.env.URLDB = urlDb;


// ---------------------------
// -----GOOGLE CLIENT ID------
// ---------------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || '505984045392-ak34mhrpetthf8i3qa98sfqsq8uti0d4.apps.googleusercontent.com';

