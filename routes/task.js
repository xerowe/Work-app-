const express = require("express");
const router  = express.Router();
const Task = require("../models/task");
const middleware = require("../middleware");

////INDEX - show all Task
router.get('/', middleware.isLoggedIn, (req, res) => {
  // Get all TASK from DB
  Task.find({}, (err, AllTasks) => {
    if(err) {
      console.log(err);
    } else {
      res.render('task/index', {tasks: AllTasks });
    }
  });
});

//CREATE - add new TASK to DB
router.post('/', middleware.isLoggedIn, (req,res) => {
  // get data from form and add to TASK array
  let name = req.body.name;
  let lpLink = req.body.lpLink;
  let opLink = req.body.opLink;
  let qa = req.body.qa;
  let proof = req.body.proof;
  let comments = req.body.comments;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newTask = {name: name, lpLink: lpLink, opLink: opLink, qa:qa, proof: proof, comments:comments, author: author}
  Task.create(newTask, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      req.flash('success', 'Task created successful')
      res.redirect('/dashboard')
    }
  });
});

//NEW - show form to create new TASK
router.get('/new', middleware.isLoggedIn, (req,res) => {
  res.render('task/new');
})

// SHOW - shows more info about one TASK
router.get("/:id", (req, res) => {
    //find the campground with provided ID
    Task.findById(req.params.id).populate("comments").exec((err, foundTask) => {
        if(err || !foundTask){
            req.flash('error', 'Task not found ');
            res.redirect('back');
        } else {
            //render show template with that campground
            res.render("task/show", {task: foundTask});
        }
    });
});


// EDIT - edit task
router.get("/:id/edit", middleware.checkUserOwnership,  (req, res) => {

    Task.findById(req.params.id, function(err, foundTask){
        if(err){
            res.redirect("back");
        } else {
            res.render("task/edit", {task: foundTask});
        }
    });
})

// UPDATE - update the task
router.put('/:id', middleware.checkUserOwnership,  (req, res) => {
  let newData = {name: req.body.name, lpLink: req.body.lpLink, opLink: req.body.opLink, qa: req.body.qa, proof: req.body.proof, comments: req.body.comments };
  Task.findByIdAndUpdate(req.params.id, req.body.task  , function(err, updatedTask){
    if(err) {
      red.redirect('/');
    } else {
      res.redirect('/task/' + req.params.id);
    }
  });
});

//DELETE - delete task
router.delete('/:id', middleware.checkUserOwnership, (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/task');
    } else {
      req.flash('success', 'Task Successfully Deleted');
      res.redirect('/task');
    }
  })
});

module.exports = router;
