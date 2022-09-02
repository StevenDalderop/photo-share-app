/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require("mongoose");

// create a schema
var userSchema = new mongoose.Schema({
    first_name: {
        type: String, // First name of the user.
        required: true
    },
    last_name: {
        type: String,  // Last name of the user.
        required: true
    },
    location: String,    // Location  of the user.
    description: String,  // A brief user description
    occupation: String,    // Occupation of the user.
    login_name: {
        type: String,
        required: true
    },
    password_digest: {
        type: String,
        required: true, 
        select: false
    }, 
    salt: {
        type: String, 
        required: true,
        select: false
    }
});


// the schema is useless so far
// we need to create a model using it
const User = mongoose.model('User', userSchema);


userSchema.path('login_name').validate(async (name) => {
    console.log('validating');
    try {
        let user = await User.findOne({login_name: name});
        if (user) {
            return false;
        }
        return true;       
    } catch (error) {
        return false;
    }
}, 'Login name already exists');


// make this available to our users in our Node applications
module.exports = User;
