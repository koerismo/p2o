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

function onDocumentMouseMove(event) {
  //pmouse.copy(mouse)
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  if (!holding_object && mouseBeingHeld)
    camera.rotation.addScalar(mouse).subScalar(pmouse)
}
function onDocumentMouseDown(event) {
  let mouse_object = getSelectedObjects()
  holding_object = (mouse_object.length > 0)
  if (mouse_object.length)
    mouse_object = mouse_object[0]
  else
    return;
  mouseBeingHeld = 1;
}
function onDocumentMouseUp(event) {
  mouseBeingHeld = 0
  holding_object = 0
}
function onDocumentKeyDown(event) {

}
function onDocumentKeyUp(event) {

}

function getSelectedObjects() {
  raycaster.setFromCamera( mouse, camera );
  return raycaster.intersectObjects( scene.children );
}

function init() {
  raycaster = new THREE.Raycaster()

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 )
  camera.position.set( 400, 200, 0 );
  camera.far = 5000

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 500;
  controls.maxDistance = 2000;
  controls.maxPolarAngle = Math.PI / 2;

  scene = new THREE.scene()

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )
  renderer.domElement.requestPointerLock()

  mat_loader = new THREE.TextureLoader()

  model_loader = new THREE.OBJLoader()

  mouse = new THREE.Vector2(0,0)
  pmouse = new THREE.Vector2(0,0)

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseDown, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
}

init()
