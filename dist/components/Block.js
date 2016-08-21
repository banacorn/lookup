"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Inline_1 = require('./Inline');
var Block = (function (_super) {
    __extends(Block, _super);
    function Block() {
        _super.apply(this, arguments);
    }
    Block.prototype.render = function () {
        var elem = this.props.children;
        switch (elem.kind) {
            case 'paragraph':
                return React.createElement("p", null, elem.body.map(function (inline, i) { return React.createElement(Inline_1.default, {key: i}, inline); }));
            default: return null;
        }
    };
    return Block;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Block;
//# sourceMappingURL=Block.js.map