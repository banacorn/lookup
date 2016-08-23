"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var react_redux_1 = require('react-redux');
var redux_1 = require('redux');
var redux_thunk_1 = require('redux-thunk');
var App_1 = require('./components/App');
var reducer_1 = require('./reducer');
var actions_1 = require('./actions');
var util_1 = require('./util');
var store = redux_1.createStore(reducer_1.default, redux_1.applyMiddleware(redux_thunk_1.default));
ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, 
    React.createElement(App_1.default, null)
), document.getElementById('app'));
if (util_1.inWebpage) {
    store.dispatch(actions_1.lookup("Eisen"));
}
else {
    util_1.connectBackground(store);
}
//# sourceMappingURL=index.js.map