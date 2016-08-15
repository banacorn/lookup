console.log("Hello from DevTools");

chrome.devtools.panels.create("Lookup", null, "./chrome/panel.html", function(panel) { 
	console.log("Hello from callback");
});
