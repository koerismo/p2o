var packages = {};
var action;

function loadFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function () {
        console.error("The request for " + url + " timed out.");
    };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(xhr)
            } else {
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

function beginLoad(){
itembar = $("#sidebar_left")
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
        setTimeout($("#loader")[0].classList.add("loader"),1000);
      }
    })
  })
})
}

function loadPackage(pkgname,callback) {
  loadFile("/packages/"+pkgname+"/package.json",function(x){

    var itemgroup = document.createElement("DIV")
    let title = document.createElement("H1")
    title.innerText = pkgname
    itembar.append(title)

    var file;
    eval("file = "+x.response)
    packages[pkgname] = {"items":{},"styles":{}}
    Object.keys(file.items).forEach(function(x){
      packages[pkgname]["items"][x] = {}
      loadFile("packages/"+pkgname+"/editor/models/"+file.items[x].model,function(y){
        packages[pkgname]["items"][x].model = y
      })
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/icons/"+file.items[x].icon
      itemgroup.append(im)
    })
    itembar.append(itemgroup)
    Object.keys(file.styles).forEach(function(x){
        $.ajax({
          url: ("packages/"+pkgname+"/editor/scripts/"+file.styles[x].script),
          mimeType: "application/javascript",
          cache:true
        });
    })
  })
}
