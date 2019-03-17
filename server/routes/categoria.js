const express  = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// Mostrar todas las categorias

app.get('/categoria', verificaToken, (req, res) => {

   Categoria.find({})
      .sort('nombre')
      .populate('idusuario', 'nombre email')
      .exec((err, categorias) => {
         res.json({
            ok: true,
            categorias
         })
      });

});

// Mostrar una categoria por ID
app.get('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

   let id = req.params.id;
   Categoria.findById( id, (err, categoriaDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!categoriaDB) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'Categoria no encontrada'
            }
         });
      }
      res.json({
         ok: true,
         categoria: categoriaDB
      });
   });
});

// Crear nueva categoria

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

   let body = req.body;
   let categoria = new Categoria({
      nombre: body.nombre,
      idusuario: req.usuario._id
   });
   console.log(categoria);

   categoria.save( (err, categoriaDB) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         categoria: categoriaDB
      })
   });
});


// Actualizar categoria

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

   let id = req.params.id;
   let body = req.body;

   Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaDB) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.json({
         ok: true,
         categoria: categoriaDB
      })
   })
});

// Eliminar categoria => Solo un administrador puede borrar la categoria

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
   let id = req.params.id;

   Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err
         });
      }
      if (!categoriaDB) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'categoria no encontrada'
            }
         });
      }
      res.json({
         ok: true,
         categoriaDB
      });
   });
});

module.exports = app;
