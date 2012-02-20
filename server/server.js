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
  //TODO: check it's audio
});

//Receive the trimming data
app.post("/trim", function(req, resp, next){
});

//Stream the data back
app.get("/stream/:file", function(req, res, next){
  //offload this to our streamer server
  /*var httpReq = require("http").request({
    host:"localhost",
    port: 3000,
    path: "/stream/"+req.params.file,
    method: "GET"
  },
  function(httpResp){
    httpResp.on("data", function(chunk){
      res.write(chunk);
    })
  });
  httpReq.end();*/

  var file = "./samples/"+req.params.file;
  var stat = fs.statSync(file);

  res.writeHead(200, {
      "Content-Type" : "audio/ogg",
      "Transfer-Encoding": "chunked"
   });

  var readStream = fs.createReadStream(file);

  //pipe this to the resource
  readStream.on("open", function(){
    readStream.pipe(res);
  })
});

app.listen(8124);
console.log("Server is spinning...");