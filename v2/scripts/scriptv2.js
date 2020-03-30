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
holding_object = 0

var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
var PI_2 = Math.PI / 2;
var vec = new THREE.Vector3();

function onDocumentMouseMove(event) {
  if (mouseBeingHeld && !holding_object) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    console.log(movementX,movementY)
    euler.setFromQuaternion( camera.quaternion );
    euler.y -= movementX * 0.002;
    euler.x -= movementY * 0.002;
    euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
    camera.quaternion.setFromEuler( euler );
  }
}
function onDocumentMouseDown(event) {
  let mouse_object = getSelectedObjects()
  holding_object = (mouse_object.length > 0)
  mouseBeingHeld = 1;
  if (mouse_object.length)
    mouse_object = mouse_object[0]
  else
    pointer_lock()
    return;
}
function onDocumentMouseUp(event) {
  pointer_unlock()
  mouseBeingHeld = 0
  holding_object = 0
}
function onDocumentKeyDown(event) {
  //camera.position.addScalar((0,50,0));
  if (event.keyCode == 87) {
    moveForward(1)
  }

}
function onDocumentKeyUp(event) {

}

function getSelectedObjects() {
  raycaster.setFromCamera( mouse, camera );
  return raycaster.intersectObjects( scene.children );
}

function render() {
  //camera.near = camera.position.distanceTo(center)
  //camera.updateProjectionMatrix()
  renderer.render( scene, camera );
}

function animate() {
  requestAnimationFrame( animate );
  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();

}

function init() {
  material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  cubeGeo = new THREE.BoxGeometry( 64, 64, 64);

  raycaster = new THREE.Raycaster()

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 )
  camera.position.set( -50, -50, 0 );

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
  //var voxel = new THREE.Mesh( cubeGeo, material );
  //scene.add( voxel );
  var axesHelper = new THREE.AxesHelper( 10 );
  scene.add( axesHelper );
  var gridHelper = new THREE.GridHelper( 10, 10 );
  scene.add( gridHelper );

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )

  mat_loader = new THREE.TextureLoader()

  //model_loader = new THREE.OBJLoader()

  mouse = new THREE.Vector2(0,0)
  pmouse = new THREE.Vector2(0,0)

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
}

function moveForward( distance ) {
  vec.setFromMatrixColumn( camera.matrix, 0 );
  vec.crossVectors( camera.up, vec );
  camera.position.addScaledVector( vec, distance );

};

function moveRight( distance ) {
  vec.setFromMatrixColumn( camera.matrix, 0 );
  camera.position.addScaledVector( vec, distance/500 );
};

function pointer_lock() {
  renderer.domElement.requestPointerLock();
};

function pointer_unlock() {
  document.exitPointerLock();
};

init()
animate()
