const express  = require("express");
const router   = express.Router();
const passport = require('passport');
const User     = require('../models/user');
const Task     = require('../models/task');

// router.get('/', (req, res) => {
//   // Get all TASK from DB
//   Task.find({}, (err, AllTasks) => {
//     if(err) {
//       console.log(err);
//     } else {
//       res.render('task/index', {tasks: AllTasks });
//     }
//   });
// });

router.get('/', (req, res) => {
  res.render('login');
});

// AUTH ROUTES
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('signup');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
});

//Show Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login'
}), (req, res) => {
});

//Log out
router.get('/logout', (req, res) => {
  req.logout();
  req.flash("error", "Logged you out!");
  res.redirect('/landing');
});

module.exports = router;
