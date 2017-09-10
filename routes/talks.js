var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Talk    = require("../models/talk"),
    request = require("request"),
    middleware  = require("../middleware")
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

// directly puts thumbnail url in req.body, then continues building the talk
function getTalkInfo(req, res){
    request(req.body.video_file_url, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            req.body.video_thumb = data["thumbnail_url"];
            req.body.video_name = data["title"];
            req.body.video_descr = data["description"];
            createTalk(req, res);
        }
    });
}

function createTalk(req, res) {
    // Form fields
    var descr, name;
    
    if (req.body.name.length > 0)
    {
        name = req.body.name;
    } else {
        name = req.body.video_name;
    }
    
    if (req.body.description.length > 0)
    {
        descr = req.body.description;
    } else {
        descr = req.body.video_descr;
    }
    
    var video = req.body.video_url;
    var image = req.body.video_thumb;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    
    var newTalk = {name: name, image: image, description: descr, video: video, author: author};
    // create new Talk item + redirects
    Talk.create(newTalk, function(err, newCreation){
        if(err){
            console.log(err);
        } else {
            res.redirect("/talks");
        }
    });
}
    
// CREATE - send the form to make the new item
// send post request to add new Talk to Talks array
router.post("/", middleware.isLoggedIn, function(req, res) {
    // preprocesses info in req
    
    // gets the text after "\talks\"
    var getEmbed = /\/talks\/(.*)/;
    var video_name_id = getEmbed.exec(req.body.video);
    req.body.video_url = "https://embed.ted.com/talks/" + video_name_id[1];
    
    // TEMPORARY FIX
    // manually go to this link to get thumbnail
    req.body.video_file_url = "http://www.ted.com/talks/oembed.json?url=http%3A%2F%2Fwww.ted.com%2Ftalks%2F" + video_name_id;
    
    getTalkInfo(req, res);
    // Due to asynchronous flow,
    // The callback will only execute after this entire .post(){} block is done...
});

// NEW - get the form
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.get("/:id/edit", middleware.isTalkOwner, function(req, res){
    Talk.findById(req.params.id, function(err, foundTalk){
        res.render("talks/edit", {talk: foundTalk});   
    });
});


// UPDATE route
router.put("/:id", middleware.isTalkOwner, function(req, res){
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
router.delete("/:id", middleware.isTalkOwner, function(req, res){
    Talk.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/talks");
        } else {
            res.redirect("/talks");
        }
    });
});


module.exports = router;