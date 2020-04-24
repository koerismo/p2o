var packages = {};
var action;
var itemgroup, stylegroup;
var bar_sort = "package"

function loadFile(url, callback,call_err) {
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(xhr)
            } else {
                call_err(xhr)
                console.warn("failed to load "+url)
                console.error(xhr.statusText);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}


var itembar;

function mo_in(e){
  action = "toolbar"
}
function mo_out(e){
  action = "none"
}

function compileLevel(lvl) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //let temp = JSON.parse(this.responseText)
      alert((this.responseText))
      alert(["compile failed.","success."][(this.responseText)])
    }
  }
  xhr.open("POST", "/compile", true);
  xhr.setRequestHeader("data", JSON.stringify({pea:lvl}));
  xhr.send(""); 
}

function beginLoad(){
var errcount = 0;
itembar = $("#sidebar_left")
if (bar_sort == "type") {
  itemgroup = document.createElement("DIV")
  stylegroup = document.createElement("DIV")
}
console.log("retrieving packages...")
var completedPkgs = 0;
loadFile("packages.json",function(x){ //this file does not exist. When requested, the server should return a JSON formatted list of folders inside the packages folder
  var pkglist;
  eval("pkglist = "+x.response)
  console.log("found "+pkglist.length+" packages. Downloading...")
  pkglist.forEach(function(y,i){
      loadPackage(y,function(z){
        console.log("downloaded package "+i+"/"+pkglist.length)
        completedPkgs += 1
        if (completedPkgs == pkglist.length) {
          console.log("finished downloading packages with "+errcount+" skipped")
          setTimeout($("#loader")[0].classList.add("loader"),1000);
          if (bar_sort == "type") {
            itembar.append(stylegroup)
            itembar.append(itemgroup)
          }
        }
      },function(x){
        errcount++
        console.error("failed to download package "+y)
        completedPkgs += 1
        if (completedPkgs == pkglist.length) {
            console.log("finished downloading packages with "+errcount+" skipped")
            setTimeout($("#loader")[0].classList.add("loader"),1000);
            if (bar_sort == "type") {
              itembar.append(stylegroup)
              itembar.append(itemgroup)
            }
        }
      })
  })
})
}

function loadPackage(pkgname,callback,err) {
  loadFile("/packages/"+pkgname+"/package.json",function(x){
    if (bar_sort == "package") {
      itemgroup = document.createElement("DIV")
      stylegroup = document.createElement("DIV")
      let title = document.createElement("H1")
      title.innerText = pkgname
      itembar.append(title)
    }
    var file;
    eval("file = "+x.response)
    packages[pkgname] = {"items":{},"styles":{}}
    Object.keys(file.items).forEach(function(x,i){
      packages[pkgname]["items"][x] = {}
      loadFile("packages/"+pkgname+"/editor/models/"+file.items[x].model,function(y){
        packages[pkgname].items[x].model = y
      })
      packages[pkgname].items[x].itemOutputs = file.items[x].itemOutputs
      packages[pkgname].items[x].itemInputs = file.items[x].itemInputs
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/icons/"+file.items[x].icon
      im.title = Object.keys(file.items)[i]
      itemgroup.append(im)
    })
    if (bar_sort == "package")
      itembar.append(itemgroup)
    Object.keys(file.styles).forEach(function(x,i){
      packages[pkgname].styles[x] = {}
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/icons/"+file.styles[x].icon
      im.title = Object.keys(file.styles)[i]
      stylegroup.append(im)
    })
    if (bar_sort == "package") {
      itembar.append(stylegroup)
    }
    callback()
  },function(e){
    err(e)
  })
}
