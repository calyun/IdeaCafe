var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    Talk        = require("./models/talk"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

// APP CONFIG
mongoose.connect("mongodb://localhost/bread_check");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.Promise = global.Promise;

// database seeder
//seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

// RESTful Index route!        
app.get("/talks", function(req, res){
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
app.post("/talks", function(req, res) {
    // Form fields
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var video = req.body.video;
    var newTalk = {name: name, image: image, description: desc, video: video};
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
app.get("/talks/new", function(req, res){
   res.render("talks/new"); 
});

// SHOW route
app.get("/talks/:id", function(req, res){
    
    Talk.findById(req.params.id).populate("comments").exec(function(err, foundTalk){
       if(err){
           console.log(err);
       } else {
           res.render("talks/show", {talk: foundTalk});
       }
    });
});

//==========================
//      COMMENTS ROUTES
//==========================

app.get("/talks/:id/comments/new", function(req, res){
    Talk.findById(req.params.id, function(err, talk){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {talk: talk});
        }
    });
});

app.post("/talks/:id/comments", function(req, res){
    Talk.findById(req.params.id, function(err, talk){
       if(err){
           console.log(err);
           res.redirect("/talks");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   talk.comments.push(comment);
                   talk.save();
                   res.redirect('/talks/' + talk._id);
               }
           });
       }
    });
    
    // post new comment
    
    // associate comment to talk
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("IdeaCafe server has started!");
});

// August 13, 2017
// Just finished watching The Matrix.
// Staying past midnight, coding away.