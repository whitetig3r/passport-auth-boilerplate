const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// our user schema
const userSchema = new Schema({
    email : { type: String, unique: true, lowercase: true},
    password : String
});

// sorta like middleware before a save happens to the DB
userSchema.pre('save', function(next){
    const user = this;
    bcrypt.genSalt(10, function(err, salt){
        if(err){ 
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
})

// all user-created helper methods in <schema>.methods.<your_method_name>
userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, isMatch);
        }
    })
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;