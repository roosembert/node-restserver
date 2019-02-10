const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = (req, resp, next) =>{

   let token = req.get('token');

   jwt.verify(token, process.env.SEED, (err, decoded) => {

      if (err) {
         return resp.status(401).json({
            ok: false,
            err:{
               message: 'token no valido'
            }
         });
      }

      req.usuario = decoded.usuario;

      next();
   });


};

// Verifica admin role

let verificaAdmin_Role = (req, resp, next) => {

   let usuario = req.usuario;
   if (usuario.role != 'ADMIN_ROLE') {
      return resp.status(401).json({
         ok: false,
         err: {
            message: 'no tienes permiso para realziar esta acción'
         }
      });
   }

      next();

};

module.exports = {
   verificaToken,
   verificaAdmin_Role
};
