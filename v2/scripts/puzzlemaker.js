
//"instance:floor_button;OnUnPressed" "``,instance:turret;SelfDestructImmediately,,0,-1"

function fm(ar,s,x,y,z) {
  return (ar[0]*s/2+x)+" "+(ar[1]*s/2+y)+" "+(ar[2]*s/2+z)
}

dictToKV(dic) {
  return Object.keys(dic).map(function(key){return '\"'+key+'\" \"'+dictionary[key]+'\"'}).join("\n")
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
function compileAll(level) {
  var compile0, compile1, compile2;
  try {
    compile0 = stylePEA(level.Blocks) // external wall compiler
    compile2 = genVMF(compile0)
  }
  catch {
    compile0 = genGeometry(level.Blocks) // internal wall compiler
    compile1 = stylePEC(compile0) //stylize pec
    compile2 = genVMF(compile1) //pec to vmf
  }
  return compile2
}

function genVMF(pec) {
  var baseid = 0;
  var out = "";
  out += vmf.genHead()
  pec.Blocks.forEach(function(x){
    out += vmf.genCube(baseid,x.scale,x.x,x.y,x.z)
    baseid += 1
  })
  pec.style.boxes.forEach(function(x){
    out += vmf.genCubeR(baseid,x.scale,x.x,x.y,x.z,x.faces)
    baseid += 1
  })
  out += "}\n"
  pec.Entities.forEach(function(x){
    out += vmf.genEnt(baseid,packages[x.item[0]][x.item[1]].instance,[x.rot_x,x.rot_y,x.rot_z],[x.x,x.y,x.z])
    baseid += 1
  })
  pec.style.entities.forEach(function(x){
    out += vmf.genEntR(baseid,dictToKV(x))
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
let mats = ['metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_floor_metal_001a','metal/black_floor_metal_001a']
let fce = `
side
{
"id" "`+(i+id*6)+`"
"plane" "(`+fm(n[0],s,x,y,z)+`) (`+fm(n[1],s,x,y,z)+`) (`+fm(n[2],s,x,y,z)+`)"
"material" "`+mats[i]+`"
"uaxis" "[`+uvs[i][0].join(" ")+` -256] 0.25"
"vaxis" "[`+uvs[i][1].join(" ")+` -256] 0.25"
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
  genEnt:function(id,inst,angles,pos,connections) {
return `
entity
{
"id" "`+id+`"
"classname" "func_instance"
"angles" "`+angles.join(" ")+`"
"file" "`+inst+`"
"fixup_style" "0"
"origin" "`+pos.join(" ")+`"
"targetname" "ITEM_`+id+`"
connections
{
`+genConnections()+`
}
}`
  },
  genEntR:function(id,kv) {
return `
entity
{
"id" "`+id+`"
`+kv+`
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
  var out = []
  function checkBlock(x,y,z,si) {
    let pa = blocks.filter(function(a){
      return ((a.x+a.scale/2 > x-si/2 && a.y+a.scale/2 > y-si/2 && a.z+a.scale/2 > z-si/2) &&
      (a.x-a.scale/2 < x+si/2 && a.y-a.scale/2 < y+si/2 && a.z-a.scale/2 < z+si/2))
    }).length > 0
    let pb = out.filter(function(a){
      return ((a.x+a.scale/2 > x-si/2 && a.y+a.scale/2 > y-si/2 && a.z+a.scale/2 > z-si/2) &&
      (a.x-a.scale/2 < x+si/2 && a.y-a.scale/2 < y+si/2 && a.z-a.scale/2 < z+si/2))
    }).length > 0
    return (pa||pb)
  }
  let blk = blocks.sort(function(a,b) {return a.scale < b.scale})
  blk.forEach(function(x){
    for (var px = -1; px <= 1; px++) {
      for (var py = -1; py <= 1; py++) {
        for (var pz = -1; pz <= 1; pz++) {
          if (px != 0 || py != 0 || pz != 0) {
          if (!checkBlock(x.x+px*x.scale,x.y+py*x.scale,x.z+pz*x.scale,x.scale))
            out.push({x:x.x+px*x.scale,
                    y:x.y+py*x.scale,
                    z:x.z+pz*x.scale,
                    scale:x.scale,
                    roles:{wall:(py==0),floor:(py==-1),ceiling:(py==1)},
                    sides:[{role:x.faces[1],texture:},{},{}]
                  })
        }}
      }
    }
  })
  return out
}
//genVMF({Blocks:[{x:0,y:0,z:0,scale:128},{x:0,y:0,z:0,scale:128}],Entities:[]})
