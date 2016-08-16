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

	var Status = (function () {
	    function Status() {
	        this.connected = {};
	    }
	    Object.defineProperty(Status.prototype, "tabID", {
	        get: function () {
	            return this.lastInjected;
	        },
	        // the last injected tab id
	        set: function (id) {
	            this.lastInjected = id;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // connected tabs
	    Status.prototype.register = function (id) {
	        this.connected[id] = true;
	    };
	    Status.prototype.unregister = function (id) {
	        delete this.connected[id];
	    };
	    Status.prototype.shouldReInject = function (id) {
	        return this.connected[id] === true;
	    };
	    return Status;
	}());
	var connectionStatus = new Status;
	// the switchboard operator, that listens to all established connections coming in
	var operator = function (conn) {
	    switch (conn.name) {
	        case "woerterbuch-panel":
	            panelListener(conn);
	            break;
	        case "woerterbuch-injected":
	            injectedListener(conn);
	            break;
	    }
	};
	var injectScript = function (tabID) {
	    chrome.tabs.get(tabID, function () {
	        chrome.tabs.executeScript(tabID, { file: "./dist/injected.js" });
	        connectionStatus.tabID = tabID;
	    });
	};
	var panelListener = function (conn) {
	    var tabID = null;
	    // assign the listener function to a variable so we can remove it later
	    var onMessage = function (message) {
	        console.info(message.tabId, "injected");
	        injectScript(message.tabId);
	        tabID = message.tabId;
	        connectionStatus.register(tabID);
	    };
	    conn.onMessage.addListener(onMessage);
	    conn.onDisconnect.addListener(function () {
	        console.info(tabID, "removed");
	        connectionStatus.unregister(tabID);
	        conn.onMessage.removeListener(onMessage);
	    });
	};
	var injectedListener = function (conn) {
	    var tabID = connectionStatus.tabID;
	    // assign the listener function to a variable so we can remove it later
	    var onMessage = function (message) {
	    };
	    conn.onMessage.addListener(onMessage);
	    conn.onDisconnect.addListener(function () {
	        conn.onMessage.removeListener(onMessage);
	        // determine if the content script should be re-injected
	        if (connectionStatus.shouldReInject(tabID)) {
	            injectScript(tabID);
	        }
	    });
	};
	// starts listening to all incoming connections
	chrome.runtime.onConnect.addListener(operator);
	// unregister the tab when it's removed
	chrome.tabs.onRemoved.addListener(function (tabID) {
	    connectionStatus.unregister(tabID);
	});


/***/ }
/******/ ]);
//# sourceMappingURL=background.js.map