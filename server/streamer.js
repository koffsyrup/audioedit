var express = require("express");
var fs = require("fs")

exports.PORT=3000;

var streamer = express.createServer(
  express.logger()
);

streamer.configure(function(){
  streamer.use(streamer.router)
});

streamer.get("/stream/:file", function(req, res, next){
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
  });
});

streamer.listen(exports.PORT);
console.log("Streamer is spinning...");