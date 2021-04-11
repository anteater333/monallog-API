
const mongoose = require('mongoose');

const crypto = require('crypto');

const lineSchema = require('./lines').schema;
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userPassword_hashed: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true,
    },
    dateRegistered: {
        type: Date,
        index: {unique: false},
        default: Date.now
    },
    favorites: {
        type: Array,
        of: String,
    },
    lines: [lineSchema],
});

// plugins
const autoIncrement = require('mongoose-sequence')(mongoose);
userSchema.plugin(autoIncrement, {inc_field: 'userId'});

// virtual attributes
/**
 * Virtual password attribute
 */
userSchema.virtual('userPassword')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.userPassword_hashed = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    })

// static methods
userSchema.static('findAll', function(callback) {
    return this.find({ }, callback);
});

// methods
/**
 * make salt for encrypting password
 */
userSchema.method('makeSalt', function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
})

/**
 * encrypt given password
 */
userSchema.method('encryptPassword', function(plainText, inSalt) {
    if(inSalt) {
        return crypto.createHmac('sha512').update(plainText).digest('base64')
    } else {
        return crypto.createHmac('sha512', this.salt).update(plainText).digest('base64')
    }
})

/**
 * Authenticate by comparing given plain password with hashed password
 * return : bool
 */
userSchema.method('authenticate', function(password, inSalt, passwordHashed) {
    if (inSalt) {
        return this.encryptPassword(password, inSalt) === passwordHashed
    }
    else {
        return this.encryptPassword(password) === this.userPassword_hashed
    }
})

module.exports = mongoose.model('User', userSchema);