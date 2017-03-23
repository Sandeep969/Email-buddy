var user = require('./models/user');
var mongoose = require('mongoose');
var email =  require('./models/email');
var nodemailer = require('nodemailer');

var smtpTransport = require('nodemailer-smtp-transport');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});

module.exports = function(app, passport){
   app.get('/', function(req, res){
      res.render('index.ejs');
   });

   app.get('/login', function(req, res){
      res.render('login.ejs', { message: req.flash('loginMessage') });
   });
   app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
   }));

   app.get('/signup', function(req, res){
      res.render('signup.ejs', { message: req.flash('signupMessage') });
   });


   app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
   }));

   app.get('/profile', isLoggedIn, function(req, res){
      res.render('profile.ejs', { user: req.user });
   });



   app.get('/home', isLoggedIn, function(req, res){

    

          res.render('home.ejs',{user: req.user});


    
      
    
   }); 

   app.post('/email',isLoggedIn, function(req, res){
     new email({
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
       }).save(function(err){
      if(err){
         console.log(err)
      }
      else{
         console.log("succ");
      }


   });
   
   

   var transporter = nodemailer.createTransport(smtpTransport({
  
   service: 'Gmail',
   auth: { user: 'sunnysandeep1900@gmail.com' ,
        pass: 'sandeep@1996' }
  }));
   transporter.sendMail({
    from: 'SANDEEP REDDY <sunnysandeep1900@gmail.com>',
    to: req.body.email ,
    subject: req.body.subject,
    text: req.body.message,
    
  }, function (error, response) {
    //Email not sent
    if(error){
            console.log(error);
        }else{
            console.log(response);
        }
        
    });


  
    var result = [];

     var collection = db.collection('emails');

     var cursor = collection.find();
     cursor.forEach(function(doc, err){

      result.push(doc);
      console.log(doc);

     }, function(){


      res.render('home.ejs',{user: req.user, email: result});
     });

   });
   app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

   app.get('/auth/facebook/callback', 
     passport.authenticate('facebook', { successRedirect: '/profile',
                                         failureRedirect: '/' }));

   app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

   app.get('/auth/google/callback', 
     passport.authenticate('google', { successRedirect: '/home',
                                         failureRedirect: '/' }));


   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   })
};

function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()){
      return next();
   }

   res.redirect('/login');
}
