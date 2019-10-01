const mongoose = require('mongoose');
exports.mongoose = mongoose;

const Users = require('../mongoDB/model_user').Users;
const Images = require('../mongoDB/model_images').Images;

exports.testConnection =  () => {
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

    var connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', function () {
        // we're connected!
    });
}

exports.clean =  () => {
    Users.remove(function(err, result){
        mongoose.disconnect();
         
        if(err) return console.log(err);
         
        console.log(result);
    });
    Images.remove(function(err, result){
        mongoose.disconnect();
         
        if(err) return console.log(err);
         
        console.log(result);
    });
}
