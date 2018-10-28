const Authentication = require('./controllers/authentication');
const passportServices = require('./services/passport');
const passport = require('passport');

//middleware
const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', { session: false});

// route handlers
module.exports = function(app) {

    app.get('/', requireAuth, function(req, res) {
        res.send({ hello: 'HELLO THERE!'} );
    })

    app.post('/signin', requireSignin, Authentication.signin)

    app.post('/signup', Authentication.signup);
}