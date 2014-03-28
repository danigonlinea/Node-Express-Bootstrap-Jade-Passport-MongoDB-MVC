/**
 * Created by daninux on 24/03/14.
 */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    name : String,
    password: String,
    age: String

});


// methods ======================
// generating a hash for encrypting password's users
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Return 0 si son iguales y otro valor en cualquier otro caso.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('usuarios', userSchema);

