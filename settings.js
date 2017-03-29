var settings = {
	path: {
		width: 4,
		color: "#0080FF",
		opacity: 0.7,
		draw: true
	},
	glyph: {
		opacity: 0.7,
		draw: true,
		arrowMode: true,
		drawName: true,
		backgroundColor: "#bdbdbd",
		fontColor: "#ffffff"
	},
	smoothScroll: true,
	shouldSync: false
};

var bindings = {
	"RU"	:	["next_tab"],
	"LD"	:	["next_tab"],
	"LU"	:	["prev_tab"],
	"RD"	:	["prev_tab"],
	"RUR"	:	["rightmost_tab"],
	"LUL"	:	["leftmost_tab"],
	"UD"	:	["reload"],
	"DR"	:	["close_tab"],
	"DL"	:	["reopen_closed"],
	"URU"	:	["scroll_to_top"],
	"DRD"	:	["scroll_to_bottom"]
};

(function() {

	var tracker = gestsMousetracker();
	var currentGlyphContainer = null;
	var gestureNames = [
			"next_tab",
			"prev_tab",
			"close_tab",
			"rightmost_tab",
			"leftmost_tab",
			"reload",
			"reopen_closed",
			"scroll_to_top",
			"scroll_to_bottom"
		]

	function init() {
		loadSettings(function() {
			var form = document.getElementById("settings-form");

			var saveBtn = document.createElement("button");
			saveBtn.type = "button";
			saveBtn.innerHTML = "Save";
			saveBtn.addEventListener("click", saveSettings);
			form.appendChild(saveBtn);

			for(var i = 0; i < gestureNames.length; i++) {
				var keys = [];
				for (var property in bindings) {
					if(bindings.hasOwnProperty(property)) {
						if((bindings[property]).indexOf(gestureNames[i])>-1)
							keys.push(property);
					}
				}
				if(!keys) keys = " ";
				makeGestureRow(form, gestureNames[i], keys)
			}


			tracker.loadSettings(settings);
			tracker.setCallbacks(
				function onContext() {
					currentGlyphContainer.innerHTML = "";
				},
				function onLetter(sequence, letter){
					makeGlyph(currentGlyphContainer, letter);
				},
				function onFinished(sequence){
					currentGlyphContainer.dataset.sequence = sequence;
				}
			);

			initPathDemo();
			drawPathDemo();
			initGlyphDemo();
		});

	}

	function initPathDemo() {
		var draw = document.getElementById("path-should-draw");
		var color = document.getElementById("path-color");
		var width = document.getElementById("path-width");
		var opacity = document.getElementById("path-opacity");

		draw.addEventListener("click", function(e) {
			settings.path.draw = draw.checked;
			drawPathDemo();
		});
		color.addEventListener("input", function(e) {
			settings.path.color = color.value;
			drawPathDemo();
		});
		width.addEventListener("input", function(e) {
			settings.path.width = width.value;
			drawPathDemo();
		});
		opacity.addEventListener("input", function(e) {
			settings.path.opacity = opacity.value/100.0;
			drawPathDemo();
		});
	}

	function drawPathDemo() {
		var canvas = document.getElementById("path-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width, canvas.height);
		if(settings.path.draw) {
			ctx.beginPath();
			ctx.strokeStyle = hexToRgba(settings.path.color, settings.path.opacity);
			ctx.lineWidth = settings.path.width;
			ctx.moveTo(35,  110);
			ctx.lineTo(50,  70);
			ctx.lineTo(145, 70);
			ctx.lineTo(160, 30);
			ctx.stroke();
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

	function initGlyphDemo() {
		var draw = document.getElementById("glyph-should-draw");
		var drawName = document.getElementById("glyph-should-draw-name");
		var bgColor = document.getElementById("glyph-background-color");
		var fColor = document.getElementById("glyph-font-color");
		var opacity = document.getElementById("glyph-opacity");

		var gLeft = document.getElementById("demo-glyph-left");
		var gRight = document.getElementById("demo-glyph-right");
		var gName = document.getElementById("demo-glyph-name");
		if(settings.glyph.draw) {
			gLeft.style.visibility = "visible";
			gRight.style.visibility = "visible";
			gName.style.visibility = "visible";
		} else {
			gLeft.style.visibility = "hidden";
			gRight.style.visibility = "hidden";
			gName.style.visibility = "hidden";
		}
		gLeft.style["background-color"] = bgColor.value;
		gRight.style["background-color"] = bgColor.value;
		gName.style["background-color"] = bgColor.value;
		gLeft.style.color = fColor.value;
		gRight.style.color = fColor.value;
		gName.style.color = fColor.value;
		gLeft.style.opacity = settings.glyph.opacity;
		gRight.style.opacity = settings.glyph.opacity;
		gName.style.opacity = settings.glyph.opacity;

		draw.addEventListener("click", function(e) {
			settings.glyph.draw = draw.checked;
			if(draw.checked) {
				gLeft.style.visibility = "visible";
				gRight.style.visibility = "visible";
				gName.style.visibility = "visible";
			} else {
				gLeft.style.visibility = "hidden";
				gRight.style.visibility = "hidden";
				gName.style.visibility = "hidden";
			}
		});

		drawName.addEventListener("click", function(e) {
			settings.glyph.drawName = drawName.checked;
			if(drawName.checked) {
				gName.style.visibility = "visible";
			} else {
				gName.style.visibility = "hidden";
			}
		});

		bgColor.addEventListener("input", function(e) {
			settings.glyph.backgroundColor = bgColor.value;
			gLeft.style["background-color"] = bgColor.value;
			gRight.style["background-color"] = bgColor.value;
			gName.style["background-color"] = bgColor.value;
		});

		fColor.addEventListener("input", function(e) {
			settings.glyph.fColor = fColor.value;
			gLeft.style.color = fColor.value;
			gRight.style.color = fColor.value;
			gName.style.color = fColor.value;
		});
		opacity.addEventListener("input", function(e) {
			settings.glyph.opacity = opacity.value/100.0;
			gLeft.style.opacity = settings.glyph.opacity;
			gRight.style.opacity = settings.glyph.opacity;
			gName.style.opacity = settings.glyph.opacity;
		});
	}

	function makeGestureRow(gContainer, gName, keys) {
		var row = document.createElement("div");
		row.className = "settings-row";

		var name = document.createElement("div");
		name.className = "settings-name";
		nameStr = gName.replace(/_/g," ") + ":";
		name.innerHTML = nameStr[0].toUpperCase() + nameStr.slice(1);

		var value = document.createElement("div");
		value.className = "settings-value";

		var valuePrimary = document.createElement("div");
		valuePrimary.className = "settings-value-primary";

		var wrapper = document.createElement("div");
		wrapper.className = "glyph-small-wrapper";
		wrapper.id = gName + "-wrapper";

		var ul = document.createElement("ul");
		ul.id = gName + "-list";

		valuePrimary.appendChild(ul);
		value.appendChild(valuePrimary);
		row.appendChild(name);
		row.appendChild(value);
		row.appendChild(wrapper);

		gContainer.appendChild(row);

		for(var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
			makeGestureButtonsAndContainer(gName, keyIndex, keys[keyIndex]);
		}
	}

	function makeGestureButtonsAndContainer(gName, gIndex, sequence, callback) {
		var wrapper = document.getElementById(gName + "-wrapper");
		var ul = document.getElementById(gName + "-list");

		var btn = document.createElement("button");
		btn.className = "gesture-button";
		btn.id = gName + "-" + gIndex + "-button";
		btn.type = "button";
		btn.innerHTML = "Click to draw";
		btn.addEventListener("click", drawButtonHandler);

		var li = document.createElement("li");
		li.appendChild(btn);
		ul.appendChild(li);

		var container = document.createElement("div");
		container.className = "glyph-small-container";
		container.id = gName + "-" + gIndex + "-glyph-container";
		container.dataset.sequence = sequence;
		wrapper.appendChild(container);

		var letters = sequence.split("");
		for(var letterIndex = 0; letterIndex < letters.length; letterIndex++) {
			makeGlyph(container, letters[letterIndex]);
		}

		var extraBtn = document.createElement("button");
		extraBtn.className = "gesture-button"
		extraBtn.type = "button";
		if(gIndex === 0) {
			extraBtn.id = gName + "-add-button";
			extraBtn.innerHTML = "+";
			extraBtn.addEventListener("click", addButtonHandler);
		} else {
			extraBtn.id = gName + "-" + gIndex + "-remove-button";
			extraBtn.innerHTML = "x";
			extraBtn.addEventListener("click", removeButtonHandler);
		}
		li.appendChild(extraBtn);

		if(callback) {
			callback();
		}
	}

	function addButtonHandler(e) {
		var name = this.id.replace("-add-button", "");
		var id = name + "-list";
		var list = document.getElementById(id);
		var index = list.getElementsByTagName("li").length;
		makeGestureButtonsAndContainer(name, index, "", function() {
			var btn = document.getElementById(name + "-" + index + "-button");
			toggleClassName(btn, "active");
			var container = document.getElementById(name + "-" + index + "-glyph-container");
			currentGlyphContainer = container;
			tracker.enable();
			document.addEventListener("mousedown", function disablingClick(e) {
				if(event.which !== 3) {
					var btn = document.getElementById(name + "-" + index + "-button")
					toggleClassName(btn,"active");
					currentGlyphContainer = null;
					tracker.disable();
					document.removeEventListener("mousedown", disablingClick);
				}
			});
		});
	}

	function removeButtonHandler(e) {
		var nameAndIndex = this.id.replace("-remove-button", "");
		var index = nameAndIndex[nameAndIndex.length-1];
		var name = nameAndIndex.replace("-"+index, "");
		var list = document.getElementById(name + "-list");
		var liElem = this.parentNode;
		list.removeChild(liElem);
		var containerId = nameAndIndex + "-glyph-container";
		var container = document.getElementById(containerId);
		var wrapper = document.getElementById(name + "-wrapper");
		wrapper.removeChild(container);
	}

	function makeGlyph(container, letter) {
		var glyph = document.createElement("div");
		glyph.className = "glyph-small";
		var symbol;
		if(settings.glyph.drawName) {
			switch(letter) {
				case "U":
					symbol = "↑";
					break;
				case "R":
					symbol = "→";
					break;
				case "D":
					symbol = "↓";
					break;
				case "L":
					symbol = "←";
					break;
				default:
					symbol = letter;
			}
		} else {
			symbol = letter;
		}
		glyph.innerHTML = symbol;
		container.appendChild(glyph);
	}

	function drawButtonHandler(e) {
		var btn = this;	
		var containerId = this.id.replace("button","glyph-container");
		var container = document.getElementById(containerId);
		container.innerHTML = "";
		currentGlyphContainer = container;
		tracker.enable();
		toggleClassName(btn,"active");
		document.addEventListener("mousedown", function disablingClick(e) {
			if(event.which !== 3) {
					toggleClassName(btn,"active");
					currentGlyphContainer = null;
					tracker.disable();
					document.removeEventListener("mousedown", disablingClick);
			}
		});
	}

	function toggleClassName(element, name) {
		var className = " " + element.className + " ";
		var str = " " + name + " "
		if( ~className.indexOf(str) ) {
			element.className = className.replace(str, " ");
		} else {
			element.className += " " + name;
		}
	}

	function loadSettings (callback) {
		chrome.storage.local.get({settings:settings, bindings:bindings}, function (res) {
			if(res.settings && res.bindings) {
				settings = res.settings;
				bindings = res.bindings;
				 document.getElementById("path-should-draw").value = settings.path.draw;
				 document.getElementById("path-color").value = settings.path.color;
				 document.getElementById("path-width").value = settings.path.width;
				 document.getElementById("path-opacity").value = settings.path.opacity * 100.0;
				 document.getElementById("glyph-should-draw").value = settings.glyph.draw;
				 document.getElementById("glyph-should-draw-name").value = settings.glyph.drawName;
				 document.getElementById("glyph-arrow-mode").value = settings.glyph.arrowMode;
				 document.getElementById("glyph-background-color").value = settings.glyph.backgroundColor;
				 document.getElementById("glyph-opacity").value = settings.glyph.opacity * 100.0;
				 document.getElementById("glyph-font-color").value = settings.glyph.fontColor;
				 document.getElementById("smooth-scroll").value = settings.glyph.smoothScroll;
				 document.getElementById("should-sync").value = settings.glyph.shouldSync;
				 callback()
			} else {
				console.log("Error loading settings");
			}
		})
	}

	function saveSettings () {
		var pathDraw = document.getElementById("path-should-draw").checked;
		var pathColor = document.getElementById("path-color").value;
		var pathWidth = document.getElementById("path-width").value;
		var pathOpacity = document.getElementById("path-opacity").value / 100.0;
		var glyphDraw = document.getElementById("glyph-should-draw").checked;
		var glyphDrawName = document.getElementById("glyph-should-draw-name").checked;
		var glyphBackgroundColor = document.getElementById("glyph-background-color").value;
		var arrowMode = document.getElementById("glyph-arrow-mode").checked;
		var glyphFontColor = document.getElementById("glyph-font-color").value;
		var glyphOpacity = document.getElementById("glyph-opacity").value / 100.0;
		var smoothScroll = document.getElementById("smooth-scroll").checked;
		var shouldSync = document.getElementById("should-sync").checked;

		var newSettings = {
			path : {
				draw : pathDraw,
				color : pathColor,
				width : pathWidth,
				opacity : pathOpacity  
			},
			glyph : {
				draw : glyphDraw,
				drawName : glyphDrawName,
				fontColor : glyphFontColor,
				backgroundColor : glyphBackgroundColor,
				opacity : glyphOpacity,
				arrowMode : arrowMode
			},
			smoothScroll : smoothScroll,
			shouldSync : shouldSync
		};

		var newBindings = {};

		var wrappers = document.getElementsByClassName("glyph-small-wrapper");
		for(var wrapperIndex = 0; wrapperIndex < wrappers.length; wrapperIndex++) {
			var gName = wrappers[wrapperIndex].id.replace("-wrapper","");
			var containers = wrappers[wrapperIndex].getElementsByClassName("glyph-small-container");
			var numBindings = containers.length;
			for(var containerIndex = 0; containerIndex < containers.length; containerIndex++) {
				var seq = containers[containerIndex].dataset.sequence;
				if(seq && seq !== "") {
					if(newBindings[seq]) {
						// makes it into form: " next_tab prev_tab " with leading and trailing spaces
						var str = " " + newBindings[seq].join(" ") + " ";
						if(!~str.indexOf(" " + gName + " ")) { // gName not in string
							newBindings[seq].push(gName);
						}
					} else {
						newBindings[seq] = [gName];
					}
				}
			}
		}

		console.log("Saved settings: ");
		console.log(newSettings);
		console.log(newBindings);

		chrome.storage.local.set({settings:newSettings, bindings: newBindings, date:Date.now()}, function(res) {
			// sendSavedMsg();
			console.log("Save successful");
			console.log(res)
		});
	}

	function sendSavedMsg () {
		chrome.runtime.sendMessage({action: "settings_saved"});
	}

	return {
		init: init
	}

})().init();