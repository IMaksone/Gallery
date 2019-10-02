const Images = require('../mongoDB/model_images').Images;

// Функция сохранения в базу загруженных изображения
exports.setImage = (login, name, description, link) => {
    var newImg = new Images();

    newImg.login = login;
    newImg.name = name;
    newImg.description = description;
    newImg.link = link;
    console.log(newImg);

    // сохранения изображения
    newImg.save((err) => {
        if (err) {
            console.log('Error in Saving img: ' + err);
            throw err;
        }
        console.log('Img save');
    });
}

// Функция для получения всех изображений пользователя
exports.getImage = (login, callback) => {
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

// Функция изменения информации об изображении (имя и описание)
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

// Функция удаления одного изображения
exports.deleteImage =  (login, name) => {
    Images.deleteOne({ 'name': name, 'login': login }, function (err) {
        if (err) console.log("Error deleteImage: " + err)
    });
}

// Функция для получения всех изображений всех пользователей
exports.getAllImage = (callback) => {
    Images.find().exec((err, imgs) => {
        if (err) {
            console.log('Error in getImage: ' + err);
        } else if (imgs) {
            let imgArr = [];
            for (let i in imgs) {
                imgArr[i] = {
                    link: imgs[i].link,
                    name: imgs[i].name,
                    description: imgs[i].description,
                    login: imgs[i].login,
                } 
            }
            callback(imgArr);
        } else {
            callback("");
        }
    });    
}