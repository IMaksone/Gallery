const Images = require('../mongoDB/model_images').Images;

exports.setImage = function (login, name, description, link) {
    var newImg = new Images();

    newImg.login = login;
    newImg.name = name;
    newImg.description = description;
    newImg.link = link;
    console.log(newImg);

    // сохранения изображения
    newImg.save(function (err) {
        if (err) {
            console.log('Error in Saving img: ' + err);
            throw err;
        }
        console.log('Img save');
    });
}

exports.getImage = function (login, callback) {
    Images.find({ 'login': login }).exec((err, imgs) => {
        if (err) {
            console.log('Error in getImage: ' + err);
        } else if (imgs) {
            callback(imgs);
        } else {
            callback("");
        }
    });
}

exports.changeImage = function (login, name, description) {
    Images.findOne({ 'name': name, 'login': login }, function (err, user) {
        if (err) {
            console.log('Error in setImage: ' + err);
        } else if (img) {
            img.changeImage(name, description);

        } else {
            console.log('Изображение не найдено');
        }
    });
}

exports.deleteImage = function (login, name) {
    Images.deleteOne({ 'name': name, 'login': login }, function (err) {
        if (err) console.log("Error deleteImage: " + err)
    });
}