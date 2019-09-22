const mongoose = require('mongoose');
exports.mongoose = mongoose;

exports.testConnection = function () {
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

    var connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', function () {
        // we're connected!
    });
}
