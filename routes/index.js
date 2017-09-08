var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    User        = require("../models/user");

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
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/talks");
       });
   }) ;
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// log in the user
// (page, middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/talks",
        failureRedirect: "/login"
    }), function(req, res){
});

// log out the user
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/talks");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){      // if user logged in
        return next();
    }
    res.redirect("/login");         // if not logged in
}

module.exports = router;