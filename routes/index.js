var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    User        = require("../models/user");

// root route
router.get("/", function(req, res){
    res.render("landing");
});

//=====================
// AUTH routes
//=====================

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// sign up the user
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Warm welcome to IdeaCafe " + user.username);
           res.redirect("/talks");
       });
   });
});

// show login form
router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")});
});

// log in the user
// (page, middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/talks",
        failureRedirect: "/login"
        // IF FAILURE: req.flash("error", "Incorrect username/password."); refer to AuthFromScratch
    }), function(req, res){
});

// log out the user
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are now logged out.");
    res.redirect("/talks");
});

module.exports = router;