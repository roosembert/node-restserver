const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, resp) => {

   let body = req.body;

   Usuario.findOne({email : body.email }, (err,usuarioDB) => {

      if(err){
         return resp.status(500).json({
            ok:false,
            err
         });
      }
      if (!usuarioDB) {
         return resp.status(400).json({
            ok:false,
            err:{
               message: '(Usuario) y contraseña incorrectos'
            }
         });
      }

      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
         return resp.status(400).json({
            ok:false,
            err:{
               message: 'Usuario y (contraseña) incorrectos'
            }
         });
      }

      let token = jwt.sign({
         usuario: usuarioDB
      }, process.env.SEED, {expiresIn:  process.env.CADUCIDAD_TOKEN});

      resp.json({
         ok: true,
         usuario:usuarioDB,
         token
      });

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
  const userid = payload['sub'];

  return {
     nombre: payload.name,
     email: payload.email,
     img: payload.picture,
     google: true,
  }

}

app.post('/google', async (req, resp) => {

   let token = req.body.idtoken;

   let googleUser = await verify(token)
      .catch(e => {
         return resp.status(403).json({
            ok:false,
            err: e
         })
      });

   Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
      if (err) {
         return resp.status(500).json({
            ok: false,
            err
         });
      };

      if (usuarioDB) {

         if (usuarioDB.google === false) {
            return resp.status(400).json({
               ok: false,
               err: {
                  message: 'debe de usar su autenticación normal'
               }
            });
         }else {
            let token = jwt.sign({
               usuario: usuarioDB
            }, process.env.SEED, {expiresIn:  process.env.CADUCIDAD_TOKEN});

            return resp.json({
               ok: true,
               usuario: usuarioDB,
               token
            });

         }
      }else {

         // usuario no existe, primera autenticacion

         let usuario = new Usuario();

         usuario.nombre = googleUser.nombre;
         usuario.email = googleUser.email;
         usuario.img = googleUser.img;
         usuario.google = true;
         usuario.password = ':)';

         usuario.save( ( err, usuarioDB) => {
            
            if(err){
               return resp.status(200).json({
                  ok: true,
                  usuario: usuarioDB,
                  token
               });
            };

            let token = jwt.sign({
               usuario: usuarioDB
            }, process.env.SEED, {expiresIn:  process.env.CADUCIDAD_TOKEN});

            return resp.json({
               ok: true,
               usuario: usuarioDB,
               token
            });

         });
      }
   });

});


module.exports = app;
