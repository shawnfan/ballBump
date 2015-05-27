//TODO: Add map bond as aprameters
Player = function(){
	
	//Game fundations
	var scene, camera, renderer;
	var controls;
	var geometry, material;
	var player, plane;
	var mouse;
	var dots;

	//Communication:
	var socket = io();
	var gameActive = false;

	//Player status:
	var initSpeed = 0.5;
	var speed = initSpeed;
	var speedExpDec = 0.005;
	var size = 1;//# of dots in 1 player
	var radius = 1;
	var radiusPropInc = 0.02;
	var cameraDisZ = 30;

//TODO:
	init();
	animate();

	
	


	function init() {
		//Init scene
		scene = new THREE.Scene();

		//Init camera
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		camera.position.z = cameraDisZ;//TODO: should allow use mouse to move in/out

		//Init renderer
		renderer = new THREE.WebGLRenderer({
		    antialias:true,
		    alpha: true
		});
		renderer.setClearColor(0xffffff, 0.5);
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		//Draw player
		geometry = new THREE.CircleGeometry(radius, 12);
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		player = new THREE.Mesh( geometry, material );
		player.position.z = 0;
		player.add(camera);
		scene.add( player );

		//Draw plane in the back
		geometry = new THREE.PlaneBufferGeometry( 5, 5);
		material = new THREE.MeshBasicMaterial( {color: 0xE0E0E0, side: THREE.SingleSide} );
		plane = new THREE.Mesh( geometry, material );
		plane.position.z = -1;
		scene.add(plane);

		//Add control
		controls = new ObjectMouseControl( player, speed );

		// Axes
		axes = buildAxes();
		scene.add( axes );

		//Request map from server, returning result will be caught in socket.on
		requestMap();

	

		
	}

	function animate() {
		requestAnimationFrame( animate );
		if (gameActive) {
			render();
		}
	}
		

	function render() {
		controls.update();
		collisionAction2D();
	    renderer.render(scene, camera);
	};

	/* Send request using keywoard 'dotsMap'*/
	function requestMap(){
		socket.emit('dotsMap', "request");
		return false;
	};
	socket.on('dotsMap', function(msg){
		gameActive = true;
		updateMap(msg);
	});




/* Helper methods: */
	//Draw map with given map data from server
	function updateMap(map){
		var dotLocations = JSON.parse(map);
		console.log(dotLocations);
		dots = new THREE.Object3D();
		Object.keys(dotLocations).forEach(function(i) {
			geometry = new THREE.CircleGeometry(0.5, 5);
			material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
			var dot = new THREE.Mesh( geometry, material );
			dot.position.x = dotLocations[i].x;
			dot.position.y = dotLocations[i].y;
			dot.position.z = dotLocations[i].z;
			dots.add(dot);
		});
		scene.add(dots);
	}

	//Brutal collision detect against all possible article
	function collisionAction2D (){
		var dotChi = dots.children;
		for (var i = 0; i < dotChi.length; i++) {
			var dis = distance(dotChi[i].position, player.position);
			if (dis < radius) {
				//dotChi[i].material.color.set(0xff0000);
				radius += radiusPropInc;
				player.geometry = new THREE.CircleGeometry(radius, 16);//TODO: adjust the radius segment

				size++;
				speed = initSpeed * Math.pow((1 - speedExpDec), size);
				controls.setSpeed(speed);
				dotChi.splice(i,1);


			}
		} 
	};

	function distance (v1, v2)
	{
	    var dx = v1.x - v2.x;
	    var dy = v1.y - v2.y;
	    var dz = v1.z - v2.z;

	    return Math.sqrt(dx*dx+dy*dy+dz*dz);
	};



	// http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/
	function buildAxes() {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 100, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -100, 0, 0 ), 0x800000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 100, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -100, 0 ), 0x008000, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 100 ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -100 ), 0x000080, true ) ); // -Z

		return axes;

	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );

		var axis = new THREE.Line( geom, mat );

		return axis;

	}

}

