var packages;

function req(url,header,func) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     func(this)
     return;
    }
    func(this.status)
  };
  xhttp.open("GET", url, true);
  if (header)
  xhttp.setRequestHeader("data",JSON.stringify(header))
  xhttp.send();
}

console.log("retrieving packages...")
req("resources/packages.json",false,function(x){
  console.log("downloading last used...")
  if (x.status) {
    JSON.parse(x.responseText).list.forEach(function(x){
      console.log("downloading "+x+"...")
      req("packages/"+x+"/package.json",false,function(y){
        if (y.status) {
          console.log("downloaded "+x+" information.")
          y.items.forEach(function(x){
            loadImage(load("packages/"+x+"/editor/"+y.icon))
          })
        }
        else {
          console.log("failed to download "+x+".")
        }
      })
    })
  }
})
