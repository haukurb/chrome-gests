var gestsGlyph = function() {

	var wrapper;
	var glyphContainer;
	var opacity;
	var nameContainer;
	var nameBox;
	var nameIsOnPage;
	var settings;

	var fontColor = "#ffffff";
	var backgroundColor = "#bdbdbd";

	function createContext() {
		if(!wrapper) {
			wrapper = document.createElement("div");
			wrapper.id = "gestsGlyphWrapper";

			glyphContainer = document.createElement("div");
			glyphContainer.id = "gestsGlyphContainer";

			wrapper.appendChild(glyphContainer);
			document.body.appendChild(wrapper);
		} else {
			document.body.appendChild(wrapper);
		}
	}

	function deleteContext() {
		if(wrapper) {
			document.body.removeChild(wrapper);
			glyphContainer.innerHTML = "";
		}
	}

	function createGlyph(letter) {
		if(glyphContainer) {
			var glyph = document.createElement("div");
			glyph.className = "gestsGlyph";
			glyph.style.opacity = settings.glyph.opacity;
			var symbol;
			if(settings.glyph.arrowMode) {
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
			glyph.style.color = fontColor;
			glyph.style["background-color"] = backgroundColor;
			glyph.innerHTML = symbol;
			glyphContainer.appendChild(glyph);
		}
	}

	function drawName(name) {
		if(wrapper) {
			if(!nameContainer) {
				nameContainer = document.createElement("div");
				nameContainer.id = "gestsGlyphNameContainer";

				nameBox = document.createElement("span");
				nameBox.innerHTML = name;
				nameBox.style.color = settings.glyph.fontColor;
				nameBox.style["background-color"] = settings.glyph.backgroundColor;
				nameBox.id = "gestsGlyphName";
				
				nameContainer.appendChild(nameBox);
				wrapper.appendChild(nameContainer);
				nameIsOnPage = true;
			} else {
				nameIsOnPage = true;
				nameBox.innerHTML = name;
				wrapper.appendChild(nameContainer);
			}
		}
	}

	function deleteName() {
		if(wrapper) {
			if(nameContainer && nameIsOnPage) {
				nameIsOnPage = false;
				wrapper.removeChild(nameContainer);
			}
		}
	}

	function loadSettings(newSettings) {
		settings = newSettings;
	}

	return {
		createContext: createContext,
		deleteContext: deleteContext,
		push: createGlyph,
		drawName: drawName,
		deleteName: deleteName,
		loadSettings: loadSettings
	}
};