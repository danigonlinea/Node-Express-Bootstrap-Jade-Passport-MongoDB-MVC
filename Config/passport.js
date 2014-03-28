


/*function findById(id, fn) {
 var idx = id - 1;
 if (users[idx]) {
 fn(null, users[idx]);
 } else {
 fn(new Error('User ' + id + ' does not exist'));
 }
 }

 function findByUsername(username, fn) {
 for (var i = 0, len = users.length; i < len; i++) {
 var user = users[i];
 if (user.username === username) {
 return fn(null, user);
 }
 }
 return fn(null, null);
 }*/

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        //done(null, user.id);
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
        /*User.findById(id, function (err, user) {
         done(err, user);
         });*/
    });


    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {

            console.log('Registrando...');

            process.nextTick(function () {
                User.findOne({ 'name' :  username }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        var newUser = new User();
                        newUser.name    = username;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                })
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // esto es para permitir el mensaje
    },function(req, username, password, done) {

        console.log('Logueando...');
            User.findOne({ 'name' :  username }, function (err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            return done(null, user);
        });
    }));

}