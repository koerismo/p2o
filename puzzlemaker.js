function genChamber(x1,y1,z1,x2,y2,z2) {
  //x y z
  var chb = Array(Math.abs(z2-z1)).fill(Array(Math.abs(y2-y1)).fill(Array(Math.abs(x2-x1).fill([-1,-1,-1,-1,-1,-1])))) //x+ x- y+ y- z+ z-
  chb.map(function(e1,i1){
    e1.map(function(e2,i2){
      e2.map(function(e3,i3){
        //make chamber walls
        return [
          [-1,0][i2 == 0],
          [-1,0][i2 == y2-y1],
          [-1,0][i1 == 0],
          [-1,0][i1 == z2-z1],
          [-1,0][i3 == 0],
          [-1,0][i3 == x2-x1]
        ]
      })
    })
  })
  return chb
}

function addBlock(lvl,x,y,z) {
  //only add faces where there is an empty block
  lvl[x][y][z] = [
    +(lvl[x+1][y][z][1] == -1),
    +(lvl[x-1][y][z][0] == -1),
    +(lvl[x][y+1][z][3] == -1),
    +(lvl[x][y-1][z][2] == -1),
    +(lvl[x][y][z+1][5] == -1),
    +(lvl[x][y][z-1][4] == -1)
  ]
  //make all adjacent blocks join
  lvl[x+1][y][z][1] = -1
  lvl[x-1][y][z][0] = -1
  lvl[x][y+1][z][3] = -1
  lvl[x][y-1][z][2] = -1
  lvl[x][y][z+1][5] = -1
  lvl[x][y][z-1][4] = -1
}

function removeBlock(lvl,x,y,z) {
  lvl[x+1][y][z][1] = +(lvl[x][y][z][0] == -1)
  lvl[x-1][y][z][0] = +(lvl[x][y][z][1] == -1)
  lvl[x][y+1][z][3] = +(lvl[x][y][z][2] == -1)
  lvl[x][y-1][z][2] = +(lvl[x][y][z][3] == -1)
  lvl[x][y][z+1][5] = +(lvl[x][y][z][4] == -1)
  lvl[x][y][z-1][4] = +(lvl[x][y][z][5] == -1)
  lvl[x][y][z] = [-1,-1,-1,-1,-1,-1]
}
