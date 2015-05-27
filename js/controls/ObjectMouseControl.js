/**
 * @author shawnfan
 *
 * This controls allow to change object's direction following the mouse.
 */

var ObjectMouseControl = function ( object, spd ) {
	var object = object;
	var transX = 0;
	var transY = 0;	
	var mouse = new THREE.Vector3();
	var speed = spd;

	var onMouseMove = function ( event ) {
		transX = 0;
		transY = 0;
		var x = event.x - window.outerWidth / 2;
		var y = event.y - window.outerHeight / 2;
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		mouse.z = 0;


		//console.log(event);
		var z = Math.sqrt(x * x + y * y);
		if (z != 0) {
			transX = speed * (x / z);
			transY = speed * (y / z);
		}
	};

	this.update = function() {
		object.translateX(transX);
		object.translateY(-transY);
		return mouse;
	};

	this.setSpeed = function(spd){
		speed = spd;
	};
	document.addEventListener( 'mousemove', onMouseMove, false );

};
