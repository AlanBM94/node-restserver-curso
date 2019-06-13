const jwt = require('jsonwebtoken');

// ----------Verificar token----------

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        
        req.usuario = decoded.usuario;
        next();
    });
};

// ----------Verificar admin role----------

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        res.json({
            ok: true,
            err: {
                message: 'El usuario no es el administrador'
            }
        })
    }
}

// ----------Verificar token para imagen----------

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}