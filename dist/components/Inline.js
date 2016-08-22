"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_redux_1 = require('react-redux');
var actions_1 = require('../actions');
;
var mapDispatchToProps = function (dispatch) {
    return {
        onJump: function (elem) { return function (event) {
            dispatch(actions_1.lookup(elem.word));
            event.preventDefault();
        }; }
    };
};
var InlineC = (function (_super) {
    __extends(InlineC, _super);
    function InlineC() {
        _super.apply(this, arguments);
    }
    InlineC.prototype.render = function () {
        var elem = this.props.children;
        switch (elem.kind) {
            case 'plain':
                return React.createElement("span", null, elem.text);
            case 'i':
                return React.createElement("i", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "i-" + i}, e)); }));
            case 'em':
                return React.createElement("em", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "em-" + i}, e)); }));
            case 'b':
                return React.createElement("b", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "b-" + i}, e)); }));
            case 'strong':
                return React.createElement("strong", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "strong-" + i}, e)); }));
            case 'sup':
                return React.createElement("sup", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "sup-" + i}, e)); }));
            case 'abbr':
                return React.createElement("abbr", {title: elem.title}, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "abbr-" + i}, e)); }));
            case 'a':
                return React.createElement("a", {href: elem.href, title: elem.title, target: "_blank"}, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "a-" + i}, e)); }));
            case 'jump':
                return React.createElement("a", {onClick: this.props.onJump(elem), href: "", title: elem.name, target: "_blank"}, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "jump-" + i}, e)); }));
            default: return null;
        }
    };
    return InlineC;
}(React.Component));
var Inline = react_redux_1.connect(null, mapDispatchToProps)(InlineC);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Inline;
//# sourceMappingURL=Inline.js.map