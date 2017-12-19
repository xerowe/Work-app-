var express = require("express");
var router  = express.Router({mergeParams: true});
var Task = require("../models/task");
var Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn,  function(req, res){
    // find campground by id
    console.log(req.params.id);
    Task.findById(req.params.id, function(err, task){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {task: task});
        }
    })
});

//Comments Create
router.post("/" , middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Task.findById(req.params.id, function(err, task){
       if(err){
           res.redirect("/task");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
             // add username and ID
             comment.author.id = req.user._id;
             comment.author.username = req.user.username;
             comment.save();
             task.comments.push(comment);
             task.save();
             res.redirect('/task/' + task._id)
           }
        });
       }
   });
});

// COMMENT UPDATE  ROUTE
router.get('/:comment_id/edit', middleware.checkUserOwnership,  (req, res) => {
  Task.findById(req.params.id, (err, foundTask) => {
    if(err || !foundTask) {
      req.flash('error', 'No Task Found')
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {task_id : req.params.id, comment: foundComment});
       }
    });
  });
});


// COMMENT PUT ROUTE
router.put('/:comment_id', middleware.checkUserOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
      if(err) {
        res.redirect('back');
      } else {
        res.redirect('/task/' + req.params.id);
      }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkUserOwnership,  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
           res.redirect("back");
       } else {
           req.flash('success', 'Comment deleted');
           res.redirect("/task/" + req.params.id);
       }
    });
});

module.exports = router;
