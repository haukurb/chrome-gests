gestsMousetracker = function() {

	var enabled = false;
	var rmousedown = false;
	var gestured = false;
	var lastX = null;
	var lastY = null;
	var newX = null;
	var newY = null;
	var ctx = null;
	var canvas = null;
	var settings = null;
	var pathArr = [];
	var continuous = true;
	var sequence = "";

	var onContext = function(){};
	var onLetter = function(){};
	var onFinished = function(){};


	document.addEventListener("mousedown", function(event) {
		if(event.which === 3 && enabled) {
			rmousedown = true;
			lastX = event.clientX;
			lastY = event.clientY;
			if(continuous) {
				pathArr = [];
				pathArr.push([lastX,lastY]);
			}
		}
	});

	document.addEventListener("mouseup", function(event) {
		if(event.which === 3 && enabled) {
			rmousedown = false;
		}
	});

	document.addEventListener("mousemove", function(event) {
		if(!(rmousedown && enabled)) {
			return;
		}
		newX = event.clientX;
		newY = event.clientY;
		if( lastX === newX && lastY === newY ) {
			return;
		}
		rSquared = (newX-lastX)*(newX-lastX) + (newY-lastY)*(newY-lastY);
		if(rSquared > 64) { // mouse moved at least 8 pixels
			if(continuous){
				pathArr.push([newX,newY]);
			}
			if(!gestured) {
				gestured = true;
				if(settings.path.draw) {
					ctx = createContext();
				}
				onContext();
			}
			if(settings.path.draw) {
				if(continuous){
					drawContinuous(ctx, pathArr);
				} else {
					drawSegment(ctx, lastX, lastY, newX, newY);
				}
			}
			var letter = coordsToLetter(lastX, lastY, newX, newY);
			if(letterIsPushable(sequence, letter) && sequence.length < 11) {
				sequence += letter;
				onLetter(sequence, letter);
			}
			lastX = newX;
			lastY = newY;
		}
	});

	document.addEventListener("contextmenu", function(event) {
		if(gestured && enabled) {
			event.preventDefault();
			gestured = false;
			if(settings.path.draw) {
				deleteContext();
			}
			onFinished(sequence);
			sequence = "";
			return false;
		}
	});

	function createContext() {
		canvas = document.getElementById('gestsCanvas');
		if(!canvas) {
			canvas = document.createElement('canvas');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.id = 'gestsCanvas';
			document.body.appendChild(canvas);
			return canvas.getContext('2d');
		} 
		else {
			return canvas.getContext('2d');
		}
	}

	function deleteContext() {
		var canvas = document.getElementById('gestsCanvas')
		if(canvas) {
			document.body.removeChild(canvas);
		}
	}

	function drawSegment(ctx, lx, ly, nx, ny) {
		ctx.beginPath();
		var colorString = hexToRgba(settings.path.color, settings.path.opacity);
		ctx.strokeStyle = colorString;
		ctx.lineWidth = settings.path.width;
		ctx.moveTo(lx,ly);
		ctx.lineTo(nx,ny);
		ctx.stroke();
	}

	function drawContinuous(ctx, pathArr) {
		if(pathArr.length>1) {
			ctx.clearRect(0,0,canvas.width, canvas.height);
			ctx.beginPath();
			ctx.lineWidth = settings.path.width;
			ctx.strokeStyle = hexToRgba(settings.path.color, settings.path.opacity);
			ctx.lineJoin = "round";
			ctx.moveTo(pathArr[0][0],pathArr[0][1]);
			for(var i=1;i<pathArr.length;i++){
				ctx.lineTo(pathArr[i][0], pathArr[i][1]);
			}
			ctx.stroke();
		}
	}

	function letterIsPushable(seq, letter) {
		if(!seq || seq[seq.length-1] !== letter) {
			return true;
		} else {
			return false;
		}
	}

	function hexToRgba(str, alpha) {
		// string is of form "#ff00ff"
		// alpha is between 0 and 1
		var hexString = str.replace('#','');
		var num = parseInt(hexString, 16);
		var r = num >> 16;
		var g = (num >> 8) % 256;
		var b = num % 256;
		var a = alpha;
		var result = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		return result; 
	}

	function coordsToLetter(lx, ly, nx, ny) {
		var theta = Math.atan2(ly-ny, nx-lx);
		var letter = '';
		var pi = Math.PI;
		if( pi/4 > theta && theta >= -pi/4 ) letter = 'R';
		else if( 3/4*pi > theta && theta >= pi/4 ) letter = 'U';
		else if( -pi/4 > theta && theta >= -3/4*pi ) letter = 'D';
		else letter = 'L';
		return letter;
	}

	function setCallbacks(cb1, cb2, cb3) {
		onContext = cb1;
		onLetter = cb2;
		onFinished = cb3;
	}

	function enable() {
		enabled = true;
	}

	function disable() {
		enabled = false;
	}

	function loadSettings(extSettings) {
		settings = extSettings;
	}

	return {
		enable: enable,
		disable: disable,
		setCallbacks: setCallbacks,
		loadSettings: loadSettings 
	};
};