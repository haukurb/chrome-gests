// TODO: go to MRU tab
// TODO: browserAction icon to access options page more easily
// TODO: bug when gesture is held and ctr+mousewheelup/down 

// COULD:  mouseclick or scroll should end smoothscroll
// COULD:  adjustable smooth scroll speed
// COULD:  gesture to go to a user defined link
// COULD:  scroll page length up/down 
// COULD:  ensure glyph is rendered same across pages, stackoverflow for example is different
// COULD:  persistent slow smooth scroll while gesture is maintained?
// COULD:  alternate gestures with scrollwheel down instead of rightmouse down?
// COULD:  alternate functions with ctrl/alt/shift?  why?  big point of extension is to use one hand
// COULD:  split tabs into separate window, merge tabs from different windows into one
// COULD: panic gesture / minimize window

// WOULD:  gesture function based on page content such as drag started on link
// WOULD:  export/import settings

(function() {
	var settings = null;
	var bindings = null;
	var tracker = gestsMousetracker();
	var glyph = gestsGlyph();

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.message === 'resync') {
			loadSettings();
		}
	});

	function loadSettings() {
		chrome.storage.local.get({settings: false, bindings: false}, function(res) {
			if(res.settings && res.bindings) {
				settings = res.settings;
				bindings = res.bindings;
				// settings.path.continuous = true;

				glyph.loadSettings(settings);

				tracker.loadSettings(settings);
				tracker.setCallbacks(
					function onContext() {
						if(settings.glyph.draw) {
							glyph.createContext();
						}
					},
					function onLetter(sequence, letter){
						if(settings.glyph.draw) {
							glyph.push(letter);
						}
						if(settings.glyph.drawName) {
							var gestName = bindings[sequence];
							if(gestName) {
								glyph.drawName(gestName[0].replace(/_/g, " "));
							} else {
								glyph.deleteName();
							}
						}
					},
					function onFinished(sequence){
						if(settings.glyph.draw) {
							glyph.deleteContext();
						}
						executeAction(sequence);
					}
				);
				tracker.enable();

			} else {
				console.log('Gesture settings not found');
			}
		});
	}

	localActions = {
		'scroll_to_top': function () {
			if(settings.smoothScroll) {
				$("html, body").animate({ scrollTop: 0 }, "slow");
			} else {
				window.scrollTo(0,0);
			}
		},
		'scroll_to_bottom': function () {
			if(settings.smoothScroll) {
				$("html, body").animate({ scrollTop: $(document).height()-$(window).height()}, "slow");
			} else {
				window.scrollTo(0, window.innerHeight);
			}
		}
	}

	function executeAction (seq) {
		var commands = bindings[seq];
		if(commands) {
			for(var i = 0; i<commands.length; i++) {
				if(localActions[commands[i]]) {
					localActions[commands[i]]();
				} else {
					chrome.runtime.sendMessage({action: 'gesture', name: commands[i]});
				}
				console.log('gesture ' + commands[i] + ' executed')
			}
		}
	}

	loadSettings();
})();