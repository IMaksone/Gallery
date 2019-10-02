const mongoose = require('./mongoDB').mongoose;

const Images = new mongoose.Schema({
    login: String,
    name: String,
    description: String,
    link: String
});

// Функция для изменения имени и описания
Images.methods.changeImg = ( name, description) => {
    this.name = name;
    this.description = description;
};

exports.Images = mongoose.model('Images', Images);