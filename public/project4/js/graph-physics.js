var updateIntervalHandler = undefined;

function initGraphPhysics(originalGraph)
{
	clearScene();

	setupGraph(originalGraph);
	
//	drawAxes();
	drawGraph();		
	if(updateIntervalHandler) clearInterval(updateIntervalHandler);
	updateIntervalHandler =	setInterval(updateGraph, 1000/60);
}

function clearScene()
{
	if(!graph)	return;
	var i = graph.vertices.length;
	while(i--)	scene.remove(graph.vertices[i].obj);
	i = graph.links.length;
	while(i--)	scene.remove(graph.links[i].line);
}

/*
 * uses global graph constructed by setupGraph;
 */
function drawGraph()
{
	var i = graph.vertexCount;
	var node, edge, radius = graph.nodeRadius, color = 0xff0000, link;
	while(i--)
	{
		node = graph.vertices[i];
		node.obj = new THREE.Object3D();
		node.mesh = addSphere();
		node.obj.add(node.mesh);
		node.obj.add(addText(node.name, -8, 8, 0, 0x000000, 4));
		node.obj.position.set(node.x, node.y, node.z);
		scene.add(node.obj);
	}
	drawEdges();
}
/*
 * returns mesh of a line stroke
 */
function drawEdges()
{
	var geo;
	var i = graph.links.length;
	var link, s, t;
	while(i--)
	{
		link = graph.links[i];			
		s = graph.vertices[link.source];
		t = graph.vertices[link.target];

		geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(s.x, s.y, s.z));
		geo.vertices.push(new THREE.Vector3(t.x, t.y, t.z));
		link.line = new THREE.Line(geo, mats['line']);
		scene.add(link.line);
	}
}

/*
 *	returns mesh of a sphere positioned at x,y,z
 */
function addSphere(params)
{
	params = params || {};
	params.x = params.x || 0;
	params.y = params.y || 0;
	params.z = params.z || 0;
	var mesh = new THREE.Mesh( geos.sphere, mats.sph );
	// mesh.castShadow = true;
	// mesh.receiveShadow = true;		
	mesh.position.set(params.x, params.y, params.z);
	// scene.add( mesh );
	return mesh;
}

function setupGraph(g)
{
	var graphExisted = !!graph;
	if(graphExisted)
	{
		resetGraphData();
//		graph.tensionCoef = 1;	// when setting up graph, we want small tension for nice visuals
	}
	else
	{
		graph = {};
		graph.ropeLength = 20;
		graph.frictionCoef = 5;
		graph.tensionCoef = 30;
		graph.chargeCoef = 4000;
		graph.massCoef = 5;
		graph.iterationStep = 1/40;	// time delta between two iterations
		graph.nodeRadius = 4;		// need to bind to geos['sph']
		graph.gravitationCoef = 4;	// gravitation towards (0,0,0)
		graph.minOriginDist = 10;
	}
	graph.paused = false
	graph.links = $.extend([], g.links);
	graph.vertexCount = g.nodes.length;
	graph.vertices = $.extend([], g.nodes);
	graph.linksCount = g.links.length;
	attachEdgesMap(graph);
	clearMultipleEdges(graph);
	attachVertices(graph);
	distributeOnSphere(graph, 100);
}

/*
 *	resets graphs data - links and nodes, but does not touch metadata - ceoficents, radius, etc.
 */
function resetGraphData()
{
	graph.links = undefined;
	graph.vertices = undefined;
	graph.vertexCount = 0;
}

/*	
 * Usage: 
 * attaches graph.vertices[i] = {x: , y:, z:, v:, F:}
 */
function attachVertices(graph)
{
	// graph.vertices = [];
	var i = graph.vertexCount;
	while(i--)
	{
		$.extend(graph.vertices[i], 
			{
				x : 0, y : 0, z : 0, 
				V: {x : Math.random()*20 - 10, y : Math.random()*20 - 10, z : Math.random()*20 - 10}, 
				F: {x : 0, y : 0, z : 0}
			});
	}
}


/*	
 * Usage: 
 * sets x,y,z so that graph nodes are evenly spread on a sphere with radius <radius>
 * sets points on sqrt(n) longitudes, sqrt(n) vertices on each longitude
 */
function distributeOnSphere(graph, radius)
{
	var n = graph.vertexCount;
	var radix_n = Math.floor(Math.sqrt(n));
	var i = radix_n;
	var cur = 0;
	var longCount;
	var alpha = 0.0, d_alpha = 2 * Math.PI / radix_n;
	var theta = 0.0, d_theta;
	while(i--)
	{
		longCount = getIth(i);
		theta = - Math.PI / 2;
		d_theta = Math.PI / (longCount + 1);	// +1 to leave room at poles
		j = longCount;
		while(j--)
		{
			theta += d_theta;
			graph.vertices[cur].x = radius * Math.cos(theta) * Math.cos(alpha);
			graph.vertices[cur].y = radius * Math.sin(theta);
			graph.vertices[cur].z = radius * Math.cos(theta) * Math.sin(alpha);
			cur++;
		}
		alpha += d_alpha;
	}

	/*
	 * returns number of nodes on ith longitude
	 */
	function getIth(index)
	{
		var ret = radix_n;
		if(index >= radix_n) return 0;
		if(n - radix_n * radix_n > index )	ret ++;
		if(n - radix_n * radix_n  - radix_n > index) ret ++;
		return ret;
	}
}

/*
 * Usage: graph.links = [{source : 1, target : 2}];
 * attaches graph.edges["1_2"] = graph.links[0]
 */
function attachEdgesMap(graph)
{
	graph.edges = [];
	var s, t;
	for(var i = 0; i < graph.links.length; ++i)
	{
		s = graph.links[i].source;
		t = graph.links[i].target;
		graph.edges[s + "_" + t] = graph.links[i];
		graph.edges[t + "_" + s] = graph.links[i];
	}
}


/*
 * Usage: 
 * Assumes format: graph.links = [{source : 1, target : 2}];, graph.edges["1_2"] = graph.links[0]
 * clear multiple edges => leaving only one instance of each link
 */
function clearMultipleEdges(graph)
{
	var links = [], s, t;
	for(var link_name in graph.edges)
	{
		s = link_name.split("_")[0];
		t = link_name.split("_")[1];
		if(s < t)	links.push(graph.edges[link_name]);
	}
	graph.links = links;
}



/*
 * Updates existing graph. Both the data and the content
 */
function updateGraph()
{
	if(!graph || graph.paused)	return;
	updateGraphData();
	updateVertices();
	updateEdges();
}

function updateGraphData()
{
	resetForces();
	setTensionForces();
	setChargeForces();
	setFrictionForces();
	setGravitationForces();
	updatePositions();
}

function resetForces()
{
	var i = graph.vertices.length;
	while(i--)
	{
		graph.vertices[i].F.x = 0;
		graph.vertices[i].F.y = 0;
		graph.vertices[i].F.z = 0;
	}	
}

/*
 *	force pulling towards (0,0,0)
 *	artificial force for binding the whole structure around origin
 */
function setGravitationForces()
{
	var i = graph.vertices.length, l;
	var k = graph.gravitationCoef, node;
	while(i--)
	{
		node = graph.vertices[i];
		l = getDist(node, {x : 0, y : 0, z : 0});

		node.F.x -= node.x * k;
		node.F.y -= node.y * k;
		node.F.z -= node.z * k;
		
		// node.F.x -= Math.sqrt(Math.abs(node.x)) * k * sign(node.x);
		// node.F.y -= Math.sqrt(Math.abs(node.y)) * k * sign(node.y);
		// node.F.z -= Math.sqrt(Math.abs(node.z)) * k * sign(node.z);
	}
}

function setTensionForces()
{
	var i = graph.links.length;
	var link, s, t, line, d;
	var k = graph.tensionCoef, kx, ky, kz;
	while(i--)
	{
		s = graph.vertices[graph.links[i].source];
		t = graph.vertices[graph.links[i].target];
		l = getDist(s, t);
		dl = Math.max(0, l - graph.ropeLength);
		kx = (t.x - s.x) / l * k * dl;
		ky = (t.y - s.y) / l * k * dl;
		kz = (t.z - s.z) / l * k * dl;
		
		s.F.x += kx;
		s.F.y += ky;
		s.F.z += kz;
		
		t.F.x -= kx;
		t.F.y -= ky;
		t.F.z -= kz;
	}
}

function setChargeForces()
{
	var s, t, d;
	var k = graph.chargeCoef, kx, ky, kz;

	var i = graph.vertices.length;
	var j;
	while(i--)
	{
		j = i;
		t = graph.vertices[i];
		while(j--)
		{			
			s = graph.vertices[j];
			l = getDist(s, t);
			kx = (t.x - s.x) * k / (l*l);
			ky = (t.y - s.y) * k / (l*l);
			kz = (t.z - s.z) * k / (l*l);
			
			s.F.x -= kx;
			s.F.y -= ky;
			s.F.z -= kz;
			
			t.F.x += kx;
			t.F.y += ky;
			t.F.z += kz;
		}
	}
}

/*
 * Taking into account Net Force, current Locationa, initial V0, caluclates
 * new location and new V0
 */
function updatePositions()
{
	var s;
	var i = graph.vertices.length;
	var ax, ay, az, m = graph.massCoef;
	var dt = graph.iterationStep;
	while(i--)
	{
		s = graph.vertices[i];
		ax = s.F.x / m;
		ay = s.F.y / m;
		az = s.F.z / m;

		s.x += 	ax*dt*dt + s.V.x * dt;	// s = at^2 + vt
		s.y += 	ay*dt*dt + s.V.y * dt;	// s = at^2 + vt
		s.z += 	az*dt*dt + s.V.z * dt;	// s = at^2 + vt

//		respectMinOriginDistance(s);

		s.V.x += ax*dt;
		s.V.y += ay*dt;
		s.V.z += az*dt;
	}
}

function respectMinOriginDistance(point)
{
	var l = getDist(point, {x : 0, y : 0, z : 0}, true);
	if(l < graph.minOriginDist)
	{
		point.x *= graph.minOriginDist / l;
		point.y *= graph.minOriginDist / l;
		point.z *= graph.minOriginDist / l;
	}
}

function setFrictionForces()
{
	var s;
	var k = graph.frictionCoef, kx, ky, kz;

	var i = graph.vertices.length;
	while(i--)
	{
		s = graph.vertices[i];
		kx = k * s.V.x;
		ky = k * s.V.y;
		kz = k * s.V.z;

		s.F.x -= kx;
		s.F.y -= ky;
		s.F.z -= kz;
	}
}

/*
 * by default, realDist is false and safe distance is returned, e.g. far from 0
 */
function getDist(s, t, realDist)
{
	realDist = realDist || false;
	var eps = graph.nodeRadius;
	var ret = Math.sqrt((s.x - t.x)*(s.x - t.x) 
		+ (s.y - t.y)*(s.y - t.y) 
		+ (s.z - t.z)*(s.z - t.z));
	if (!realDist && ret < eps) ret = eps;
	return ret;
}

function sign(f)
{
	if(f > 0) return 1;
	if(f < 0) return -1;
	return 0;
}

function updateVertices()
{
	var i = graph.vertices.length;
	var node;
	while(i--)
	{
		node = graph.vertices[i];
		node.obj.position.set(node.x, node.y, node.z)
	}		
}

function updateEdges()
{
	var i = graph.links.length;
	var link, s, t, line;
	while(i--)
	{
		s = graph.vertices[graph.links[i].source];
		t = graph.vertices[graph.links[i].target];
		line = graph.links[i].line;
		line.geometry.vertices = [new THREE.Vector3(s.x, s.y, s.z), 
									new THREE.Vector3(t.x, t.y, t.z)];
		line.geometry.verticesNeedUpdate = true;
	}				
}

function drawAxes()
{
	var i, mat, geo, line, color, j, k;
	var dist = 500;
	var points = [[dist, 0, 0], [0, dist, 0], [0, 0, dist]]
	var axes = ["x", "y", "z"];
	for(i = 0; i < 3; ++i)
	{
		color = 0xff << (2*4*i);
		mat = new THREE.LineBasicMaterial({
			color: color
		});
		geo = new THREE.Geometry();	
		geo.vertices.push(
			new THREE.Vector3( points[i][0], points[i][1], points[i][2] ),
			new THREE.Vector3( -points[i][0], -points[i][1], -points[i][2])
		);
		line = new THREE.Line(geo, mat);
		addText(axes[i], points[i][0], points[i][1], points[i][2], color);
		addText("-" + axes[i], -points[i][0], -points[i][1], -points[i][2], color);
		for(j = -dist; j <= dist; j += dist / 2)
		{
			addText(j, j * !!points[i][0], j*!!points[i][1], j*!!points[i][2], color, 2);
		}
		line.matrixAutoUpdate = false;
		line.updateMatrix();
		scene.add( line );
	}
}

function addText(text, x, y, z, color, size)
{
	size = size || 40;
	var materialFront = new THREE.MeshBasicMaterial({
		color: color
	});
	var materialSide = new THREE.MeshBasicMaterial({
		color: color >> 8
	});
	var materialArray = [materialFront, materialSide];
	var textGeom = new THREE.TextGeometry(text, {
		size: size,
		height: 1,
		curveSegments: 3,
		font: "helvetiker",
		// bevelThickness: 0.1,
		// bevelSize: 2,
		// bevelEnabled: true,
		// material: 0,
		// extrudeMaterial: 1
	});
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold

	var textMaterial = new THREE.MeshBasicMaterial(materialFront);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);

	textMesh.position.set(x, y, z);
	textMesh.matrixAutoUpdate = false;
	textMesh.updateMatrix();
	return textMesh;
}

function colorGraph(colors){
	var i, v, group, mat;
	for(i = 0; i < graph.vertices.length; ++i){
		group = graph.vertices[i].group;
		v = graph.vertices[i].mesh;
		mat = v.material.clone();
		mat.color.setHex(colors[group]);
		v.material = mat;
	}
}