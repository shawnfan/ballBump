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

		//console.log(event);
		var z = Math.sqrt(x * x + y * y);
		if (z != 0) {
			transX = speed * (x / z);
			transY = speed * (y / z);
		}
	};

	//For smartphone control
	var onTouchMove = function(event) {
		event.preventDefault();
		var touch = event.touches[0];
		var x = touch.pageX - window.innerWidth / 2;
		var y = touch.pageY - window.innerHeight  / 2;

		var z = Math.sqrt(x * x + y * y);
		if (z != 0) {
			transX = speed * (x / z);
			transY = speed * (y / z);
		}
	};

	this.update = function() {
		object.translateX(transX);
		object.translateY(-transY);
	};

	this.setSpeed = function(spd){
		speed = spd;
	};
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener('touchmove', onTouchMove, false);

};
