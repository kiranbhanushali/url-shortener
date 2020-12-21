//express
const express = require("express");
const app = express();

//handlebars for views
const Handlebars = require("handlebars");
app.set('view engine', 'hbs')


var cors = require("cors");
app.use(cors());

require("dotenv").config();


//for post req  
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use("/public", express.static(process.cwd() + "/public"));
// https://expressjs.com/en/starter/basic-routing.html

var Url = require('./models/urlModel')


// root 
app.get( '/' , function ( req , res ) {
    res.render( 'index' ) ; 
});


// creating the url 
app.post("/", function(req, res) {
    var urlObject = Url({
        original_url:req.body.url,
        short_url : req.body.custom_url,
        count:0
    });

    if ( urlObject.validateOriginalUrl() )
    {
        urlObject.checkShort_url();
        res.render('output', {urlObject:urlObject,alert:false,BASE_URL:process.env.BASE_URL});
        var short = urlObject.save(function(err,data){
            if(err) console.log(" post requests on / "+err);
        });
    } 
    else{
        res.render('index', {urlObject:urlObject,alert:true,message:"Invalid Url",BASE_URL:process.env.BASE_URL});
    }




});

app.get("/a", async function(req, res) {

  var obj = await Url.find().exec();
  res.render('analize', {BASE_URL:process.env.BASE_URL,urlObject:obj});

 
});



app.get("/:short", async function(req, res) {
  // console.log("short"+req.params.short);

  var obj = await Url.findOneAndUpdate({ short_url : req.params.short },{$inc: {'count' :1 } },{new:false}).exec();

  res.redirect(obj.original_url);

});






// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});



