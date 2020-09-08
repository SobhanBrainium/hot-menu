const mongoose = require("mongoose")
const Admin = require("../schema/User")
const bcrypt = require("bcryptjs")
const LocalStrategy = require("passport-local")

module.exports = passport => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        Admin.findById(id)
            .then(user => {
                return done(null, user);
            });
    });

    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'emailOrUsername',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, emailOrUsername, password, done) => {
            var isValidPassword = function (userpass, password) {
                return bcrypt.compareSync(password, userpass);
            }
            Admin.findOne({userType : req.body.loginType, $or : [{email : emailOrUsername}, {username : emailOrUsername}]})
                .then(user => {
                    console.log(user,'user')
                    if(!user) {
                        return done(null, false, req.flash('loginMessage', 'Wrong Username or password or login type'));
                    }
                    if (!isValidPassword(user.password, password)) {
                        return done(null, false, req.flash('loginMessage', 'Wrong Username or password or login type'));
    
                    }
                    return done(null, user);
                })
                .catch(err => {
                    console.log(err,'err object')
                    return done(null, false, req.flash('loginMessage', 'Something wrong.Please try again.'));
                });
        })
    );
};