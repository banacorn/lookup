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
	var util_1 = __webpack_require__(4);
	__webpack_require__(2);
	var request = __webpack_require__(3);
	var parser_1 = __webpack_require__(5);
	function debug(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.cyan);
	}
	var word = process.argv[2] || "Legierung";
	read(word, function (body) {
	    console.log("==================================================".magenta);
	    parser_1.default(body).then(function (result) {
	        debug(result);
	    });
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

	module.exports = require("colors");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(6);
	var Promise = __webpack_require__(7);
	var xml2js_1 = __webpack_require__(8);
	// function group(input: any[], tag: string): Section[] {
	//     let result: Section[] = [];
	//
	//     let section: Section = null;
	//     input.forEach((node: any) => {
	//         if (node['#name'] === tag && section === null) {
	//             section = {
	//                 name: node.span[0]._,
	//                 body: "",
	//                 subs: []
	//             }
	//         }
	//     })
	//     return result;
	//     //
	//     // let section
	//     // if (node['#name'] === tag) {
	//     //
	//     // }
	// }
	//
	function transform(input) {
	    var nodes = input.html.body[0].div[2].div[2].div[3].$$;
	    // trucates some nodes before the content parts
	    nodes = _.drop(nodes, _.findIndex(nodes, ['#name', 'h2']));
	    // removes <hr>s between language sections
	    nodes = nodes.filter(function (node) { return node['#name'] !== 'hr'; });
	    var result = [];
	    nodes.forEach(function (node) {
	        switch (node['#name']) {
	            case 'h2':
	                result.push({
	                    name: node.span[0]._,
	                    body: "...",
	                    subs: []
	                });
	                break;
	        }
	        console.log(node);
	    });
	    return result;
	}
	function parseXMLPromise(raw) {
	    return new Promise(function (resolve, reject) {
	        xml2js_1.parseString(raw, {
	            explicitChildren: true,
	            preserveChildrenOrder: true
	        }, function (err, result) {
	            if (err) {
	                reject(err);
	            }
	            else {
	                resolve(transform(result));
	            }
	        });
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = parseXMLPromise;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("xml2js");

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map