const mongoose = require('./mongoDB').mongoose;
const bCrypt = require('bcrypt-nodejs');

const Users = new mongoose.Schema({
    login: String,
    password: String
});

// Функция для получения хеша пароля
Users.methods.setPassword = (password) => {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

// Функция для проверки пароля
Users.methods.validatePassword = (password) => {
    return bCrypt.compareSync(password, this.password);
};

exports.Users = mongoose.model('Users', Users);