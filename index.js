
var mongoDB = require("./app/mongoDB/mongoDB");
var signUp_signIn = require('./app/signUp_In/signUp_signIn');
var images = require('./app/images/images');

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
const multer = require("multer");
var passport = signUp_signIn.passport;


const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploadsImg')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

app.use(multer({storage:storage}).single("image"));


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 60 * 1000,
        httpOnly: false,
    }
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

mongoDB.testConnection();

/////////////////////////////////////////////////////////////////////////////
/////////////////////........Регистрация и вход..........////////////////////
/////////////////////////////////////////////////////////////////////////////
app.get('/signUp_signIn', function (req, res, next) {
    if (!req.isAuthenticated()) return next();

    res.redirect('/user');

}, function (req, res) {

    res.render('Pages/SignUp_signIn', signUp_signIn.auth({
        err_signIn: req.flash('err_signIn'), 
        err_signUp: req.flash('err_signUp')
    },
        req.user
    ));

});

app.post('/signUp', urlencodedParser, signUp_signIn.signUp()
);
app.post('/signIn', urlencodedParser, signUp_signIn.signIn()
);
app.post('/user', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    signUp_signIn.userUpdate(req.body, req.user, res);

    setTimeout(() => res.redirect("/user"), 1000);
    //res.render('Pages/Store', StoreBasketDB.getCatalog(req.body));
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/signUp_signIn');
    })
});

app.get('/user', function (req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect('/signUp_signIn');


}, function (req, res) {
    images.getImage(req.user.login, function(result) {
        res.render('Pages/User', signUp_signIn.auth({
            err_setImage: req.flash('err_setImage'),
            user: req.user,
            images: result
        },
            req.user
        ));
    })
    
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

/////////////Загрузка изображений/////////////////
app.post("/upload-image", function (req, res, next) {
    let filedata = req.file;
    console.log(filedata);
    if (!filedata)
        res.render('Pages/User', signUp_signIn.auth({
            err_setImage: "Ошибка при загрузке файла", 
            user: req.user 
        }, 
            req.user
        ));
    else {
        images.setImage(req.user.login, req.body.name, req.body.description, filedata.path);
    }
    res.redirect("/user");
});
////////////////////////////////////////////////////


app.get('/', function (req, res) {
    res.render('Index', signUp_signIn.auth(undefined, req.user));
});

app.get('*', function (req, res) {
    res.render('Pages/NoPage', signUp_signIn.auth(undefined, req.user));
});

var server = app.listen(process.env.PORT || 1999, function () {
    console.log('Server up and running in %d ', server.address().port);
    console.log('Check: http://127.0.0.1:' + server.address().port);
});
