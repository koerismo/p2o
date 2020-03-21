
var mouseN = {x: 0, y:0};
var mouse;
init();
animate();
var raycaster;
//window.addEventListener('mousemove', setPickPosition);

function init() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 400, 200, 0 );

  controls = new THREE.OrbitControls( camera, renderer.domElement );

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.01;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 800;
  controls.maxPolarAngle = Math.PI / 2;

  //load cube texture & make material
  var loader = new THREE.TextureLoader();
  var diffuseTex = loader.load( 'https://cdn.glitch.com/5c1db9b3-25f5-4e14-9f6f-7ab10f4855d0%2Fnormal_0.png?v=1584673408782', function () {
    updateCubeMap();

  } );

  var mat = new THREE.MeshPhysicalMaterial( {
    map: diffuseTex
  } );

  // world

  var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  var planeGeo = new THREE.PlaneBufferGeometry( 32, 32 );

  for ( var z = -5; z < 5; z ++ ) {
    for ( var y = -5; y < 5; y ++ ) {
      for ( var x = -5; x < 5; x ++ ) {
        addTile(x,y,z,0,0,planeGeo,mat)
        addTile(x,y,z,90,0,planeGeo,mat)

      }
    }

  }
  // lights
  //var planeGeo = new THREE.PlaneBufferGeometry( 100, 100 );
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( - 1, - 1, - 1 );
  scene.add( light );

  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );

  //

  document.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();

}

function onDocumentMouseMove(event) {
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
			if ( intersects.length > 0 ) {
				var intersect = intersects[ 0 ];
        scene.remove( intersect.object );
        //intersect.object.visible = 0;
        /*
        some sample code from https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_voxelpainter.html
        this might be helpful later

        var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
				voxel.position.copy( intersect.point ).add( intersect.face.normal );
				voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				scene.add( voxel );

				objects.push( voxel );
        */
      }
}

function render() {
  renderer.render( scene, camera );
}


function mouseHover() {
  raycaster.setFromCamera(mouseN,camera);
  var intersectedObjects = this.raycaster.intersectObjects(scene.children)
  return intersectedObjects.map(function(x){return x.object})
}

function addTile(x,y,z,rx,ry,g,m) {
  var wall = new THREE.Mesh( g, m );
  wall.position.x = x*32;
  wall.position.y = y*32;
  wall.position.z = z*32;
  wall.rotateY(ry*Math.PI/180);
  wall.rotateX(rx*Math.PI/180);
  wall.updateMatrix();
  wall.matrixAutoUpdate = false;
  scene.add( wall );
}

function setPickPosition(event) {
    let pos = getCanvasRelativePosition(event);
    mouseN.x = (pos.x / renderer.domElement.clientWidth ) *  2 - 1;
    mouseN.y = (pos.y / renderer.domElement.clientHeight) * -2 + 1;  // note we flip Y
}

function getCanvasRelativePosition(event) {
  let rect = renderer.domElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}
