
var defaultSettings = {
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

var defaultBindings = {
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

var gestureNames = ["next_tab", 
					"close_tab", 
					"prev_tab", 
					"rightmost_tab", 
					"reload", 
					"reopen_closed", 
					"reload_all"]

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
		if(request.action === "gesture") {
			commands[request.name](sender);
		} else if (request.action === "resync") {
			sendResyncMsg();
		} 
		// else if (request.message === "timeTest") {
		// 	console.log(Date.now() - request.time);
		// }
	}
);

var commands = {
	"close_tab": function (sender) {
		chrome.tabs.remove(sender.tab.id);
	},
	"next_tab": function (sender) {
		setActiveTabRelative(sender, 1);
	},
	"prev_tab": function (sender) {
		setActiveTabRelative(sender, -1);
	},
	"rightmost_tab": function (sender) {
		chrome.tabs.query({ currentWindow: true }, function (tabs) {
			var numTabs = tabs.length;
			var nextTabId = tabs[numTabs - 1].id;
			chrome.tabs.update(nextTabId, {"active": true});
		});
	},
	"leftmost_tab": function (sender) {
		chrome.tabs.query({ currentWindow: true }, function (tabs) {
			var numTabs = tabs.length;
			var nextTabId = tabs[0].id;
			chrome.tabs.update(nextTabId, {"active": true});
		});
	},
	"reload": function (sender) {
		chrome.tabs.reload(sender.tab.id);
	},
	"reopen_closed": function (sender) {
		chrome.sessions.restore();
	},
	"reload_all": function (sender) {
		// TODO
	}
}

function setActiveTabRelative(sender, n) {
	var currentTabIndex = sender.tab.index;
	chrome.tabs.query({ currentWindow: true }, function (tabs) {
		var numTabs = tabs.length;
		var nextTabIndex = modulo(currentTabIndex + n, numTabs);
		var nextTabId = tabs[nextTabIndex].id;
		chrome.tabs.update(nextTabId, {"active": true});
	});
}

function modulo(n, q) {
	// returns 0 or least positive number that is congruent to n mod q
	return ((n % q) + q) % q;
}

function sendResyncMsg() {
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {message: "resync"}, function (resp) {});
		}
	})
}

function loadSettings() {
	chrome.storage.local.get({settings: false, bindings: false}, function (res) {
		if (res.settings && res.bindings) {
			if(res.settings.shouldSync) {
				// syncSettings();
			}
		} else {
			initSettings();
		}
	});
}

function initSettings() {
	chrome.storage.local.set({settings: defaultSettings, bindings:defaultBindings, gestureNames:gestureNames}, function (results) {
			console.log("Initialized local settings");
	});
}

function syncSettings() {
	// Should only get here after extension is loaded so settings/bindings should be exist
	// chrome.storage.sync.get({settings: false, bindings: false, date: false}, function (res) {
	// 	if (res.settings && res.bindings && date) {
	// 		chrome.storage.local.set({settings: settings, bindings: bindings, date: Date.now()}, function (results) {
	// 				console.log("Settings synced");
	// 		});
	// 	} else {
	// 		initSettings();
	// 	}
	// });
}

function clearSettings() {
	chrome.storage.local.clear(function() { 
		console.log("Local settings cleared"); 
		chrome.storage.sync.clear(function() { 
			console.log("Sync settings cleared"); 
				initSettings();
		});
	});
}

clearSettings();
