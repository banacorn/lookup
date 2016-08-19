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
	function debugGreen(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.green);
	}
	var word = process.argv[2] || 'Legierung';
	read(word, function (body) {
	    console.log('=================================================='.magenta);
	    console.time('parse');
	    parser_1.parseXML(body).then(function (result) {
	        // debugGreen(result)
	        // debug('done');
	        result = parser_1.truncate(result);
	        console.timeEnd('parse');
	        console.time('group');
	        parser_1.groupByHeader(result, 'languages', 2);
	        console.timeEnd('group');
	        // debug(groupByHeader(result, 'languages', 2));
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
	// given a list of DOM elements, build a tree with headers as ineteral nodes
	function groupByHeader(nodes, name, level) {
	    var intervals = [];
	    nodes.forEach(function (node, i) {
	        if (node['#name'] && isHeader(node['#name'], level))
	            intervals.push(i);
	    });
	    // console.log("looking for: h" + level);
	    // console.log("intervals:", intervals)
	    // console.log("total length:", nodes.length)
	    if (intervals.length > 0) {
	        var body = _.take(nodes, intervals[0]);
	        var subs = intervals.map(function (start, i) {
	            var name = nodes[start].$$[0]._;
	            var interval;
	            if (i === intervals.length - 1) {
	                interval = [start + 1, nodes.length];
	            }
	            else {
	                interval = [start + 1, intervals[i + 1]];
	            }
	            var segment = nodes.slice(interval[0], interval[1]);
	            return groupByHeader(segment, name, level + 1);
	        });
	        return {
	            name: name,
	            body: body,
	            subs: subs
	        };
	    }
	    else {
	        var body = nodes;
	        return {
	            name: name,
	            body: body,
	            subs: []
	        };
	    }
	}
	exports.groupByHeader = groupByHeader;
	function truncate(input) {
	    var nodes = input.html.body[0].div[2].div[2].div[3].$$;
	    // trucates some nodes before the content parts
	    nodes = _.drop(nodes, _.findIndex(nodes, ['#name', 'h2']));
	    // removes <hr>s between language sections
	    nodes = nodes.filter(function (node) { return node['#name'] !== 'hr'; });
	    return nodes;
	}
	exports.truncate = truncate;
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
	function parseXML(raw) {
	    return new Promise(function (resolve, reject) {
	        xml2js_1.parseString(raw, {
	            explicitChildren: true,
	            preserveChildrenOrder: true
	        }, function (err, result) {
	            if (err) {
	                reject(err);
	            }
	            else {
	                resolve(result);
	            }
	        });
	    });
	}
	exports.parseXML = parseXML;
	function parser(raw) {
	    return new Promise(function (resolve, reject) {
	        xml2js_1.parseString(raw, {
	            explicitChildren: true,
	            preserveChildrenOrder: true,
	            ignoreAttrs: true
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
	exports.parser = parser;


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