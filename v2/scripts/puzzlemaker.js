//"instance:floor_button;OnUnPressed" "``,instance:turret;SelfDestructImmediately,,0,-1"
function fm(ar,s,x,y,z) {
  return (ar[0]*s/2+x)+" "+(ar[1]*s/2+y)+" "+(ar[2]*s/2+z)
}

function dictToKV(dic) {
  return Object.keys(dic).map(function(key){return '\"'+key+'\" \"'+dic[key]+'\"'}).join("\n")
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
exports.compileAll = function(level,style) {
  var as = require(style)
  var compile0, compile1, compile2;
  try {
    compile0 = as.stylePEA(level) // external wall compiler
    saveCompile("compiled",compile0,"pec")
    console.log("generated PEC")
    compile2 = genVMF(compile0)
    saveCompile("compiled",compile2,"vmf")
    console.log("generated VMF")
  }
  catch {
    compile0 = {Blocks:genGeometry(level.Blocks),Entities:level.Entities,style:{boxes:[],entities:[]}} // internal wall compiler
    console.log("generated PEC")
    compile1 = as.stylePEC(compile0) //stylize pec
    console.log("stylized PEC")
    saveCompile("compiled",compile2,"pec")
    compile2 = genVMF(compile1) //pec to vmf
    saveCompile("compiled",compile2,"vmf")
    console.log("generated VMF")
  }
  return compile2
}

function genVMF(pec) {
  var baseid = 0;
  var out = "";
  out += vmf.genHead()
  pec.Blocks.forEach(function(x){
    out += vmf.genCube(baseid,x.scale,x.x,x.y,x.z,
      x.faces.map(function(e,r){
        return as.getRandomTexture(e,x.x,x.y,x.z,r)
      })
    )
    baseid += 1
  })
  pec.style.boxes.forEach(function(x){
    out += vmf.genCubeR(baseid,x.box,x.faces)
    baseid += 1
  })
  out += "}\n"
  pec.Entities.forEach(function(x,i){
    out += vmf.genEnt(baseid,x,[x.rot_x,x.rot_y,x.rot_z],[x.x,x.y,x.z],i,pec)
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
  genCube:function(id,s,x,y,z,mats){
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
//let mats = ['metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_wall_metal_002e','metal/black_floor_metal_001a','metal/black_floor_metal_001a']
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
  genCubeR:function(id,box,sides){
    var output = `
solid
{
"id" "`+id+`"
`
    var x1 = Math.min(box[0],box[3])
    var y1 = Math.min(box[1],box[4])
    var z1 = Math.min(box[2],box[5])
    var x2 = Math.max(box[0],box[3])
    var y2 = Math.max(box[1],box[4])
    var z2 = Math.max(box[2],box[5])
    console.log(x1,y1,z1,x2,y2,z2)
    var faces = [
      [[x1,y2,z2],[x2,y2,z2],[x2,y1,z2]],
			[[x1,y1,z1],[x2,y1,z1],[x2,y2,z1]],
			[[x1,y2,z2],[x1,y1,z2],[x1,y1,z1]],
			[[x2,y2,z1],[x2,y1,z1],[x2,y1,z2]],
			[[x2,y2,z2],[x1,y2,z2],[x1,y2,z1]],
			[[x2,y1,z1],[x1,y1,z1],[x1,y1,z2]]
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
"plane" "(`+n[0].join(" ")+`) (`+n[1].join(" ")+`) (`+n[2].join(" ")+`)"
"material" "`+sides[i]+`"
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
  genEnt:function(id,it,angles,pos,itemid,level) {
return `
entity
{
"id" "`+id+`"
"classname" "func_instance"
"angles" "`+angles.join(" ")+`"
"file" "`+packages[it.item[0]].items[it.item[1]].instance+`"
"fixup_style" "0"
"origin" "`+pos.join(" ")+`"
"targetname" "ITEM_`+itemid+`"
connections
{
`+genConnections(level,it)+`
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
    /*let pa = blocks.filter(function(a){
      return ((a.x+a.scale/2 > x-si/2 && a.y+a.scale/2 > y-si/2 && a.z+a.scale/2 > z-si/2) &&
      (a.x-a.scale/2 < x+si/2 && a.y-a.scale/2 < y+si/2 && a.z-a.scale/2 < z+si/2))
    }).length > 0*/
    let pb = out.filter(function(a){
      return ((a.x+a.scale/2 > x-si/2 && a.y+a.scale/2 > y-si/2 && a.z+a.scale/2 > z-si/2) &&
      (a.x-a.scale/2 < x+si/2 && a.y-a.scale/2 < y+si/2 && a.z-a.scale/2 < z+si/2))
    }).length > 0
    return (pb)
  }
  function checkAir(x,y,z,si) {
    let pa = blocks.filter(function(a){
      return ((a.x+a.scale/2 > x-si/2 && a.y+a.scale/2 > y-si/2 && a.z+a.scale/2 > z-si/2) &&
      (a.x-a.scale/2 < x+si/2 && a.y-a.scale/2 < y+si/2 && a.z-a.scale/2 < z+si/2))
    }).length > 0
    return (pa)
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
                    faces:[x.faces[1]+"_wall",x.faces[0]+"_wall",x.faces[3]+"_wall",x.faces[2]+"_wall",x.faces[5]+"_floor",x.faces[4]+"_ceil"],
                    roles:{floor:checkBlock(x.x,x.y,x.z+x.scale,x.scale),ceiling:checkBlock(x.x,x.y,x.z-x.scale,x.scale),wall:(
                      checkAir(x.x+x.scale,x.y,x.z,x.scale) |
                      checkAir(x.x-x.scale,x.y,x.z,x.scale) |
                      checkAir(x.x,x.y+x.scale,x.z,x.scale) |
                      checkAir(x.x,x.y-x.scale,x.z,x.scale))
                    }
                  })
        }}
      }
    }
  })

  return out
}
//genVMF({Blocks:[{x:0,y:0,z:0,scale:128},{x:0,y:0,z:0,scale:128}],Entities:[]})
function genConnections(level,it) {
  if (it.itemOutputs) {
    return Object.keys(it.itemOutputs).map(function(x){
    	// TODO: input event and output are undefined when compiled
	// get item info from package, get connection info from item info, get connection event
      let output_event = packages[it.item[0]].items[it.item[1]].itemOutputs[it.itemOutputs[x].event]
      // get item from level using index provided by output, get item info from package, get connection info and input event
      let output = packages[level.Entities[x].item[0]].items[level.Entities[x].item[1]].itemInputs[it.itemOutputs[x].input]
    	return '\"'+output_event+'\" \"ITEM_'+x+','+output+',,0,-1\"'
    }).join("\n")
  }
  return "\n"
}
