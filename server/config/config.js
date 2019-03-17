
// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// vencimiento del token
// 60(seg) * 60(min) * 24(hrs) * 30(days)

process.env.CADUCIDAD_TOKEN = '48h';

// SEED de autenticación

process.env.SEED = process.env.SEED || 'secret-desarrollo';

//  DB

let urlDB;

if (process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/cafe';
}else {
   urlDB = process.env.MONGO_URI;
}



process.env.URLDB = urlDB;


// Google client id

process.env.CLIENT_ID = process.env.CLIENT_ID || '793030895504-chbtptgrpkrv87rlbn5cfcu9o3b5ti5v.apps.googleusercontent.com';
