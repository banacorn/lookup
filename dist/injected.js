/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	console.log("injected");
	// establish connection with the background page
	var backgroundConn = chrome.runtime.connect({
	    name: "woerterbuch-injected"
	});
	var lastWord = undefined;
	var onMouseup = function () {
	    var word = window.getSelection().toString().trim();
	    var repeated = word === lastWord;
	    lastWord = word;
	    if (word && !repeated) {
	        // sends request to the background when there's a non-trivial selection
	        backgroundConn.postMessage(word);
	    }
	};
	backgroundConn.onMessage.addListener(function (message) {
	    // asked by the background page to disconnect with her
	    if (message === "decommission") {
	        document.removeEventListener("mouseup", onMouseup);
	        backgroundConn.disconnect();
	    }
	});
	// listens to text selection events
	document.addEventListener("mouseup", onMouseup, false);


/***/ }
/******/ ]);
//# sourceMappingURL=injected.js.map