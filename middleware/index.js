let Task     = require('../models/task');
let Comment  = require('../models/comment');
let middlewareObj = {};

//midaware
middlewareObj.isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Plase Login First');
    res.redirect("/login");
}

middlewareObj.checkUserOwnership = (req, res, next)=> {
  // Check If the User is the same as the creator
   if(req.isAuthenticated()){
          Task.findById(req.params.id, function(err, foundTask){
             if(err || !foundTask){
                 res.redirect("back");
             }  else {
                 // does user own the campground?
              if(foundTask.author.id.equals(req.user._id)) {
                  next();
              } else {
                  res.redirect("back");
              }
             }
          });
      } else {
          res.redirect("back");
      }
  }
middlewareObj.checkCommentOwnership = (req, res, next)=> {
  // Check If the User is the same as the creator
   if(req.isAuthenticated()){
          Comment.findById(req.params.id, function(err, foundComment){
             if(err || !foundComment){
               req.flash('error', 'Comment not found')
               res.redirect("back");
             }  else {
                 // does user own the campground?
              if(foundComment.author.id.equals(req.user._id)) {
                  next();
              } else {
                  res.redirect("back");
              }
             }
          });
      } else {
          res.redirect("back");
      }
  }

module.exports = middlewareObj
