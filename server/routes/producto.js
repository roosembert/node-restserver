const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

let Producto = require('../models/producto');

// Obtener todos los productos

app.get('/productos', verificaToken, (req, res) => {
   let desde = req.query.desde || 0;
   desde = Number(desde);

   let limite = req.query.limite || 10;
   limite = Number(limite);
   // usuario y categoria populate, paginado
   Producto.find({disponible:true})
      .populate('usuario', 'nombre email')
      .populate('categoria', 'nombre')
      .skip(desde)
      .limit(limite)
      .exec( (err, productoDB) => {
         if (err) {
            return res.statu(500).json({
               ok: false,
               err
            });
         }

         res.json({
            ok: true,
            productoDB
         })
      });
});

// Obtener producto por id
// usuario y categoria populate
app.get('/productos/:id', verificaToken, (req, res) => {

   let id = req.params.id;

   Producto.findById(id)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'nombre')
      .exec( (err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err
            });
         }
         if (!productoDB) {
            return res.status(500).json({
               ok: false,
               err: {
                  message: 'producto no encontrado'
               }
            });
         }
         res.json({
            ok: true,
            productoDB
         })
      });
});

// buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) =>{

   let termino = req.params.termino;

   let regex = new RegExp(termino, 'i');

   Producto.find({nombre:regex})
   .populate('categoria', 'nombre')
   .exec((err, productos) => {
      if (err) {
         return res.status(500).json({
            ok:false,
            err
         });
      }
      res.json({
         ok:true,
         productos
      })
   });
});


// Crear producto (guardar ususario y categoria )

app.post('/productos', verificaToken, (req, res) => {
   let body = req.body;
   let idUsuario = req.usuario._id;
   let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      categoria: body.categoria,
      usuario: idUsuario
   });
   producto.save( (err, productoDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!productoDB) {
         return res.status(400).json({
            ok: false,
            err
         });
      }

      res.status(201).json({
         ok: true,
         productoDB
      })
   });
});

// Actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
   let id = req.params.id;
   let body = req.body;

   Producto.findByIdAndUpdate(id, body, {new: true}, (err, productoDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!productoDB) {
         return res.status(500).json({
            ok: false,
            err: {
               message: 'El producto no existe'
            }
         });
      }
      res.json({
         ok: true,
         productoDB
      });
   });
});

// Borrar producto (cambiar estado =>  disponible = false)
app.delete('/productos/:id', verificaToken, (req, res) => {
   let id = req.params.id;
   Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err
         });
      }
      if (!productoDB) {
         return res.status(500).json({
            ok: false,
            err: {
               message: 'El producto no existe'
            }
         });
      }
      res.json({
         ok: true,
         message: 'Se ha cambiado el status a indisponible'
      });
   });
});

module.exports = app;
