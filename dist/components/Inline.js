"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Inline = (function (_super) {
    __extends(Inline, _super);
    function Inline() {
        _super.apply(this, arguments);
    }
    Inline.prototype.render = function () {
        var elem = this.props.children;
        switch (elem.kind) {
            case 'plain':
                return React.createElement("span", null, elem.text);
            case 'italic':
                return React.createElement("i", null, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "italic-" + i}, e)); }));
            case 'link':
                return React.createElement("a", {href: elem.href, title: elem.title}, elem.body.map(function (e, i) { return (React.createElement(Inline, {key: "link-" + i}, e)); }));
            default: return null;
        }
    };
    return Inline;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Inline;
//# sourceMappingURL=Inline.js.map