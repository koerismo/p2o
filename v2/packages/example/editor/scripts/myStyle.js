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
  level.Blocks = level.Blocks.filter(function(x){return x.roles.ceiling != 1})
  var pwall = ["props/plasticwall003a","props/plasticwall003a","props/plasticwall003a","props/plasticwall003a","props/plasticwall003a","props/plasticwall003a"]
  level.style.boxes.push({box:[minX-256,minY-256,maxZ+640,maxX+256,maxY+256,maxZ+704],faces:pwall})//top
  level.style.boxes.push({box:[minX-256,minY-256,minZ-256,maxX+256,maxY+256,minZ-320],faces:pwall})//bottom
  level.style.boxes.push({box:[minX-320,minY-256,minZ-256,minX-256,maxY+256,maxZ+640],faces:pwall})//x
  level.style.boxes.push({box:[maxX+256,minY-256,minZ-256,maxX+320,maxY+256,maxZ+640],faces:pwall})
  level.style.boxes.push({box:[minX-256,minY-320,minZ-256,maxX+256,minY-256,maxZ+640],faces:pwall})//y
  level.style.boxes.push({box:[minX-256,maxY+256,minZ-256,maxX+256,maxY+320,maxZ+640],faces:pwall})
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
      "origin":((maxX-64)+" "+(maxY+64)+" "+z)
    })
    level.style.entities.push({
      "classname":"prop_static",
      "angles":"0 90 0",
      "model":"models/props_underground/truss_64_256.mdl",
      "origin":((minX-64)+" "+(maxY+64)+" "+z)
    })
  }
  return level
}
