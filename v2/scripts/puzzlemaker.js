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
req("resources/packages.json",false,function(x){ //this file does not exist. When requested, the server should return a JSON formatted list of folders inside the packages folder
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

function fm(ar,s) {
  return ar.map(function(x){return x*s}).join(" ")
}

var vmf = {
  genhead:function(){
let hde =
`visgroups
{
}
viewsettings
{
  "bSnapToGrid" "1"
	"bShowGrid" "1"
	"bShowLogicalGrid" "0"
	"nGridSpacing" "64"
	"bShow3DGrid" "0"
}`
    return hde
  },
  genCube:function(id,size,x,y,z){
    var output = `
solid
{
"id" "`+id+`"
`
    let faces = [
      [[-1,1,1],[1,1,1],[1,-1,1]],
      [[-1,-1,-1],[1,-1,-1],[1,1,-1]],
      [[1,1,-1],[1,-1,-1],[-1,-1,-1]],
      [[1,1,-1],[1,-1,-1],[1,-1,1]],
      [[1,1,1],[-1,1,1],[-1,1,-1]],
      [[1,-1,-1],[-1,-1,-1],[-1,-1,1]]
    ]
    faces.forEach(function(x,i){
      x.forEach(y) {
let fce = `
side
{
"id" "`+(i+id*6)+`"
"plane" "(`+fm(y[0],size)+`) (`+fm(y[1],size)+`) (`+fm(y[2],size)+`)"
"material" "/PAINTBLOB"
"uaxis" "[1 0 0 0] 0.25"
"vaxis" "[0 -1 0 0] 0.25"
"rotation" "0"
"lightmapscale" "16"
"smoothing_groups" "0"
}`
output += fce
      }
    })
    return output+`
}
`
  }
}
