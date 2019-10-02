const Users = require('../mongoDB/model_user').Users;
const passport = require('passport');
exports.passport = passport;

const localStrategy = require('passport-local').Strategy;

//регистрация
exports.signUp = signUp = () => {
    passport.use('local-signup', new localStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback             
        },

        function (req, login, password, done) {
            if (password.length < 6) {
                done(null, false, req.flash('err_signUp', 'Пароль должен содержать минимум 6 символов'));
            } else {
                Users.findOne({ 'login': login }, (err, user) => {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    } else if (user) {
                        console.log('User already exists');
                        return done(null, false, req.flash('err_signUp', 'Пользователь с таким логином уже зарегистрирован'));
                    } else {
                        var newUser = new Users();
                        // установка локальных прав доступа пользователя
                        newUser.login = login;
                        newUser.setPassword(password);

                        // сохранения пользователя
                        newUser.save((err) => {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            }
        }
    ));

    //сериализация пользователя
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //десериализация пользователя 
    passport.deserializeUser((_id, done) => {
        Users.findById(_id).then((user) => {
            if (user) {
                done(null, user);
            } else {
                console.log("Error serializeUser:", err);
                done("Упс, неизвестная ошибка :(. Сайт будет доступен в ближайшее время", null);
            }
        });

    });

    return passport.authenticate('local-signup', {
        successRedirect: '/user',

        failureRedirect: '/signUp_signIn',
        failureFlash: true
    });
}

//вход
exports.signIn = signIn = () => {
    passport.use('local-signin', new localStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },

        (req, login, password, done) => {
            Users.findOne({ 'login': login }, (err, user) => {
            }).then((user) => {
                if (!user) {
                    return done(null, false, req.flash('err_signIn', 'Не правильно введен логин'));
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, req.flash('err_signIn', 'Не правильно введен пароль'));
                }
                return done(null, user);

            }).catch((err) => {
                console.log("Error logIn:", err);
                return done(null, false, req.flash('err_signIn', 'Не известная ошибка входа'));

            });


        }
    ));
    return passport.authenticate('local-signin', {
        successRedirect: '/user',

        failureRedirect: '/signUp_signIn',
        failureFlash: true
    });
}

//Отображение в шапке результатов аутентификации
var auth = auth = (func, user) => {
    //console.log(body);
    if (func == undefined) var func = [];
    //else if (typeof func != Object)

    if (user != undefined) {
        func['auth'] = true;
    } else func['auth'] = false;

    return func;
}
exports.auth = auth;
