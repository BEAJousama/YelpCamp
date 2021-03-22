var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Compground = require("./models/campgrounds"),
    Comment = require("./models/comment"),
    User = require("./models/users"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    PassportLocalMongoose = require("passport-local-mongoose");
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//Passport Config
app.use(require("express-session")({
    secret: "hi beaj welcome",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));
passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT || 3000, function() {
    console.log("server has been started");
});