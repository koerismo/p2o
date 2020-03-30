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
selected;

var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
var PI_2 = Math.PI / 2;
var vec = new THREE.Vector3();

//code modified from PointerLockControls.js
function onDocumentMouseMove(event) {
  if (mouseBeingHeld && holding_object) {
    let mp = getMousePos()
    if (mp)
      moveObjectToCursor(mouse_object[0].object,mp)
  }
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  if (mouseBeingHeld && !holding_object) {
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
  if ((mouse_object.length && mouse_object[0].object.name == "item")){
      //begin holding object
      holding_object = 1;
  }
  else {
    pointer_lock()

  }
}

function onDocumentMouseUp(event) {
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
  return raycaster.intersectObjects( scene.children );
}

function getMousePos() {
  raycaster.setFromCamera( mouse, camera );
  let intlist = raycaster.intersectObjects( scene.children.filter(function(x){return x.name != "item"}) )
  if (intlist.length)
    return intlist[0].point.divideScalar(gridSize).floor().multiplyScalar(gridSize).addScalar(gridSize/2);
}

function render() {
  //camera.near = camera.position.distanceTo(center)
  //camera.updateProjectionMatrix()
  renderer.render( scene, camera );
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
  material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  cubeGeo = new THREE.BoxGeometry( 64, 64, 64);

  raycaster = new THREE.Raycaster()

  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 4000 )
  camera.position.set( 0, -1, 0 );

  scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xcccccc );
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
  material = new THREE.MeshPhysicalMaterial( {map: diffuseTex} );
  cubeGeo = new THREE.BoxGeometry( gridSize, gridSize, gridSize);

  for ( var z = -5; z <= 5; z ++ ) {
    for ( var y = -5; y <= 5; y ++ ) {
      for ( var x = -5; x <= 5; x ++ ) {
        if (Math.abs(x) > 4 || Math.abs(y) > 4 || Math.abs(z) > 4)
        addTile(x,y,z,cubeGeo,material)
      }
    }
  }

  var voxel = new THREE.Mesh( geometry, material );
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
  //document.addEventListener( 'click', onDocumentMouseClick, false );
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
  var voxel = new THREE.Mesh( cubeGeo, material );
  voxel.position.copy( intersect.point ).add( intersect.face.normal );
  voxel.position.divideScalar( gridSize ).floor().multiplyScalar( gridSize ).addScalar( gridSize/2 );
  voxel.castShadow = true;
  voxel.receiveShadow = true;
  voxel.matrixAutoUpdate  = false;
  voxel.updateMatrix();
  scene.add( voxel );
}

function moveObjectToCursor(obj,pos) {
  obj.position.copy( pos )
  //obj.position.divideScalar( gridSize ).floor().multiplyScalar( gridSize ).addScalar( gridSize/2 );
}

init()
animate()
