
// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NOD_ENV = process.env.NOD_ENV || 'dev';


//  DB

let urlDB;

if (process.env.NOD_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/cafe';
}else {
   urlDB = 'mongodb://coffeebons-user:qwerty123@ds143143.mlab.com:43143/coffeebons';
}


process.env.URLDB = urlDB;
