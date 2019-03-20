const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = (req, res, next) =>{

   let token = req.get('token');

   jwt.verify(token, process.env.SEED, (err, decoded) => {

      if (err) {
         return res.status(401).json({
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

let verificaAdmin_Role = (req, res, next) => {

   let usuario = req.usuario;
   if (usuario.role != 'ADMIN_ROLE') {
      return res.status(401).json({
         ok: false,
         err: {
            message: 'no tienes permiso para realziar esta acción'
         }
      });
   }

   next();

};

// Verifica token para img

let verificaTokenImg = (req, res, next) => {
   let token = req.query.token;
   
   jwt.verify(token, process.env.SEED, (err, decoded) => {

      if (err) {
         return res.status(401).json({
            ok: false,
            err:{
               message: 'token no valido'
            }
         });
      }

      req.usuario = decoded.usuario;

      next();
   });

}


module.exports = {
   verificaToken,
   verificaAdmin_Role,
   verificaTokenImg
};
