"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_redux_1 = require('react-redux');
var LangSect_1 = require('./LangSect');
;
var mapStateToProps = function (state) {
    return state.entry;
};
var Entry = (function (_super) {
    __extends(Entry, _super);
    function Entry() {
        _super.apply(this, arguments);
    }
    Entry.prototype.render = function () {
        var _a = this.props, word = _a.word, body = _a.body;
        return (React.createElement("section", null, 
            React.createElement("h1", null, word), 
            React.createElement("ul", null, body.map(function (section) {
                return React.createElement(LangSect_1.default, {key: section.languageName, languageName: section.languageName, subs: section.subs});
            }))));
    };
    return Entry;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, null)(Entry);
//# sourceMappingURL=Entry.js.map