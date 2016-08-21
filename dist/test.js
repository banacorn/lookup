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
	// import * as _ from 'lodash';
	var util_1 = __webpack_require__(2);
	var parser_1 = __webpack_require__(7);
	var word = process.argv[2];
	if (word) {
	    util_1.search(word, function (body) {
	        console.log('=================================================='.magenta);
	        console.time('parse');
	        var doc = parser_1.parseXML(body);
	        console.timeEnd('parse');
	        console.time('build');
	        var section = parser_1.parseDocument(doc);
	        console.timeEnd('build');
	        util_1.debug(section.subs.length);
	        util_1.debug(section.subs[0].subs[0].body.length);
	        util_1.debug(section);
	        // Array.prototype.slice.call(section.subs[0].subs[0].body[0].childNodes).forEach((node: Node, i: number) => {
	        //     if (i === 1) {
	        //         console.log(node.childNodes[0].childNodes[0])
	        //     }
	        //     // console.log(`[${node.textContent}]`)
	        //     // debug(node.nodeName)
	        //     // console.log(node)
	        // })
	        // debug(section.subs.length)
	        // console.log(result.documentElement.childNodes[3].nodeName)
	        // const contentNodeList: NodeList = result.documentElement.childNodes[3].childNodes[5].childNodes[9].childNodes;
	        // console.log(contentNodeList[1])
	        // Array.prototype.slice.call(contentNodeList).forEach((node: Node) => {
	        //     console.log(node.nodeName)
	        // })
	    });
	}


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(3);
	var util_1 = __webpack_require__(4);
	__webpack_require__(5);
	var request = __webpack_require__(6);
	function debug(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.cyan);
	}
	exports.debug = debug;
	function debugGreen(s) {
	    var t = util_1.inspect(s, false, null);
	    console.log(t.green);
	}
	exports.debugGreen = debugGreen;
	function fetch(word, callback) {
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
	exports.fetch = fetch;
	function search(word, callback) {
	    fs.readFile("corpse/" + word, function (err, data) {
	        if (err && err.errno === -2) {
	            console.log((word + " not found").gray);
	            fetch(word, callback);
	        }
	        else {
	            callback(data.toString());
	        }
	    });
	}
	exports.search = search;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("colors");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(8);
	var types_1 = __webpack_require__(9);
	function isHeader(s, level) {
	    var match = s.match(/^[Hh](\d)+$/);
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
	var notIgnorable = function (node) {
	    var isComment = node.nodeType === 8;
	    var isTextAndEmpty = node.nodeType == 3 && !/[^\t\n\r ]/.test(node.textContent);
	    return !(isComment || isTextAndEmpty);
	};
	function parseXML(raw) {
	    if (typeof window === 'undefined') {
	        // in nodejs
	        var DOMParser_1 = __webpack_require__(10).DOMParser;
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
	function parse(raw) {
	    var entry = parseDocument(parseXML(raw));
	    return entry.subs.map(function (s) { return ({
	        languageName: s.name,
	        subs: s.subs
	    }); });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = parse;
	// given a NodeList, build a tree with headers as ineteral nodes
	function buildSection(list, name, level) {
	    var intervals = [];
	    list.forEach(function (node, i) {
	        if (isHeader(node.nodeName, level))
	            intervals.push(i);
	    });
	    if (intervals.length > 0) {
	        var body = _.take(list, intervals[0])
	            .filter(notIgnorable)
	            .map(parseBlockElem);
	        // .map(blockToText)
	        // .join('');
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
	        var body = list
	            .filter(notIgnorable)
	            .map(parseBlockElem);
	        // .map(blockToText)
	        // .join('');
	        return {
	            name: name,
	            body: body,
	            subs: []
	        };
	    }
	}
	function toArray(nodes) {
	    return Array.prototype.slice.call(nodes);
	}
	function parseBlockElem(node) {
	    switch (node.nodeName) {
	        case 'p':
	        case 'P':
	            return ({
	                kind: 'paragraph',
	                body: _.flatten(toArray(node.childNodes).map(parseInline))
	            });
	        default:
	            return ({
	                kind: 'paragraph',
	                body: _.flatten(toArray(node.childNodes).map(parseInline))
	            });
	    }
	}
	function parseInline(node) {
	    switch (node.nodeName) {
	        // induction case: subtree of inline elements
	        case 'span':
	        case 'SPAN':
	            return _.flatten(toArray(node.childNodes).map(parseInline));
	        // plain text node
	        case '#text':
	            return [{
	                    kind: 'plain',
	                    text: node.textContent
	                }];
	        // italic
	        case 'i':
	        case 'I':
	            return [{
	                    kind: 'italic',
	                    body: _.flatten(toArray(node.childNodes).map(parseInline))
	                }];
	        default:
	            return [{
	                    kind: 'plain',
	                    text: "<" + node.nodeName + ">" + node.textContent + "</" + node.nodeName + ">\n"
	                }];
	    }
	}
	function sectionToText(s) {
	    return types_1.mapSection(function (blocks) { return blocks.map(types_1.blockToText).join(''); }, s);
	}
	exports.sectionToText = sectionToText;


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	function mapSection(f, _a) {
	    var name = _a.name, body = _a.body, subs = _a.subs;
	    return {
	        name: name,
	        body: f(body),
	        subs: subs.map(function (s) { return mapSection(f, s); })
	    };
	}
	exports.mapSection = mapSection;
	function inlineToText(x) {
	    switch (x.kind) {
	        case 'plain':
	            return x.text;
	        case 'italic':
	            return x.body.map(inlineToText).join('');
	        default:
	            return '';
	    }
	}
	exports.inlineToText = inlineToText;
	function blockToText(node) {
	    switch (node.kind) {
	        case 'paragraph':
	            return node.body.map(inlineToText).join('');
	        default:
	            return "<unknown block element>";
	    }
	}
	exports.blockToText = blockToText;


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("xmldom");

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map