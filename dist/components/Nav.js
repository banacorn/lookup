"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_redux_1 = require('react-redux');
var actions_1 = require('../actions');
require('../style/main.less');
;
var mapStateToProps = function (_a) {
    var status = _a.status, entry = _a.entry;
    return {
        word: entry.word,
        status: status
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        onSearch: function (e) {
            e.preventDefault();
            var searchBox = document.getElementById('search-box');
            var word = searchBox.value;
            dispatch(actions_1.lookup(word));
        },
        onBackward: function (e) {
            dispatch(actions_1.backward);
        },
        onForward: function (e) {
            dispatch(actions_1.forward);
        }
    };
};
var Nav = (function (_super) {
    __extends(Nav, _super);
    function Nav() {
        _super.apply(this, arguments);
    }
    Nav.prototype.render = function () {
        var _a = this.props, word = _a.word, status = _a.status, onSearch = _a.onSearch, onBackward = _a.onBackward, onForward = _a.onForward;
        return (React.createElement("nav", {id: 'nav'}, 
            React.createElement("button", {onClick: onBackward}, 
                React.createElement("i", {className: "fa fa-chevron-left", "aria-hidden": "true"})
            ), 
            React.createElement("button", {onClick: onForward}, 
                React.createElement("i", {className: "fa fa-chevron-right", "aria-hidden": "true"})
            ), 
            React.createElement("h1", null, word), 
            React.createElement("form", {onSubmit: onSearch}, 
                React.createElement("input", {id: 'search-box', type: 'text'})
            )));
    };
    return Nav;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Nav);
//# sourceMappingURL=Nav.js.map