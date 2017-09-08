var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Talk    = require("../models/talk")
    ;

//====================
//      Talks
//====================

// index route       
router.get("/", function(req, res){
    // Method from Talk schema
    Talk.find({}, function(err, allTalks){
        if(err){
            console.log(err);
        } else {
            res.render("talks/index", {talks:allTalks});   
        }
    });
});

// CREATE - send the form to make the new item
// send post request to add new Talk to Talks array
router.post("/", isLoggedIn, function(req, res) {
    // Form fields
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var video = req.body.video;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newTalk = {name: name, image: image, description: desc, video: video, author: author};
    // create new Talk item + redirects
    Talk.create(newTalk, function(err, newCreation){
        if(err){
            console.log(err);
        } else {
            res.redirect("/talks");
        }
    });
});

// NEW - get the form
router.get("/new", isLoggedIn, function(req, res){
   res.render("talks/new"); 
});

// SHOW route
router.get("/:id", function(req, res){
    
    Talk.findById(req.params.id).populate("comments").exec(function(err, foundTalk){
       if(err){
           console.log(err);
       } else {
           res.render("talks/show", {talk: foundTalk});
       }
    });
});


// EDIT route
router.get("/:id/edit", isTalkOwner, function(req, res){
    Talk.findById(req.params.id, function(err, foundTalk){
        res.render("talks/edit", {talk: foundTalk});   
    });
});


// UPDATE route
router.put("/:id", isTalkOwner, function(req, res){
    Talk.findByIdAndUpdate(req.params.id, req.body.talk, function(err, updatedTalk)
    {
        if (err) {
            res.redirect("/talks");
        } else {
            res.redirect("/talks/" + req.params.id);
        }
    });
});


// DELETE route
router.delete("/:id", isTalkOwner, function(req, res){
    Talk.findByIdAndRemove(req.params.id, function(err, foundTalk){
        if(err){
            res.redirect("/talks");
        } else {
            res.redirect("/talks");
        }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){      // if user logged in
        return next();
    }
    res.redirect("/login");         // if not logged in
}

function isTalkOwner(req, res, next){
    if (req.isAuthenticated()){
        Talk.findById(req.params.id, function(err, foundTalk){
            if(err){
                res.redirect("back");
            } else {
                // if id matches
                if (foundTalk.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.send("You must be logged in to access this functionality.");
    }
}

module.exports = router;