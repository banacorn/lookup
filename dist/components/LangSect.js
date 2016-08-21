"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Sect_1 = require('./Sect');
;
var LangSect = (function (_super) {
    __extends(LangSect, _super);
    function LangSect() {
        _super.apply(this, arguments);
    }
    LangSect.prototype.render = function () {
        var _a = this.props, languageName = _a.languageName, subs = _a.subs;
        return (React.createElement(Sect_1.default, {name: languageName, level: 2, body: [], subs: subs}));
    };
    return LangSect;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LangSect;
//# sourceMappingURL=LangSect.js.map