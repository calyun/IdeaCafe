var express = require("express"),
    router  = express.Router({mergeParams: true}),  // allows access of e.g. :id param
    Comment = require("../models/comment"),
    Talk    = require("../models/talk"),
    middleware  = require("../middleware")
    ;

//==========================
//      COMMENTS ROUTES
//==========================
// new command form
router.get("/new", middleware.isLoggedIn, function(req, res){
    Talk.findById(req.params.id, function(err, talk){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {talk: talk});
        }
    });
});

// create comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Talk.findById(req.params.id, function(err, talk){
       if(err){
           console.log(err);
           res.redirect("/talks");
       } else {
           // associate comment to talk
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Comment could not be created. Please contact the admin.")
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // saves Comment, pushes into Talk array, saves Talk
                   comment.save();
                   talk.comments.push(comment);
                   talk.save();
                   req.flash("success", "Comment posted");
                   res.redirect('/talks/' + talk._id);
               }
           });
       }
    });
});

// EDIT route
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {talk_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE route
router.put("/:comment_id", middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/talks/" + req.params.id);
        }
    });
});

// DELETE route
router.delete("/:comment_id", middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/talks/" + req.params.id);
        } else {
            res.flash("success", "Comment deleted");
            res.redirect("/talks/" + req.params.id);
        }
    });
});

module.exports = router;