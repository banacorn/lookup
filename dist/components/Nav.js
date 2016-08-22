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
var mapStateToProps = function (state) {
    return {
        nav: state.nav
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        onSearch: function (e) {
            e.preventDefault();
            var searchBox = document.getElementById('search-box');
            var word = searchBox.value;
            dispatch(actions_1.search(word));
        }
    };
};
var Nav = (function (_super) {
    __extends(Nav, _super);
    function Nav() {
        _super.apply(this, arguments);
    }
    Nav.prototype.render = function () {
        var _a = this.props, nav = _a.nav, onSearch = _a.onSearch;
        return (React.createElement("nav", null, 
            React.createElement("p", null, nav.word + ": " + nav.status), 
            React.createElement("p", null, nav.history), 
            React.createElement("form", {onSubmit: onSearch}, 
                React.createElement("input", {id: 'search-box', type: 'text'})
            )));
    };
    return Nav;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Nav);
//# sourceMappingURL=Nav.js.map