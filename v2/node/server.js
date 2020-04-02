var http = require('http');
var fs = require('fs');
var nrc = require('node-run-cmd');

//create a server object:
http.createServer(function (req, res) {
  if (req.url == "/packages.json") {
      fs.readdir(__dirname+"/../packages",function(a,b){
        res.write(JSON.stringify(b))
        res.end();
      })
  }
  else if (req.url == "/levels.json") {
      fs.readdir(__dirname+"/../levels",function(a,b){
        res.write(JSON.stringify(b))
        res.end();
      })
  }
  else if (req.url == "/main") {
      fs.readFile(__dirname+"/index.html",function(a,b){
        res.write(b)
        res.end();
      })
  }
  else if (req.url.startsWith("/packages/") | req.url.startsWith("/scripts/") | req.url.startsWith("/levels/")) {
    fs.readFile(__dirname+"/.."+req.url,function(a,b){
      if (a)
        res.write('0')
      else
        res.write(b)
      res.end();
    })
  }
  else if (req.url == "/compile") {
    console.log(req)
    fs.writeFile(__dirname+"/../compile/level.vmf","this_is_a_bruh",function(a){
      if (a)
        console.log("Error when attempting to write to file.")
      else {
        //nrc.run("%programfiles(x86)%\\Steam\\steamapps\\common\\Portal 2\\bin\\vbsp.exe \""+__dirname+"/../compile/level.vmf\"");
        nrc.run("F:\\Steam\\steamapps\\common\\Portal 2\\in\\vbsp_original.exe \""+__dirname+"/../compile/level.vmf\""); // MUST DO: make custom directories
      }
    })
  }
  else {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
  }
}).listen(8080); //the server object listens on port 8080
