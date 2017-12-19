const express  = require("express");
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/user');
const Task     = require('../models/task');
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

////Dashboard - show all Task
router.get('/dashboard', middleware.isLoggedIn, (req, res) => {
  // Get all TASK from DB
  Task.find({}, (err, AllTasks) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dashboard', {tasks: AllTasks });
    }
  });
});

module.exports = router;
