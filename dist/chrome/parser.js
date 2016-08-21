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
    var isTextAndEmpty = node.nodeType == 3 && !/[^\t\n\r ]/.test(node.textContent);
    return !(isComment || isTextAndEmpty);
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
        case 'span':
        case 'SPAN':
            return _.flatten(toArray(node.childNodes).map(parseInline));
        case '#text':
            return [{
                    kind: 'plain',
                    text: node.textContent
                }];
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
//# sourceMappingURL=parser.js.map