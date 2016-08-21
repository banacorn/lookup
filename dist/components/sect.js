"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Header_1 = require('./Header');
var Block_1 = require('./Block');
;
var Sect = (function (_super) {
    __extends(Sect, _super);
    function Sect() {
        _super.apply(this, arguments);
    }
    Sect.prototype.render = function () {
        var _a = this.props, level = _a.level, name = _a.name, body = _a.body, subs = _a.subs;
        return (React.createElement("section", null, 
            React.createElement(Header_1.default, {level: level}, name), 
            body.map(function (block, i) { return (React.createElement(Block_1.default, {key: "body-" + i}, block)); }), 
            subs.map(function (section, i) { return (React.createElement(Sect, {key: "subsection-" + i, level: level + 1, name: section.name, body: section.body, subs: section.subs})); })));
    };
    return Sect;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sect;
//# sourceMappingURL=Sect.js.map