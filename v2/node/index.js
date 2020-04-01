var http = require('http');
var fs = require('fs');

//create a server object:
http.createServer(function (req, res) {
  if (req.url == "/packages.json") {
      let di = fs.readdir("../packages",function(a,x){
        res.write(JSON.stringify({list:x}))
        res.end();
      }
  }

  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
