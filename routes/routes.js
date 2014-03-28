/*
 * Aquí vamos a definir todas las rutas que hay en nuestro proyecto
 */

module.exports = function(app, passport)
{
    // Estas son las rutas del servidor (índice de las páginas del sitio web)
    app.get('/', function (req, res) {
        res.render('index.jade', { title: 'Main Page' });
    });

    app.get('/experience', function (req, res)
    {
        res.render('experience.jade', { title: 'Experience' });
    });

    app.get('/about', function(req, res){
        res.render('about', { title: 'ABOUT' });
    });

    app.get('/login', function(req, res) {
        var user = "",
            password = "";

        if (typeof req.user !== "undefined") {
            user = req.user.name;
            password = req.user.password;
        }

        res.render('login.jade', { title: 'Actual usuario logueado:', user: user,  password: password, message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        res.render('signup.jade', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login',
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.get('/profile', isLoggedIn, function(req, res) {
        var user = "";
        var password = "";

        console.log(req.user);

        if (req.user.name) {
            user = req.user.name;
            password = req.user.password;
        }

        res.render('profile.jade', { user: user,  password: password} );

    });


    app.post('/logout', function(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });

    app.get('/loginerror' , function(req,res) {
        console.log(req.flash('error'));
        res.redirect('/login');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
