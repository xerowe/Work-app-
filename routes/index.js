const express  = require("express");
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/user');
const Task     = require('../models/task');
const Note     = require('../models/note');
const middleware = require("../middleware");


router.get('/', (req, res) => {
  res.render('index');
});

// AUTH ROUTES
router.get('/signup', (req, res) => {
  res.redirect('/');
});
// AUTH ROUTES
router.get('/login', (req, res) => {
  res.redirect('/');
});

router.post('/signup', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      req.flash('error', err.message)
      return res.redirect('/');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/dashboard');
    });
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/',
  failureFlash : true
}), (req, res) => {

});

//Log out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "Logged you out!");
  res.redirect('/');
});



router.get("/dashboard" , middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Task.find({}, function(err, task){
       if(err){
           res.redirect("back");
       } else {
        Note.find({}, function(err, note){
           if(err){
               console.log(err);
           } else {
             res.render('dashboard', {tasks:task, note: note})
           }
        });
       }
   });
});



module.exports = router;
