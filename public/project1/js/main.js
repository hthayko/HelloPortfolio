var camera, scene, light, renderer, container;
var meshs = [];
var grounds = [];
var isMobile = false;
var antialias = true;
var graph;
var stats;

var geos = {};
var mats = {};
var spheres = [];
var updateIntervalHandler;

initShapes();
init();
loop();
startAnimation();
setupWorld();

function setupWorld() {
	drawAxes();
	addSphere({x: Math.random()*100, y: Math.random()*100, z: Math.random()*100, 
						vx: Math.random()*2 - 1, vy: Math.random() * 2 - 1, vz: Math.random() * 2 - 1})
}

/*
 *	returns mesh of a sphere positioned at x,y,z
 *
 *  creating a new mesh: new THREE.Mesh( geometry, material );
 *  setting a position:  mesh.position.set(x, y, z);
 */
function addSphere(params)
{
	params = params || {};
	params.x = params.x || 0;
	params.y = params.y || 0;
	params.z = params.z || 0;
	params.vx = params.vx || 0;
	params.vy = params.vy || 0;
	params.vz = params.vz || 0;
	params.ax = params.ax || 0;
	params.ay = params.ay || 0;
	params.az = params.az || 0;

	var meshTmp = new THREE.Mesh(geos.sphere, mats.sphere);
	meshTmp.position.set(params.x, params.y, params.z)
	scene.add(meshTmp)

	var obj = {
		mesh : meshTmp,
		pos : {x : params.x, y : params.y, z : params.z},
		v : {x : params.vx, y : params.vy, z : params.vz},
		a : {x : params.ax, y : params.ay, z : params.az}
	}

	spheres.push(obj);
}

/*
* start calling the update function every 1000/60 milliseconds
*/
function startAnimation(){
	if(updateIntervalHandler) clearInterval(updateIntervalHandler);
	updateIntervalHandler =	setInterval(updateScene, 1000/60);
}

/*
* change the positions according to the physics
*/
function updateScene(){
	var i, obj, newPosition;
	for(i = 0; i < spheres.length; ++i){
		obj = spheres[i];
		newPosition = getPosition(obj);
		obj.mesh.position.set(newPosition.x, newPosition.y, newPosition.z)
		obj.pos = newPosition;
	}
}


/*
* returns the acceleration, based on 
* gravity and friction
*/
function getAcceleration(obj) {
	return obj.a;
}

function getVelocity(obj) {
	return obj.v;
}

function getPosition(obj) {
	v = getVelocity(obj);

	var newX = obj.pos.x + v.x;
	var newY = obj.pos.y + v.y;	
	var newZ = obj.pos.z + v.z;	
	
	if(newX >= 100 || newX < 0) v.x *= -1;
	if(newY >= 100 || newY < 0) v.y *= -1;
	if(newZ >= 100 || newZ < 0) v.z *= -1;

	return {x : newX, y : newY, z : newZ}
}

