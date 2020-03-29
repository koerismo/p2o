var raycaster, camera, controls, scene, renderer, mat_loader, model_loader, mouse;

function onDocumentMouseMove(event) {
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
}
function onDocumentMouseDown(event) {
  let mouse_object = getSelectedObject()

}
function onDocumentKeyDown(event) {

}
function onDocumentKeyUp(event) {

}

function getSelectedObject() {
  //add mouse raycaster code here
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'keydown', onDocumentKeyDown, false );
document.addEventListener( 'keyup', onDocumentKeyUp, false );

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

  mat_loader = new THREE.TextureLoader()

  model_loader = new THREE.OBJLoader()

  mouse = new THREE.Vector2()
}
