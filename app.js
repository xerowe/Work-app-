const express         = require('express');
const app             = express();
const bodyParser      = require("body-parser");
const mongoose        = require("mongoose");
const flash           = require('connect-flash');
const passport        = require("passport");
const LocalStrategy   = require("passport-local");
const methodOverride  = require('method-override');
const User            = require('./models/user');
const Task            = require('./models/task');
const Comment         = require("./models/comment");


// Require Routes
const taskRoutes = require('./routes/task');
const commentRoutes  = require("./routes/comments");
const indexRoutes  = require("./routes/index");

//Conect to the DataBase
mongoose.connect('mongodb://miroslav:namiroparolata@ds161136.mlab.com:61136/work-log');
// set the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// set up static folder
app.use(express.static(__dirname + "/public"));
// Method override
app.use(methodOverride('_method'));
app.use(flash());

//PASPORT CONFIG
app.use(require("express-session")({
    secret: "Chester is the best DOG!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Check if you are Login
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Routes
app.use("/", indexRoutes);
app.use("/task", taskRoutes);
app.use("/task/:id/comments", commentRoutes);


app.listen(7895, () => console.log('App is starting on port 3000!'));
