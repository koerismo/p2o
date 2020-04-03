function stylePEC(l) {
  var l = level
  let xlist = level.Blocks.sort(function(a,b){return a.x > b.x})
  let minX = xlist[0]
  let maxX = xlist.pop()
  maxX = Math.ceil((maxX-minX)/256)*256+minX
  let ylist = level.Blocks.sort(function(a,b){return a.y > b.y})
  let minY = ylist[0]
  let maxY = ylist.pop()
  maxY = Math.ceil((maxY-minY)/256)*256+minY
  let zlist = level.Blocks.sort(function(a,b){return a.z > b.z})
  let minZ = zlist[0]
  let maxZ = zlist.pop()
  /*
    skybox offset coords
    (-128,64,128) (-64,-64,-64)
    (64,64,128) (128,-64,-64)

    (-64,128,192) (64,64,128)
    (-64,-64,192) (64,-128,192)

    (-64,64,192) (64,-64,128)
    (-64,64,-64) (64,-64,-128)
    */
  level.Blocks = level.Blocks.filter(function(x){return x.role.ceiling != 1 | x.role.floor | x.role.wall})

  level.style.boxes.push({box:[maxX+64,maxY+64,maxZ-64,maxX+128,minY-64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//x max
  level.style.boxes.push({[minX-128,maxY+64,minZ-64,minX-64,minX-64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//x min
  level.style.boxes.push({[minX-64,maxX+128,minZ-64,maxX+64,maxY+64,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//y max
  level.style.boxes.push({[maxX-64,minY-64,minZ-64,maxX+64,min-128,maxZ+128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//y min
  level.style.boxes.push({[minX-64,maxY+64,maxZ+128,maxX+64,maxY-64,maxZ+192],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//z max
  level.style.boxes.push({[minX-64,maxY+64,minZ-64,maxX+64,minY-64,maxZ-128],faces:["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw"]})//z min
  for (var x = minX; x < maxX; x+= 256) {
    for (var z = minZ; y < maxZ; z+= 256) {
      level.style.entities.push({
      	"classname":"prop_static",
      	"angles":"0 0 0"
      	"model":"models/anim_wp/framework/squarebeam_off_8x8.mdl",
        "origin":(x+" "+y+" "+(maxZ+96))
      })
    }
  }
  return level
}
