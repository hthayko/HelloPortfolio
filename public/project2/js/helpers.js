var textures = {};

function initShapes(){
  // geometrys
  geos['sphere'] = new THREE.BufferGeometry();
  geos['sphere'].fromGeometry( new THREE.SphereGeometry(12,16,16));

  // geos['sun'] = new THREE.BufferGeometry();
  // geos['sun'].fromGeometry( new THREE.SphereGeometry(20,64,64));

  for(var p in planets){
    geos[p] = new THREE.BufferGeometry();
    geos[p].fromGeometry( new THREE.SphereGeometry(planets[p].radius, 64, 64));
  }


  geos['box'] = new THREE.BufferGeometry();
  geos['box'].fromGeometry( new THREE.BoxGeometry(0.1,0.1,1));

  geos['trail'] = new THREE.BufferGeometry();
  geos['trail'].fromGeometry( new THREE.BoxGeometry(1,1,1));

  geos['line'] = new THREE.Geometry();


  // materials
  mats['sphere'] = new THREE.MeshPhongMaterial( { map: basicTexture(0), name:'sphere' } );

  for(var p in planets){
    mats[p] = new THREE.MeshLambertMaterial( { map: textures[p], name:p } );
  }

  mats['sun'] = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505, shininess:100, name:'sun' } );
  mats['sun'].side = THREE.BackSide;

  mats['box'] = new THREE.MeshPhongMaterial( { map: basicTexture(2), name:'box' } );

  mats['trail'] = new THREE.MeshBasicMaterial( { color: 0xffffff, name:'trail' } );

  mats['ssph'] = new THREE.MeshLambertMaterial( { map: basicTexture(1), name:'ssph' } );
  mats['sbox'] = new THREE.MeshLambertMaterial( { map: basicTexture(3), name:'sbox' } );
  mats['ground'] = new THREE.MeshLambertMaterial( { color: 0x3D4143 } );
  mats['line'] = new THREE.LineBasicMaterial({ color: 0x000000, linewidth : 1 }); 
}


////------------------------- Textures 

function gradTexture(color) {
  var c = document.createElement("canvas");
  var ct = c.getContext("2d");
  c.width = 16; c.height = 128;
  var gradient = ct.createLinearGradient(0,0,0,128);
  var i = color[0].length;
  while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
  ct.fillStyle = gradient;
  ct.fillRect(0,0,16,128);
  var texture = new THREE.Texture(c);
  texture.needsUpdate = true;
  return texture;
}

function basicTexture(n){
  var canvas = document.createElement( 'canvas' );
  canvas.width = canvas.height = 64;
  var ctx = canvas.getContext( '2d' );
  var color;
  if(n===0) color = "#3884AA";// sphere58AA80
  if(n===1) color = "#61686B";// sphere sleep
  if(n===2) color = "#ffffff";// box
  if(n===3) color = "#61686B";// box sleep
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "rgba(0,0,0,0.2);";//colors[1];
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillRect(32, 32, 32, 32);
  var tx = new THREE.Texture(canvas);
  tx.needsUpdate = true;
  return tx;
}   


function addText(text, x, y, z, color, size)
{
  size = size || 4;
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
    // bevelThickness: 1,
    // bevelSize: 2,
    // bevelEnabled: true,
    // material: 0,
    // extrudeMaterial: 1
  });

  var textMaterial = new THREE.MeshBasicMaterial(materialFront);
  var textMesh = new THREE.Mesh(textGeom, textMaterial);

  textMesh.position.set(x, y, z);
  textMesh.matrixAutoUpdate = false;
  textMesh.updateMatrix();
  scene.add(textMesh);
}


function drawAxes(axesNames = ["x", "y", "z"])
{
  var i, mat, geo, line, color, j, k;
  var dist = 100;
  var points = [[dist, 0, 0], [0, dist, 0], [0, 0, dist]]
  var axes = axesNames;
  for(i = 0; i < 3; ++i)
  {
    color = 0xff << (2*4*i);
    mat = new THREE.LineBasicMaterial({ color: color});
    geo = new THREE.Geometry();
    geo.vertices.push(
      new THREE.Vector3( points[i][0], points[i][1], points[i][2] ),
      new THREE.Vector3(0, 0, 0)
    );
    line = new THREE.Line(geo, mat);
    scene.add(addText(axes[i], points[i][0], points[i][1], points[i][2], color, 10))
    for(j = 0; j < dist; j += dist / 10)
    {
      scene.add(addText(j, j * !!points[i][0], j*!!points[i][1], j*!!points[i][2], color, 1))
    }
    line.matrixAutoUpdate = false;
    line.updateMatrix();
    scene.add( line );
  }
}

function loadAssets(callback) {
  new THREE.TextureLoader().load(`assets/2k_earth.jpg`, function(texture){
    textures['earth'] = texture;
    new THREE.TextureLoader().load(`assets/2k_jupiter.jpg`, function(texture){
      textures['jupiter'] = texture;
      new THREE.TextureLoader().load(`assets/2k_mars.jpg`, function(texture){
        textures['mars'] = texture;
        new THREE.TextureLoader().load(`assets/2k_mercury.jpg`, function(texture){
          textures['mercury'] = texture;
          new THREE.TextureLoader().load(`assets/2k_neptune.jpg`, function(texture){
            textures['neptune'] = texture;
            new THREE.TextureLoader().load(`assets/2k_saturn.jpg`, function(texture){
              textures['saturn'] = texture;
              new THREE.TextureLoader().load(`assets/2k_uranus.jpg`, function(texture){
                textures['uranus'] = texture;
                new THREE.TextureLoader().load(`assets/2k_venus.jpg`, function(texture){
                  textures['venus'] = texture;
                  callback();
                });
              });
            });    
          });
        });
      });
    });    
  });
}