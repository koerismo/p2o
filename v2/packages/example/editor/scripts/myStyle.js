function stylePEC(l) {
  var level = l
  let xlist = level.Blocks.sort(function(a,b){return a.x > b.x})
  let minX = xlist[0].x-xlist[0].scale/2
  let maxX = xlist.reverse()[0].x+xlist.reverse()[0].scale/2
  maxX = Math.ceil((maxX-minX)/256)*256+minX
  let ylist = level.Blocks.sort(function(a,b){return a.y > b.y})
  let minY = ylist[0].y-ylist[0].scale/2
  let maxY = ylist.reverse()[0].y+ylist.reverse()[0].scale/2
  maxY = Math.ceil((maxY-minY)/256)*256+minY
  let zlist = level.Blocks.sort(function(a,b){return a.z > b.z})
  let minZ = zlist[0].z-zlist[0].scale/2
  let maxZ = zlist.reverse()[0].z+zlist.reverse()[0].scale/2
  /*
    skybox offset coords
    (-128,64,128) (-64,-64,-64)
    (64,64,128) (128,-64,-64)

    (-64,128,192) (64,64,128)
    (-64,-64,192) (64,-128,192)

    (-64,64,192) (64,-64,128)
    (-64,64,-64) (64,-64,-128)
    */
  level.Blocks = level.Blocks.filter(function(x){return x.roles.ceiling != 1 | x.roles.wall == 1})
  console.log(minX,minY,minZ,maxX,maxY,maxZ)
  level.style.boxes.push({box:[maxX+64,maxY+64,maxZ-64,maxX+128,minY-64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//x max
  level.style.boxes.push({box:[minX-128,maxY+64,minZ-64,minX-64,minX-64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//x min
  level.style.boxes.push({box:[minX-64,maxX+128,minZ-64,maxX+64,maxY+64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//y max
  level.style.boxes.push({box:[maxX-64,minY-64,minZ-64,maxX+64,minY-128,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//y min
  level.style.boxes.push({box:[minX-64,maxY+64,maxZ+128,maxX+64,maxY-64,maxZ+192],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//z max
  level.style.boxes.push({box:[minX-64,maxY+64,minZ-64,maxX+64,minY-64,maxZ-128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//z min
  level.style.entities.push({
    "classname":"prop_static",
    "angles":"0 90 0",
    "model":"models/props_bts/gantry_truss_a.mdl",
    "origin":(minX+maxX)/2+" "+(minY+maxY)/2+" "+(maxZ+512)
  })
  for (var x = minX; x < maxX; x+= 256) {
    for (var y = minY; y < maxY; y+= 256) {
      level.style.entities.push({
      	"classname":"prop_static",
      	"angles":"0 0 0",
      	"model":"models/anim_wp/framework/squarebeam_off_4x4.mdl",
        "origin":((x)+" "+(y)+" "+(maxZ+128))
      })
    }
  }
  for (var z = minZ-64; z < maxZ+128; z += 256) {
    level.style.entities.push({
      "classname":"prop_static",
      "angles":"0 90 0",
      "model":"models/props_underground/truss_64_256.mdl",
      "origin":((minX-64)+" "+(minY-64)+" "+z)
    })
    level.style.entities.push({
      "classname":"prop_static",
      "angles":"0 90 0",
      "model":"models/props_underground/truss_64_256.mdl",
      "origin":((maxX-64)+" "+(minY-64)+" "+z)
    })
    level.style.entities.push({
      "classname":"prop_static",
      "angles":"0 90 0",
      "model":"models/props_underground/truss_64_256.mdl",
      "origin":((maxX-64)+" "+(maxY-64)+" "+z)
    })
    level.style.entities.push({
      "classname":"prop_static",
      "angles":"0 90 0",
      "model":"models/props_underground/truss_64_256.mdl",
      "origin":((minX-64)+" "+(maxY-64)+" "+z)
    })
  }
  return level
}
