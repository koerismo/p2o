function executeStyle(l) {
  var l = level
  let xlist = level.Blocks.sort(function(a,b){return a.x > b.x})
  let minX = xlist[0]
  let maxX = xlist.pop()
  let ylist = level.Blocks.sort(function(a,b){return a.y > b.y})
  let minY = ylist[0]
  let maxY = ylist.pop()
  let zlist = level.Blocks.sort(function(a,b){return a.z > b.z})
  let minZ = zlist[0]
  let maxZ = zlist.pop()
  level.Blocks = level.Blocks.filter(function(x){return x.role.ceiling != 1 | x.role.floor | x.role.wall})
  //up
  level.StyleSolids.push({minX,maxY+128,minZ,maxX+96,maxY,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  //down
  level.StyleSolids.push({minX,minY-64,minZ,maxX,minY-96,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  //minX
  level.StyleSolids.push({minX,minY-64,minZ,minX,maxY+96,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  //maxX
  level.StyleSolids.push({maxX,minY,minZ,maxX,maxY,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  //minZ
  level.StyleSolids.push({minX,maxY,minZ,maxX,maxY,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  //maxZ
  level.StyleSolids.push({minX,minY,maxZ,maxX,maxY,maxZ,["tools/nodraw","tools/nodraw","tools/nodraw","tools/nodraw","tools/skybox","tools/nodraw"]})
  for (var x = minX; x < maxX; x+= 256) {
    for (var z = minZ; z < maxZ; z+= 256) {
      level.StyleEnts.push({
      	"classname":"prop_static",
      	"angles":"0 0 0"
      	"model":"models/anim_wp/framework/squarebeam_off_8x8.mdl",
        "origin":(x+" "+maxY+" "+z)
      })
    }
  }
  return level
}
