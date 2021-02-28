var Comment = require("../models/comment");
var Compground = require("../models/campgrounds");
var middlewareObj = {};


middlewareObj.isLogedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be Loggedin to do that !!!");
    res.redirect("back");
};
middlewareObj.CheckCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not allowed to do this !!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Loggedin to do that !!!");
        res.redirect("back");
    }
};
middlewareObj.CheckCampgroundOwenership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Compground.findById(req.params.id, function(err, foundCampbground) {
            if (err) {
                req.flash("error", err.message);
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampbground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not allowed to do this !!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Loggedin to do that !!!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;