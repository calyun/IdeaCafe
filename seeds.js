var mongoose    = require("mongoose");
var Talk        = require("./models/talk");
var Comment     = require("./models/comment");
var User     = require("./models/user");

var data = [
    {
        name: "The future we're building — and boring",
        image: "http://www.spacex.com/sites/spacex/files/styles/media_gallery_large/public/first_reflight_-_03_25787998624_3ca213be1e_o.jpg",
        description: "Rockets.",
        video: "elon_musk_the_future_we_re_building_and_boring",
        author: {
            id: "59b3909a5ef1481080079356",
            username: "adder"
        },
    },
    {
        name: "The future we're building — and boring",
        image: "http://coverimages.verbacompete.com/no_image.jpg",
        description: "Rockets rockets space",
        video: "elon_musk_the_future_we_re_building_and_boring",
        author: {
            id: "59b3909a5ef1481080079356",
            username: "adder"
        },
    },
    {
        name: "A smog vacuum cleaner and other magical city designs",
        image: "http://coverimages.verbacompete.com/no_image.jpg",
        description: "Hai",
        video: "daan_roosegaarde_a_smog_vacuum_cleaner_and_other_magical_city_designs",
        author: {
            id: "59b3909a5ef1481080079356",
            username: "adder"
        },
    },
];

var users = [
    {
        username: "adder",
        password: "password",
    },
];

function seedDB() {
    Talk.remove({}, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("removal success");
            data.forEach(function(seed){
                Talk.create(seed, function(err, talk){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a Talk");
                        // example comment creation
                        Comment.create(
                            {
                            text: "Great Talk!", 
                            author: {
                                id: "59b3909a5ef1481080079356",
                                username: "adder"
                            }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    talk.comments.push(comment);
                                    talk.save();
                                    console.log("Comment created");
                                }
                            }
                        )
                    }
                });
            });
            users.forEach(function(seed){
                User.create(seed, function(err, user){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a User");
                    }    
                });
            });
        }
    });
}

module.exports = seedDB;