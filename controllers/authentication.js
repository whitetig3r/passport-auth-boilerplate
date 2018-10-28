const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function getToken( user ){
    const timestamp = new Date().getTime();
    //create a token using userID and config secret
    return jwt.encode( { sub: user.id, iat: timestamp }, config.secret); 
}

//signin helper
exports.signin = function (req, res, next) {
    res.send({ token: getToken(req.user)})
}

//signup helper
exports.signup = function(req, res, next ){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, (err, existingUser) => {
        if(err){
            return next(err);
        }
        if(existingUser){
            return res.status(422).send({ error: "email is in use"});
        }
        
        const user = new User({
            email : email,
            password : password
        })

        user.save((err)=>{
            if(err) {
                return next(err);
            }
            res.json( {token: getToken(user)} );
        });
    })
    
}