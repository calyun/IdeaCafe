var express = require("express"),
    router  = express.Router({mergeParams: true}),  // allows access of e.g. :id param
    Comment = require("../models/comment"),
    Talk    = require("../models/talk");

//==========================
//      COMMENTS ROUTES
//==========================
// new command form
router.get("/new", isLoggedIn, function(req, res){
    Talk.findById(req.params.id, function(err, talk){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {talk: talk});
        }
    });
});

// create comment
router.post("/", isLoggedIn, function(req, res){
    Talk.findById(req.params.id, function(err, talk){
       if(err){
           console.log(err);
           res.redirect("/talks");
       } else {
           // associate comment to talk
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // saves Comment, pushes into Talk array, saves Talk
                   comment.save();
                   talk.comments.push(comment);
                   talk.save();
                   res.redirect('/talks/' + talk._id);
               }
           });
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){      // if user logged in
        return next();
    }
    res.redirect("/login");         // if not logged in
}

module.exports = router;