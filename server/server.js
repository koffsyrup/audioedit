var express = require("express");
var util = require("util");
var fs = require("fs");

var app = express.createServer(
  express.logger(),
  express.bodyParser({keepExtensions: true, uploadDir: __dirname + "/uploads"})
);

app.register(".html", require("ejs"));
app.set("view engine", "ejs");

app.configure(function(){
  app.use(app.router);
  app.use(express.static(__dirname+"/static"));
  app.use(express.errorHandler({
    dumpExceptions: true, showExceptions: true}));
});

//Receive the file
app.post("/upload", function(req, resp, next){
});

//Receive the trimming data
app.post("/trim", function(req, resp, next){
});

//Download the file
app.get("/download/:file", function(req, res, next) {
  var file = "./samples/"+req.params.file;

  res.writeHead(200, {
      "Content-disposition" : "attachment; filename=" + req.params.file,
      "Content-Type" : "audio/ogg",
      "Content-Length" : fs.statSync(file).size
  });

  var readStream = fs.createReadStream(file, {flags:"r"});

  //write out some data
  readStream.on("data", function(chunk){
    res.write(chunk);
  });
  readStream.on("end", function(){
    res.end();
  });
});

//Stream the data back
app.get("/stream/:file", function(req, res, next){
  var file = "./samples/"+req.params.file;
  var stat = fs.statSync(file);

  res.writeHead(200, {
      "Content-Type" : "audio/ogg",
      "Transfer-Encoding": "chunked"
  });

  var readStream = fs.createReadStream(file, {flags:"r"});

  //pipe this to the resource
  readStream.on("open", function(){
    readStream.pipe(res);
  });
});

app.listen(8124);
console.log("Server is spinning...");