const mongoose = require('./mongoDB').mongoose;
const bCrypt = require('bcrypt-nodejs');


const Users = new mongoose.Schema({
    login: String,
    password: String
});

Users.methods.setPassword = function (password) {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

Users.methods.validatePassword = function (password) {
    return bCrypt.compareSync(password, this.password);
};

exports.Users = mongoose.model('Users', Users);