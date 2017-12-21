var fps = [0,0,0,0];
var ToRad = Math.PI / 180;
var type=1;
var infos;

function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
	initCamera(90,60,100);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:antialias});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	
	//this.scene.fog = new THREE.Fog( 0x3D4143, 100, 800 );
	scene.add( new THREE.AmbientLight( 0x3D4143 ) );
	light = new THREE.DirectionalLight( 0xffffff , 1.3);
	light.position.set( 300, 1000, 500 );
	light.target.position.set( 0, 0, 0 );
	light.castShadow = true;
	light.shadowCameraNear = 500;
	light.shadowCameraFar = 1600;
	light.shadowCameraFov = 70;
	light.shadowBias = 0.0001;
	light.shadowDarkness = 0.7;
	//light.shadowCameraVisible = true;
	light.shadowMapWidth = light.shadowMapHeight = 1024;
	scene.add( light );

	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFShadowMap;

	// background
	var buffgeoBack = new THREE.BufferGeometry();
	buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(3000,1) );
	var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[0.75,0.6,0.4,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false, fog:false }  ));
	back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
	scene.add( back );

	container = document.getElementById("container");
	container.appendChild( renderer.domElement );
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.right = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );
	initEvents();
	// initGraphPhysics(originalGraph);
}

function loop() {
	requestAnimationFrame( loop );
	renderer.render( scene, camera );
	stats.begin();
	stats.end();
}

