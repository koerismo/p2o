var packages = {};
var action;
var itemgroup;
var bar_sort = ""
var item_dragging

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


function compileLevel(lvl,style) {
  //style should be in format of [package name, style name]
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //let temp = JSON.parse(this.responseText)
      alert((this.responseText))
      alert(["compile failed.","success."][(this.responseText)])
    }
  }
  xhr.open("POST", "/compile", true);
  xhr.setRequestHeader("data", JSON.stringify({pea:lvl,style:style}));
  xhr.send("");
}

function safeAdd(k,v) {
  if (itemgroup[k] == undefined)
    itemgroup[k] = document.createElement("DIV")
  itemgroup[k].append(v)
}

function additemstobar() {
  Object.keys(itemgroup).forEach(function(x){
    let title = document.createElement("H1")
    title.innerText = x
    itembar.append(title)
    itembar.append(itemgroup[x])
  })
}

function beginLoad(){
var errcount = 0;
itembar = $("#sidebar_left")
itemgroup = {}

console.log("retrieving packages...")
var completedPkgs = 0;
loadFile("packages.json",function(x){ //this file does not exist. When requested, the server should return a JSON formatted list of folders inside the packages folder
  var pkglist;
  eval("pkglist = "+x.response)
  console.log("found "+pkglist.length+" packages. Downloading...")
  pkglist.forEach(function(y,i){
      loadPackage(y,function(z){
        console.log("downloaded package "+(i+1)+"/"+pkglist.length)
        completedPkgs += 1
        $("#loader_bar")[0].style.background = 'linear-gradient(90deg,#999 '+(completedPkgs/pkglist.length*100)+'%,#000 '+(completedPkgs/pkglist.length*100)+'%)'
        if (completedPkgs == pkglist.length) {
          console.log("finished downloading packages with "+errcount+" skipped")
          setTimeout($("#loader")[0].classList.add("loader"),1000);
          additemstobar()
        }
      },function(x){
        errcount++
        console.error("failed to download package "+y)
        completedPkgs += 1
        $("#loader_bar")[0].style.background = 'linear-gradient(90deg,#999 '+(completedPkgs/pkglist.length*100)+'%,#000 '+(completedPkgs/pkglist.length*100)+'%)'
        if (completedPkgs == pkglist.length) {
            console.log("finished downloading packages with "+errcount+" skipped")
            setTimeout($("#loader")[0].classList.add("loader"),1000);
            additemstobar()
        }
      })
  })
})
}

function loadPackage(pkgname,callback,err) {
  loadFile("/packages/"+pkgname+"/package.json",function(x){
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
      im.title = x
      im.setAttribute("data-item","['"+pkgname+"','"+x+"']")
      im.ondragstart = function(){item_dragging = this.getAttribute("data-item")}
      if (bar_sort == "package")
        safeAdd(pkgname,im)
      else
        safeAdd(file.items[x].category,im)
    })
    Object.keys(file.styles).forEach(function(x,i){
      packages[pkgname].styles[x] = {}
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/icons/"+file.styles[x].icon
      im.title = x
      im.setAttribute("data-item","['"+pkgname+"','"+x+"']")
      im.ondragstart = function(){item_dragging = this.getAttribute("data-item")}
      if (bar_sort == "package")
        safeAdd(pkgname,im)
      else
        safeAdd("Style",im)
    })
    callback()
  },function(e){
    err(e)
  })
}
