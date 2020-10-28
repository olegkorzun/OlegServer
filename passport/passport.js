const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { KnexDataService } = require('../services/KnexDataService');
const knexDataService = new KnexDataService();
const bcrypt = require('bcrypt');
//jwt
let jwt = require('jsonwebtoken');
let config = require('./config');


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, (username, password, done) => {
    knexDataService.findUserOne(username, (rows) => {
        if (!rows.length) {
            return done(null, false);
        }
        if (rows[0].status != '1') {
            return done(null, false);
        }
        if (bcrypt.compareSync(password, rows[0].password)) {
            let token = jwt.sign({ username: username },
                config.secret, { expiresIn: '24h' }); // expires in 24 hours

            // return the JWT token for the future API calls
            let user = {
                success: true,
                message: 'Authentication successful!',
                token: token,
                user: rows[0],
            };
            //return done(null, rows[0]);
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));

module.exports = passport;