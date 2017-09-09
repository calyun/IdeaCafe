var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB      = require("./seeds"),
    Talk        = require("./models/talk"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

// require routes    
var commentRoutes   = require("./routes/comments"),
    talkRoutes      = require("./routes/talks"),
    indexRoutes     = require("./routes/index");

// APP CONFIG
mongoose.connect("mongodb://localhost/idea_cafe");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.Promise = global.Promise;

// database seeder - obsolete
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "AI is the future!",
    resave: false,
    saveUninitialized: false,    // security
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());       // determines subset user data to store in session (serialized user)
passport.deserializeUser(User.deserializeUser());   // matches key to user, passing entire user object

// middlewave, passes currentUser to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// tells express app to use routes
app.use("", indexRoutes);
app.use("/talks", talkRoutes);
app.use("/talks/:id/comments", commentRoutes);

app.get("/", function(req, res){
    res.render("landing");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("IdeaCafe server has started!");
});

// August 13, 2017
// Just finished watching The Matrix.
// Staying past midnight, coding away.