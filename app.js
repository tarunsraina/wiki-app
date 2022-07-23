//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wiki-db",{useNewUrlParser:true})

const articleSchema = {
    title : String,
    content : String
}

const Article=mongoose.model("Article",articleSchema)
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.route("/articles")

.get(function(req,res){
  
  Article.find(function(err,found){
    if(!err){
      res.send(found);
    }else{
      res.send(err);
    }
  })
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  })

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully created new article")
    }else{
      res.send(err)
    }
  })
})
  .delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles")
    }else{
      res.send(err)
    }
  })
});

///////////// Targetting specific article
app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("No articles found")
    }
  })

})

.put(function(req,res){
    Article.updateOne(
      {title : req.params.articleTitle},  //condition
      {title : req.body.title , content : req.body.content },
      {overwrite : true},

      function(err){
        if(!err){
          res.send("Successfully updated ")
        }else{
          res.send(err)
        }
      }
    )
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});