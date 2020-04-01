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
function req(url,header,func) {
  var xhttp = new XMLHttpRequest();
  xhttp.callback = func
  xhttp.open("GET", url, true);
  if (header)
    xhttp.setRequestHeader("data",JSON.stringify(header))
  xhttp.send();
}

var itembar = document.getElementById("sidebar_left")
console.log("retrieving packages...")
loadFile("packages.json",function(x){ //this file does not exist. When requested, the server should return a JSON formatted list of folders inside the packages folder
  if (x.status) {
    JSON.parse(x.responseText).forEach(function(y){

      console.log("downloading "+y+"...")
      loadFile("packages/"+y+"/package.json",function(z){
        if (z.status) {
          console.log("downloaded "+y+" information.")
          var itemgroup = document.createElement("DIV")
          z.items.forEach(function(a){
            let im = document.createElement("IMG")
            im.src = "packages/"+y+"/editor/"+a.icon
            itemgroup.appendChild(im)
          })
          itembar.appendChild(itemgroup)
        }
        else {
          console.log("failed to download "+y+".")
        }
      })
    })
  }
})

function loadPackage(pkgname) {
  loadFile("/packages/"+pkgname+"/package.json",function(x){

    var itemgroup = document.createElement("DIV")
    let title = document.createElement("H1")
    title.innerText = pkgname
    itembar.appendChild(title)

    let file = JSON.parse(x.responseText)

    file.items.forEach(function(x){
      let im = document.createElement("IMG")
      im.src = "packages/"+pkgname+"/editor/"+x.icon
      itemgroup.appendChild(im)
    })
    itembar.appendChild(itemgroup)
  })
}
