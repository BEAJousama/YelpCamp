var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Compground = require("../models/campgrounds"),
    passport = require("passport"),
    middlewareObj = require("../middleware");



router.get("/", function(req, res) {
    Compground.find({}, function(err, allcompgrounds) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("campgrounds/index", { compgrounds: allcompgrounds });
        }
    });
});
router.get("/new", middlewareObj.isLogedin, function(req, res) {
    res.render("campgrounds/new");
});
router.post("/", middlewareObj.isLogedin, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcamp = { name: name, image: image, desc: desc, author: author };
    Compground.create(newcamp, function(err, newlycreaed) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {

            // newlycreaed.author.id = req.user._id;
            // newlycreaed.author.username = req.user.username;
            // newlycreaed.save();
            res.redirect("/campgrounds");
        }
    });
});
router.get("/:id", function(req, res) {
    Compground.findById(req.params.id).populate("comments").exec(function(err, foundCampbground) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampbground });
        }
    });
});
router.get("/:id/edit", middlewareObj.CheckCampgroundOwenership, function(req, res) {
    Compground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

router.put("/:id", middlewareObj.CheckCampgroundOwenership, function(req, res) {
    Compground.findByIdAndUpdate(req.params.id, req.body.campground, { useFindAndModify: false }, function(err, updatedCampground) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
router.delete("/:id", middlewareObj.CheckCampgroundOwenership, function(req, res) {
    Compground.findByIdAndDelete(req.params.id, { useFindAndModify: false }, function(err, deletdcamp) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }

    });

});

module.exports = router;