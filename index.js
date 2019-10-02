var mongoDB = require("./app/mongoDB/mongoDB");
var signUp_signIn = require('./app/signUp_In/signUp_signIn');
var images = require('./app/images/images');

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
const multer = require("multer");
var passport = signUp_signIn.passport;

const rimraf = require('rimraf');


const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploadsImg')
    },
    filename: (req, file, cb) => {   
        cb(null, Date.now() + file.originalname);
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
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoDB.testConnection();

/////////////////////////////////////////////////////////////////////////////
/////////////////////........Регистрация и вход..........////////////////////
/////////////////////////////////////////////////////////////////////////////
app.get('/signUp_signIn', (req, res, next) => {
    if (!req.isAuthenticated()) return next();

    res.redirect('/user');

}, (req, res) => {
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
app.post('/user', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    signUp_signIn.userUpdate(req.body, req.user, res);

    setTimeout(() => res.redirect("/user"), 1000);
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/signUp_signIn');
    })
});

app.get('/user', (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect('/signUp_signIn');

}, (req, res) => {
    images.getImage(req.user.login, (result) => {
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
app.post("/upload-image", (req, res) => {
    if (!req.body) return res.sendStatus(400);

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

/////////////Удаление изображений/////////////////
app.post("/delete-image", urlencodedParser, (req, res) => {      
    if (!req.body) return res.sendStatus(400);
    
    images.deleteImage(req.user.login, req.body.img);

    res.redirect("/user");
});
////////////////////////////////////////////////////


app.get('/', (req, res) => {
    images.getAllImage((result) => {
        res.render('Index', signUp_signIn.auth({
            err_setImage: req.flash('err_setImage'),
            images: result
        },
            req.user
        ));
    })
});

//////////////////Очистка баз данных, и удаление изображений
app.get('/clean', (req, res) => {
    mongoDB.clean();
    rimraf('./public/uploadsImg/*', () => { console.log('done'); });
    res.redirect('/');
});
//////////////////////////////////////////////////////////////

/////Обработка оставшихся запросов
app.get('*', (req, res) => {
    res.render('Pages/NoPage', signUp_signIn.auth(undefined, req.user));
});
///////////////////////

var server = app.listen(process.env.PORT || 1999, () => {
    console.log('Server up and running in %d ', server.address().port);
    console.log('Check: http://127.0.0.1:' + server.address().port);
});
