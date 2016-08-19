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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(1);
	var util_1 = __webpack_require__(2);
	__webpack_require__(3);
	var request = __webpack_require__(4);
	var parser_1 = __webpack_require__(5);
	function debug(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.cyan);
	}
	function debugGreen(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.green);
	}
	var word = process.argv[2] || 'Legierung';
	read(word, function (body) {
	    console.log('=================================================='.magenta);
	    console.time('parse');
	    var doc = parser_1.parseXML(body);
	    console.timeEnd('parse');
	    console.time('build');
	    var section = parser_1.parseDocument(doc);
	    console.timeEnd('build');
	    console.log(section.subs[0].subs);
	    // debug(section)
	    // console.log(result.documentElement.childNodes[3].nodeName)
	    // const contentNodeList: NodeList = result.documentElement.childNodes[3].childNodes[5].childNodes[9].childNodes;
	    // console.log(contentNodeList[1])
	    // Array.prototype.slice.call(contentNodeList).forEach((node: Node) => {
	    //     console.log(node.nodeName)
	    // })
	    // console.log(DOMParser)
	    // parseXML(body).then((result) => {
	    //     // debugGreen(result)
	    //     // debug('done');
	    //     result = truncate(result);
	    //     console.timeEnd('parse')
	    //     console.time('group')
	    //     groupByHeader(result, 'languages', 2);
	    //     console.timeEnd('group')
	    //     // debug(groupByHeader(result, 'languages', 2));
	    // })
	});
	function get(word, callback) {
	    console.log(("fetching " + word).gray);
	    request("http://en.wiktionary.org/w/index.php?title=" + word + "&printable=true", function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log((word + " fetched").gray);
	            callback(body);
	            fs.writeFile("corpse/" + word, body);
	        }
	        else {
	            console.log(("fetching " + word + " failed").gray, response.statusCode);
	        }
	    });
	}
	function read(word, callback) {
	    fs.readFile("corpse/" + word, function (err, data) {
	        if (err && err.errno === -2) {
	            console.log((word + " not found").gray);
	            get(word, callback);
	        }
	        else {
	            callback(data.toString());
	        }
	    });
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("colors");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(6);
	function isHeader(s, level) {
	    var match = s.match(/^h(\d)+$/);
	    if (match) {
	        if (level) {
	            return parseInt(match[1]) === level;
	        }
	        else {
	            return true;
	        }
	    }
	    else {
	        return false;
	    }
	}
	function parseXML(raw) {
	    if (typeof window === 'undefined') {
	        // in nodejs
	        var DOMParser_1 = __webpack_require__(7).DOMParser;
	        return new DOMParser_1().parseFromString(raw, 'text/html');
	    }
	    else {
	        // in browser
	        return new DOMParser().parseFromString(raw, 'text/html');
	    }
	}
	exports.parseXML = parseXML;
	function parseDocument(doc) {
	    var contentNode = doc.getElementById('mw-content-text');
	    var nodeList = Array.prototype.slice.call(contentNode.childNodes);
	    return buildSection(nodeList, "Entry", 2);
	}
	exports.parseDocument = parseDocument;
	// given a NodeList, build a tree with headers as ineteral nodes
	function buildSection(list, name, level) {
	    var intervals = [];
	    list.forEach(function (node, i) {
	        if (isHeader(node.nodeName, level))
	            intervals.push(i);
	    });
	    if (intervals.length > 0) {
	        var body = _.take(list, intervals[0]);
	        var subs = intervals.map(function (start, i) {
	            var name = list[start].childNodes[0].textContent;
	            var interval;
	            if (i === intervals.length - 1) {
	                interval = [start + 1, list.length];
	            }
	            else {
	                interval = [start + 1, intervals[i + 1]];
	            }
	            var segment = list.slice(interval[0], interval[1]);
	            return buildSection(segment, name, level + 1);
	        });
	        return {
	            name: name,
	            body: body,
	            subs: subs
	        };
	    }
	    else {
	        var body = list;
	        return {
	            name: name,
	            body: body,
	            subs: []
	        };
	    }
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("xmldom");

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map