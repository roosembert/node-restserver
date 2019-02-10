const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = app;
