"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_redux_1 = require('react-redux');
var Entry_1 = require('./Entry');
var Nav_1 = require('./Nav');
;
var mapStateToProps = function (state) {
    return {};
};
var mapDispatchToProps = function (dispatch) {
    return {};
};
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        return (React.createElement("article", null, 
            React.createElement(Nav_1.default, null), 
            React.createElement(Entry_1.default, null)));
    };
    return App;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(App);
//# sourceMappingURL=App.js.map