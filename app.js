var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

var foods = [
        {name: "bread", image: "https://static01.nyt.com/images/2017/02/16/dining/16COOKING-NOKNEADBREAD1/16COOKING-NOKNEADBREAD1-videoSixteenByNineJumbo1600.jpg", expiration: "August 15"},
        {name: "eggs", image: "http://d2gk7xgygi98cy.cloudfront.net/6383-3-large.jpg", expiration: "August 26"},
        {name: "Greek yogurt", image: "https://images.heb.com/is/image/HEBGrocery/001297099-1?id=fuwQT0&fmt=jpg&fit=constrain,1&wid=296&hei=296", expiration: "August 22"},
        {name: "bread", image: "https://static01.nyt.com/images/2017/02/16/dining/16COOKING-NOKNEADBREAD1/16COOKING-NOKNEADBREAD1-videoSixteenByNineJumbo1600.jpg", expiration: "August 15"},
        {name: "eggs", image: "http://d2gk7xgygi98cy.cloudfront.net/6383-3-large.jpg", expiration: "August 26"},
        {name: "Greek yogurt", image: "https://images.heb.com/is/image/HEBGrocery/001297099-1?id=fuwQT0&fmt=jpg&fit=constrain,1&wid=296&hei=296", expiration: "August 22"},
        {name: "bread", image: "https://static01.nyt.com/images/2017/02/16/dining/16COOKING-NOKNEADBREAD1/16COOKING-NOKNEADBREAD1-videoSixteenByNineJumbo1600.jpg", expiration: "August 15"},
        {name: "eggs", image: "http://d2gk7xgygi98cy.cloudfront.net/6383-3-large.jpg", expiration: "August 26"},
        {name: "Greek yogurt", image: "https://images.heb.com/is/image/HEBGrocery/001297099-1?id=fuwQT0&fmt=jpg&fit=constrain,1&wid=296&hei=296", expiration: "August 22"},
    ];
        
app.get("/foods", function(req, res){
    res.render("foods", {foods: foods});
});

// send post request to add new food to foods array
app.post("/foods", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newFood = {name: name, image: image};
    foods.push(newFood);
    res.redirect("/foods");
});

app.get("/foods/new", function(req, res){
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("BreadCheck server has started!");
});

// August 13, 2017
// Just finished watching The Matrix.
// Staying past midnight, coding away.