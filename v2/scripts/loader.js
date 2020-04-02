var packages = {};

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

var itembar = $("#sidebar_left")

itembar.onmouseenter = function(){
  console.log("bruh")
  action = "toolbar"
}
itembar.onmouseleave = function(){
  action = "none"
}

console.log("retrieving packages...")
loadFile("packages.json",function(x){ //this file does not exist. When requested, the server should return a JSON formatted list of folders inside the packages folder
  var pkglist = JSON.parse(x.response)
  console.log("found "+pkglist.length+" packages. Downloading...")
  pkglist.forEach(function(y,i){
    loadPackage(y,function(z){
      console.log("downloaded package "+i+"/"+pkglist.length)
    })
  })
})

function loadPackage(pkgname,callback) {
  loadFile("/packages/"+pkgname+"/package.json",function(x){

    var itemgroup = document.createElement("DIV")
    let title = document.createElement("H1")
    title.innerText = pkgname
    itembar.append(title)

    let file = JSON.parse(x.responseText)

    file.items.forEach(function(x){
      loadFile("packages/"+pkgname+"/editor/"+x.model,function(x){
        packages[pkgname][x.name]
      })
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/"+x.icon
      itemgroup.append(im)
    })
    itembar.append(itemgroup)
  })
}
