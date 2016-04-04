// include modules
var ums                 = require('index.js');
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

// initialize express app
var app = express();

var listener = app.listen(process.env.PORT || 1137, function(){
    console.log('Listening on port ' + listener.address().port);
});


var argument = process.argv;

if(argument[2]){
    var fullPath = path.resolve(process.cwd(), argument[2]);
    app.use(express.static(fullPath));
    console.log(fullPath);
}else{
    app.use(express.static(process.cwd() + '/'));
    console.log(argument);
}


// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    if (ums.login(username, password)==='Logged in') return done(null, { username: username });
    return done(null, false);
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(id, done) {
    done(null, { username: id });
});

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());





//Get /Services/user - check to see if the current client (browser) is logged
//in using session data.  If the client is logged in then send back the username.

app.get('/services/user', function(req, res){
    if(req.user)return res.send(req.user.username);
    req.send('No user found');
});

//POST /Services/user create a user account if not created, otherwise return an error.
//Send a JSON string in the body that has the information needed to create the user.

app.post('/services/user', function(req, res){
    if(req.body.username){
        if(req.body.password){
            if(req.body.firstName){
                ums.createUser(req.body.username, req.body.password, req.body.firstName)
                    .then(function(res){
                        if(res === 'Username already exists, Sorry, please try again'){
                            res.send('JSON');
                        }else{
                            req.send('User Created');
                        }
                    })
            }else{
                req.send('Please Input a First Name');
            }
        }else{
            req.send('Please Input a Password');
        }
    }else{
        req.send('Please Input a Username');
    }
});

//3 Put /services/user - create a user account if not created, otherwise update the
//user account if the user doing the update is logged in.  Send a JSON string in the body
// that has the information needed to create or update the user.

app.put('/services/user', function(req, res){
   if (req.body.username){
       if (req.body.password){
           if (req.body.firstName) {
               ums.createUser(req.body.username, req.body.password, req.body.firstName)
                   .then(function (resolution) {
                       if (resolution === 'Username already exists, Sorry, please try again') {
                           ums.update(req.body.username, 'password', req.body.password)
                               .then(function (output) {
                                   if (output === 'Changed') {
                                       req.send(output);
                                   } else {
                                       req.send('JSON String');
                                   }
                               })
                       } else {
                           req.send('User Created, JSON string');
                       }
                   })
           }else{
                req.send('Please input your First Name');
           }
       }else{
            req.send('Please input a password');
       }
   }else{
       req.send('Please input a Username');
   }
});


//4 PUT /services/login - authenticate the client by sending a JSON string in the body
// that has all the necessary authentication information.  If the authentication passes
// then a session should be established for the client.

app.put('/services/login', passport.authenticate('local'), function(req, res){
    res.send('Welcome ' + req.user.username);
});


//5 Put /services/logout - terminate the session for the client.

app.put('/services/logout', function(req, res){
    req.logout();
    res.send('Logged Out');
});