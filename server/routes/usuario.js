const express = require('express');

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function (req, res) {

   let desde = req.query.desde ||  0;
   desde = Number(desde);

   let limite = req.query.limite || 5;
   limite = Number(limite);
   let activo = {estado:true};
   Usuario.find(activo, 'nombre email role estado google img')
      .skip(desde)
      .limit(limite)
      .exec((err, usuarios) => {
         if(err) {
            return res.status(400).json({
               ok:false,
               err
            });
         }

         Usuario.count(activo, (err, conteo) => {
            res.json({
               ok: true,
               usuarios,
               conteo
            });
         });

      });

  // res.json('get usuario local');
});

app.post('/usuario', function (req, res) {
   let body = req.body;
   let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role
   });

   usuario.save((err, usuarioDB) => {
      if(err) {
         return res.status(400).json({
            ok:false,
            err
         });
      }

      // usuarioDB.password = null;

      res.json({
         ok: true,
         usuario: usuarioDB
      });
   });
});

app.put('/usuario/:id', function (req, res) {
   let id = req.params.id;
   let body = req.body;

   Usuario.findByIdAndUpdate(id, body, {new: true} ,(err, usuarioDB) => {

      if (err) {
         return res.status(400).json({
            ok:false,
            err
         });
      }

      res.json({
         ok:true,
         usuario: usuarioDB
      });
   });

});

app.put('/usuario/estado/:id', function (req, res) {
   let id = req.params.id;
   let update = {estado: false};
   Usuario.findByIdAndUpdate(id, update,{new: true}, (err, usuarioDB) => {

      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         usuario: 'estatus cambiado'
      });

   });

});

app.delete('/usuario/:id', function (req, res) {

   let id = req.params.id;

   Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
      if (err) {
         return res.status(400).json({
            ok:false,
            err
         });
      }
      if (!usuarioBorrado) {
         return res.status(400).json({
            ok:false,
            err:{
               message: 'usuario no encontrado'
            }
         });
      }
      res.json({
         ok: true,
         usuario: usuarioBorrado
      })
   });

});

module.exports = app;
