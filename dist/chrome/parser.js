"use strict";
var _ = require('lodash');
var types_1 = require('../types');
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
    var isTextAndEmpty = node.nodeType === 3 && !/[^\t\n\r ]/.test(node.textContent);
    var isEmptyParagraph = node.nodeName === 'p' || node.nodeName === 'P' && !/[^\t\n\r ]/.test(node.textContent);
    return !(isComment || isTextAndEmpty || isEmptyParagraph);
};
function parseXML(raw) {
    if (typeof window === 'undefined') {
        var DOMParser_1 = require('xmldom').DOMParser;
        return new DOMParser_1().parseFromString(raw, 'text/html');
    }
    else {
        return new DOMParser().parseFromString(raw, 'text/html');
    }
}
exports.parseXML = parseXML;
function parseDocument(doc) {
    var contentNode = doc.getElementById('mw-content-text');
    removeWhitespace(contentNode);
    var nodeList = Array.prototype.slice.call(contentNode.childNodes);
    console.log(contentNode);
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
function removeWhitespace(node) {
    if (node && node.childNodes) {
        var children = Array.prototype.slice.call(node.childNodes);
        children.forEach(function (child) {
            if (notIgnorable(child)) {
                removeWhitespace(child);
            }
            else {
                node.removeChild(child);
            }
        });
    }
}
function buildSection(list, name, level) {
    var intervals = [];
    list.forEach(function (node, i) {
        if (isHeader(node.nodeName, level))
            intervals.push(i);
    });
    if (intervals.length > 0) {
        var body = _.take(list, intervals[0]).map(parseBlockElem);
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
        var body = list.map(parseBlockElem);
        return {
            name: name,
            body: body,
            subs: []
        };
    }
}
function toArray(nodes) {
    if (nodes)
        return Array.prototype.slice.call(nodes);
    else
        return [];
}
function parseBlockElem(node) {
    switch (node.nodeName) {
        case 'p':
        case 'P':
            return ({
                kind: 'p',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            });
        case 'ul':
        case 'UL':
            console.log("ul");
            return ({
                kind: 'ul',
                body: _.flatten(toArray(node.childNodes).map(parseBlockElem))
            });
        case 'li':
        case 'LI':
            console.log("li");
            return ({
                kind: 'li',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            });
        default:
            return ({
                kind: 'p',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            });
    }
}
function parseInlineElem(node) {
    switch (node.nodeName) {
        case '#text':
            return [{
                    kind: 'plain',
                    text: node.textContent
                }];
        case 'span':
        case 'SPAN':
            return _.flatten(toArray(node.childNodes).map(parseInlineElem));
        case 'i':
        case 'I':
            return [{
                    kind: 'i',
                    body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
                }];
        case 'a':
        case 'A':
            return [{
                    kind: 'a',
                    href: node.getAttribute('href'),
                    title: node.getAttribute('title'),
                    body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
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
//# sourceMappingURL=parser.js.map