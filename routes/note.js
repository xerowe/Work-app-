var express = require("express");
var router  = express.Router({mergeParams: true});
var Task = require("../models/task");
var Comment = require("../models/comment");
var Note = require("../models/note");
const middleware = require("../middleware");

//NEW - show form to create new TASK
router.get('/new', middleware.isLoggedIn, (req,res) => {
  res.render('note/new');
})

//CREATE - add new TASK to DB
router.post('/', middleware.isLoggedIn, (req,res) => {
  // get data from form and add to TASK array
  let text = req.body.text;
  let title = req.body.title;
  let newNote = {text: text, title: title}
  Note.create(newNote, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      req.flash('success', 'Note created successful')
      res.redirect('/dashboard')
    }
  });
});

//DELETE - delete task
router.delete('/:id', middleware.checkUserOwnership, (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      console.log(err);
      res.redirect('/dashboard');
    } else {
      req.flash('success', 'Note Successfully Deleted');
      res.redirect('/dashboard');
    }
  })
});



module.exports = router;
