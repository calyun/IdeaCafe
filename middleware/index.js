var 
    Comment = require("../models/comment"),
    Talk    = require("../models/talk")
    ;

// store middleware

var middlewareObj = {};

middlewareObj.isCommentOwner = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // if author id matches
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Only the owner of this talk can do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to access this permission.");
        res.redirect("back");
    }
};

middlewareObj.isTalkOwner = function(req, res, next){
    if (req.isAuthenticated()){
        Talk.findById(req.params.id, function(err, foundTalk){
            if(err){
                req.flash("error", "Talk not found");
                res.redirect("back");
            } else {
                // if id matches
                if (foundTalk.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Only the owner of this talk can do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to access this permission.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){      // if user logged in
        return next();
    }
    req.flash("error", "You must log in to access this permission.");
    res.redirect("/login");         // if not logged in
};

module.exports = middlewareObj;