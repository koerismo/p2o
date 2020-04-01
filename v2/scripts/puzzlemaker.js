var packages;

/*function req(url,header,func) {
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
})*/

function fm(ar,s,x,y,z) {
  return (ar[0]*s/2+x)+" "+(ar[1]*s/2+y)+" "+(ar[2]*s/2+z)
}

/*
in-editor packages format
{
  "example":{
    "Turret":{
      "instance":"turret.vmf",
      "icon":"insertbase64image",
      "model":"insert3dsmodel",
      "texture":"insertmodeltexture"
    }
  }
}
*/
function genVMF(level) {
  var baseid = 0;
  var out = "";
  let calcB = genGeometry(level.Blocks)
  out += vmf.genHead()
  calcB.forEach(function(x){
    out += vmf.genCube(baseid,x.scale,x.x,x.y,x.z)
    baseid += 1
  })
  out += "}\n"
  level.Entities.forEach(function(x){
    out += vmf.genEnt(baseid,packages[x.item[0]][x.item[1]].instance,[x.rot_x,x.rot_y,x.rot_z],[x.x,x.y,x.z])
    baseid += 1
  })
  out += vmf.genFooter()
  return out
}

var vmf = {
  genHead:function(){
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
}
world
{
"id" "1"
"mapversion" "1"
"classname" "worldspawn"
"detailmaterial" "detail/detailsprites"
"detailvbsp" "detail.vbsp"
"maxblobcount" "250"
"maxpropscreenwidth" "-1"
"skyname" "sky_black_nofog"
`
    return hde
  },
  genCube:function(id,s,x,y,z){
    var output = `
solid
{
"id" "`+id+`"
`
    var faces = [
      [[-1,1,1],   [1,1,1],      [1,-1,1]],
			[[-1,-1,-1], [1,-1,-1],     [1,1,-1]],
			[[-1,1,1],   [-1,-1,1],    [-1,-1,-1]],
			[[1,1,-1],   [1,-1,-1],    [1,-1,1]],
			[[1,1,1],    [-1,1,1],     [-1,1,-1]],
			[[1,-1,-1],  [-1,-1,-1],   [-1,-1,1]]
    ]
    var uvs = [
      [[1,0,0],[0,0,-1]],
      [[1,0,0],[0,0,-1]],
      [[0,1,0],[0,0,-1]],
      [[0,1,0],[0,0,-1]],
      [[1,0,0],[0,-1,0]],
      [[1,0,0],[0,-1,0]]
    ]
    faces.forEach(function(n,i){
let fce = `
side
{
"id" "`+(i+id*6)+`"
"plane" "(`+fm(n[0],s,x,y,z)+`) (`+fm(n[1],s,x,y,z)+`) (`+fm(n[2],s,x,y,z)+`)"
"material" "/PAINTBLOB"
"uaxis" "[`+uvs[i][0].join(" ")+` 0] 0.25"
"vaxis" "[`+uvs[i][1].join(" ")+` 0] 0.25"
"rotation" "0"
"lightmapscale" "16"
"smoothing_groups" "0"
}`
output += fce
})
return output+`
editor
{
  "color" "0 212 241"
  "visgroupshown" "1"
  "visgroupautoshown" "1"
}
}
`
  },
  genEnt:function(id,inst,angles,pos) {
return `
entity
{
"id" "`+id+`"
"classname" "func_instance"
"angles" "`+angles.join(" ")+`"
"file" "`+inst+`"
"fixup_style" "0"
"origin" "`+pos.join(" ")+`"
}`
  },
  genFooter:function() {
    return `
cameras
{
	"activecamera" "-1"
}
cordons
{
	"active" "0"
}`
  }
}

function genGeometry(blocks) {
  function checkBlock(x,y,z) {
    let pa = blocks.filter(function(a){
      return (a.x == x && a.y == y && a.z == z)
    }).length > 0
    let pb = out.filter(function(a){
      return (a.x == x && a.y == y && a.z == z)
    }).length > 0
    return (pa||pb)
  }
  var out = []
  blocks.forEach(function(x){
    if (!checkBlock(x.x+x.scale,x.y,x.z)) {
      out.push({x:x.x+x.scale,y:x.y,z:x.z,scale:x.scale})
    }
    if (!checkBlock(x.x-x.scale,x.y,x.z)) {
      out.push({x:x.x-x.scale,y:x.y,z:x.z,scale:x.scale})
    }
    if (!checkBlock(x.x,x.y+x.scale,x.z)) {
      out.push({x:x.x,y:x.y+x.scale,z:x.z,scale:x.scale})
    }
    if (!checkBlock(x.x,x.y-x.scale,x.z)) {
      out.push({x:x.x,y:x.y-x.scale,z:x.z,scale:x.scale})
    }
    if (!checkBlock(x.x,x.y,x.z+x.scale)) {
      out.push({x:x.x,y:x.y,z:x.z+x.scale,scale:x.scale})
    }
    if (!checkBlock(x.x,x.y,x.z-x.scale)) {
      out.push({x:x.x,y:x.y,z:x.z-x.scale,scale:x.scale})
    }
  })
  return out
}
//genVMF({Blocks:[{x:0,y:0,z:0,scale:128},{x:0,y:0,z:0,scale:128}],Entities:[]})
