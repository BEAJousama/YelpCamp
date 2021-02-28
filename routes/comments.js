var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    passport = require("passport"),
    Compground = require("../models/campgrounds"),
    middlewareObj = require("../middleware");



router.get("/new", middlewareObj.isLogedin, function(req, res) {
    Compground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("comments/new", { campground, campground });
        }
    });
});
router.post("/", middlewareObj.isLogedin, function(req, res) {
    Compground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);

                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }

            });
        }
    });
});
router.delete("/:comment_id", middlewareObj.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, { useFindAndModify: false }, function(err, deletedcamp) {
        if (err) {
            console.log(req.params.comment_id);
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
router.get("/:comment_id/edit", middlewareObj.CheckCommentOwnership, function(req, res) {
    Compground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    req.flash("error", err.message);
                    console.log(err);
                } else {
                    res.render("comments/edit", { campground: foundCampground, comment: foundComment });
                }
            });
        }
    });
});
router.put("/:comment_id", middlewareObj.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, { useFindAndModify: false }, function(err, updatedcamp) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;