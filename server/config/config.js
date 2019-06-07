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
    urlDb = process.env.MONGO_URI;
}


process.env.URLDB = urlDb;