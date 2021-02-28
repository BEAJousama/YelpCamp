var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Compground = require("../models/campgrounds"),
    Comment = require("../models/comment"),
    User = require("../models/users"),
    passport = require("passport");

router.get("/", function(req, res) {
    res.render("landing", { currentuser: req.user });
});


router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("landing");
});

router.post("/login", passport.authenticate("local", {
    successFlash: "Welcome !",
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {

});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out ! ");
    res.redirect("/");
});


module.exports = router;