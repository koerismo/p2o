var http = require('http');
var fs = require('fs');
var cp = require('child_process');
var pz = require(__dirname+'/../scripts/puzzlemaker.js')

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
        res.writeHead(404, {'Content-Type': 'text/html'})
      else
        res.write(b)
      res.end();
    })
  }
  else if (req.url == "/compile") {
    console.log(req.headers)
    try {
      let headers = JSON.parse(req.headers.data)
      let lvl = pz.compileAll(headers.pea,__dirname+'/../packages/example/editor/scripts/myStyle.js') //TEMPORARY FIX UNTIL I FIGURE OUT A SOLUTION
      fs.writeFile(__dirname+"/../compile/level.vmf",lvl,function(a){
      if (a) {
        console.log("Error when attempting to write to file.")
        res.end(0)
      }
      else {
        //nrc.run("%programfiles(x86)%\\Steam\\steamapps\\common\\Portal 2\\bin\\vbsp.exe \""+__dirname+"/../compile/level.vmf\"");
        cp("F:\\Steam\\steamapps\\common\\Portal 2\\in\\vbsp_original.exe \""+__dirname+"/../compile/level.vmf\"",function(er,out,err){
          res.end(1)
        }); // MUST DO: make custom directories
      }
    })
    }
    catch(e) {
      console.log("Unexpected error: "+e)
      res.end(0)
    }
  }
  else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    //res.write('Hello World!'); //write a response to the client
    res.end(""); //end the response
  }
}).listen(8080); //the server object listens on port 8080


function saveCompile(fn,fl,ending) {
  fs.writeFile(__dirname+"/../compile/"+fn+"."+ending,fl,function(err){
    if (err)
    console.log("Failed to save compiled file "+fn+ending)
  })
}
