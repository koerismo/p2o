var raycaster,
camera,
controls,
scene,
renderer,
mat_loader,
model_loader,
mouse,
pmouse,
mouseBeingHeld = 0,
holding_object = 0,
mouse_object,
keys = {},
items,
gridSize = 64,
selected

var selectionmat,
  hovering = {}

var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
var PI_2 = Math.PI / 2;
var vec = new THREE.Vector3();

//code modified from PointerLockControls.js
function onDocumentMouseMove(event) {
  if (mouseBeingHeld && holding_object && action == "holding_object") {
    let mp = getMousePos()
    if (mp)
      moveObjectToCursor(holding_object,mp)
  }
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  if (mouseBeingHeld && action == "moving_view") {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    euler.setFromQuaternion( camera.quaternion );
    euler.y -= movementX * 0.002;
    euler.x -= movementY * 0.002;
    euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
    camera.quaternion.setFromEuler( euler );
  }
}
function onDocumentMouseDown(event) {
  if (!mouseBeingHeld) {
    mouse_object = getSelectedObjects()
    //if (selected != undefined)
      //selected.object.material.emissive.setHex(0x0);
    selected = mouse_object[0]
    //if (mouse_object.length)
      //selected.object.material.emissive.setHex(0xfff);
  }
  mouseBeingHeld = 1;
  if ((mouse_object.length && mouse_object[0].object.name == "item") && action == "none"){
      //begin holding object
      action = "holding_object"
      holding_object = mouse_object[0].object;
  }
  else if (action == "none") {
    action = "moving_view"
    pointer_lock()

  }
}

function onDocumentMouseUp(event) {
  if (action != "toolbar")
    action = "none"
  pointer_unlock()
  mouseBeingHeld = 0
  holding_object = 0
}
function onDocumentKeyDown(event) {
  if (event.keyCode == 189) {
    scene.remove(selected.object)
  }
  if (event.keyCode == 187) {
    addVoxelFromSelection(selected)
  }
  if (event.keyCode == 219) {
    gridSize *= 0.5
    cubeGeo = new THREE.BoxGeometry( gridSize, gridSize, gridSize );
  }
  if (event.keyCode == 221) {
    gridSize *= 2
    cubeGeo = new THREE.BoxGeometry( gridSize, gridSize, gridSize );
  }
  keys[event.keyCode] = true;

}
function onDocumentKeyPress(event) {
}
function onDocumentKeyUp(event) {
  keys[event.keyCode] = false;
}

function getSelectedObjects() {
  raycaster.setFromCamera( mouse, camera );
  return raycaster.intersectObjects( scene.children ).filter(function(x){return x.object.material[x.face.materialIndex] != 0});
}

function getMousePos() {
  raycaster.setFromCamera( mouse, camera );
  let intlist = raycaster.intersectObjects( scene.children.filter(function(x){return x.name != "item"}) ).filter(function(x){return x.object.material[x.face.materialIndex] != 0});
  if (intlist.length)
    return intlist[0].point.divideScalar(gridSize).ceil().multiplyScalar(gridSize)//.addScalar(gridSize/2);
}

function render() {
  //camera.near = camera.position.distanceTo(center)
  //camera.updateProjectionMatrix()
  renderer.render( scene, camera );
}

function calcMat(mat,x,y,z) {
  return [
    [0,mat][1*(x == 5)],
    [0,mat][1*(x == -5)],
    [0,mat][1*(y == 5)],
    [0,mat][1*(y == -5)],
    [0,mat][1*(z == 5)],
    [0,mat][1*(z == -5)]
  ]
}

function recalcMat(x,y,z) {
  function getBlockAt(x,y,z) {
    return scene.children.filter(function(a){return a.position.x == x && a.position.y == y && a.position.z == z}).length > 0
  }
  scene.children.filter(function(a){return a.position.x == x && a.position.y == y && a.position.z == z})[0].material = [
    [0,mat][getBlockAt(x+gridSize,y,z)],
    [mat,0][getBlockAt(x-gridSize,y,z)],
    [mat,0][getBlockAt(x,y+gridSize,z)],
    [mat,0][getBlockAt(x,y-gridSize,z)],
    [mat,0][getBlockAt(x,y,z+gridSize)],
    [mat,0][getBlockAt(x,y,z-gridSize)]
  ]
}

function animate() {
  if (keys[87]) {
    moveForward(5)
  }
  if (keys[83]) {
    moveForward(-5)
  }
  if (keys[68]) {
    moveRight(5)
  }
  if (keys[65]) {
    moveRight(-5)
  }
  requestAnimationFrame( animate );
  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();

}

function init() {
  selectionmat = new THREE.MeshStandardMaterial( { emissive: 0xffffff, flatShading: true } );
  cubeGeo = new THREE.BoxGeometry( 64, 64, 64);

  raycaster = new THREE.Raycaster()

  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 4000 )
  camera.position.set( 0, -1, 0 );

  scene = new THREE.Scene()
  scene.background = new THREE.Color( "#000" );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.0005 );
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  var light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( - 1, - 1, - 1 );
  scene.add( light );
  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );
  //var axesHelper = new THREE.AxesHelper( 10 );
  //scene.add( axesHelper );
  //var gridHelper = new THREE.GridHelper( 10, 10 );
  //scene.add( gridHelper );

  mat_loader = new THREE.TextureLoader()
  diffuseTex = mat_loader.load( 'https://cdn.glitch.com/5c1db9b3-25f5-4e14-9f6f-7ab10f4855d0%2Fnormal_0.png?v=1584673408782');

  //model_loader = new THREE.OBJLoader()

  var geometry = new THREE.SphereBufferGeometry( 32 );
  mat = new THREE.MeshPhysicalMaterial( {map: diffuseTex} );
  mat.side = THREE.BackSide
  mat.shadowSide = THREE.BackSide
  cubeGeo = new THREE.BoxGeometry( gridSize, gridSize, gridSize);
  default_cube_mat = [mat,mat,mat,mat,mat,mat]

  for ( var z = -5; z <= 5; z ++ ) {
    for ( var y = -5; y <= 5; y ++ ) {
      for ( var x = -5; x <= 5; x ++ ) {
        addTile(x,y,z,cubeGeo,calcMat(mat,x,y,z))
      }
    }
  }

  var voxel = new THREE.Mesh( geometry, mat );
  voxel.name = "item"
  scene.add( voxel );
  var light = new THREE.PointLight( "#fff", 1, 500 );
  voxel.castShadow = false;
  light.castShadow = true;
  voxel.add(light)
  light.castShadow = true;
	light.shadow.camera.near = 8;
	light.shadow.camera.far = 30;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
  //light.position.set( 50, 50, 50 );

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )

  mouse = new THREE.Vector2(0,0)
  pmouse = new THREE.Vector2(0,0)

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
}

//code modified from PointerLockControls.js to allow vertical flying
function moveForward( distance ) {
  vec.setFromMatrixColumn( camera.matrix, 2 );
  camera.position.addScaledVector( vec, distance*-1 );

};

function moveRight( distance ) {
  vec.setFromMatrixColumn( camera.matrix, 2 );
  vec.cross( camera.up )
  camera.position.addScaledVector( vec, distance*-1 );
};

function pointer_lock() {
  renderer.domElement.requestPointerLock();
};

function pointer_unlock() {
  document.exitPointerLock();
};

function addTile(x,y,z,g,m) {
  var wall = new THREE.Mesh( g, m );
  wall.position.x = x*gridSize+gridSize/2;
  wall.position.y = y*gridSize+gridSize/2;
  wall.position.z = z*gridSize+gridSize/2;
  wall.updateMatrix();
  wall.matrixAutoUpdate = false;
  scene.add( wall );
}

function addVoxelFromSelection(intersect) {
  var voxel = new THREE.Mesh( cubeGeo, default_cube_mat );
  console.log(intersect.face.normal,intersect.point)
  voxel.position.copy( intersect.point ).sub( intersect.face.normal );
  voxel.position.divideScalar( gridSize ).floor().multiplyScalar( gridSize ).addScalar( gridSize/2 );
  voxel.castShadow = true;
  voxel.receiveShadow = true;
  voxel.matrixAutoUpdate  = false;
  voxel.updateMatrix();
  scene.add( voxel );
  /*recalcMat(voxel.position.x-gridSize,voxel.position.y,voxel.position.z)
  recalcMat(voxel.position.x+gridSize,voxel.position.y,voxel.position.z)
  recalcMat(voxel.position.x,voxel.position.y-gridSize,voxel.position.z)
  recalcMat(voxel.position.x,voxel.position.y+gridSize,voxel.position.z)
  recalcMat(voxel.position.x,voxel.position.y,voxel.position.z-gridSize)
  recalcMat(voxel.position.x,voxel.position.y,voxel.position.z+gridSize)*/
}

function getFace(intersect) {
  let ve = intersect.face.normal
  let li = [ve.x,ve.y,ve.z]
  let res = 0
  switch(li) {
    case [1,0,0]:
      res = 0
      break;
    case [-1,0,0]:
      res = 1
      break;
    case [0,1,0]:
      res = 2
      break;
    case [0,-1,0]:
      res = 3
      break;
    case [0,0,1]:
      res = 4
      break;
    case [0,0,-1]:
      res = 5
      break;
  }
  return res
}

function moveObjectToCursor(obj,pos) {
  obj.position.copy( pos )
  //obj.position.divideScalar( gridSize ).floor().multiplyScalar( gridSize ).addScalar( gridSize/2 );
}

init()
animate()
