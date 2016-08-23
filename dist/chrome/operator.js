"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var EventEmitter = require('eventemitter3');
var EVENT;
(function (EVENT) {
    var PANEL;
    (function (PANEL) {
        PANEL.CONNECTED = 'PANEL_CONNECTED';
        PANEL.DISCONNECTED = 'PANEL_DISCONNECTED';
        PANEL.MESSAGE = 'PANEL_MESSAGE';
    })(PANEL = EVENT.PANEL || (EVENT.PANEL = {}));
    var CONTENT;
    (function (CONTENT) {
        CONTENT.CONNECTED = 'CONTENT_CONNECTED';
        CONTENT.INJECTED = 'CONTENT_INJECTED';
        CONTENT.REINJECTED = 'CONTENT_REINJECTED';
        CONTENT.DISCONNECTED = 'CONTENT_DISCONNECTED';
        CONTENT.MESSAGE = 'CONTENT_MESSAGE';
    })(CONTENT = EVENT.CONTENT || (EVENT.CONTENT = {}));
    var TAB;
    (function (TAB) {
        TAB.CLOSED = 'TAB_CLOSED';
    })(TAB = EVENT.TAB || (EVENT.TAB = {}));
})(EVENT = exports.EVENT || (exports.EVENT = {}));
var Operator = (function (_super) {
    __extends(Operator, _super);
    function Operator() {
        var _this = this;
        _super.call(this);
        this.switchboard = [];
        chrome.runtime.onConnect.addListener(function (connection) {
            switch (connection.name) {
                case 'woerterbuch-panel':
                    _this.handleUpstreamConnection(connection);
                    break;
                case 'woerterbuch-injected':
                    _this.handleDownstreamConnection(connection);
                    break;
            }
        });
        chrome.tabs.onRemoved.addListener(function (id) {
            _this.emit(EVENT.TAB.CLOSED, id);
            _this.markTabClosed(id);
        });
    }
    Operator.prototype.inject = function (id) {
        var _this = this;
        chrome.tabs.get(id, function () {
            chrome.tabs.executeScript(id, { file: './dist/injected.js' });
            _this.emit(EVENT.CONTENT.INJECTED, id);
            _this.injectedID = id;
        });
    };
    Operator.prototype.reinject = function (id) {
        var connection = this.getConnection(id);
        if (connection) {
            if (connection.upstream && !connection.downstream && !connection.tabClosed) {
                this.inject(id);
                this.emit(EVENT.CONTENT.REINJECTED, id);
            }
        }
    };
    Operator.prototype.handleUpstreamConnection = function (connection) {
        var _this = this;
        var onMessage = function (message) {
            if (message.type === 'initialize') {
                _this.setUpstream(message.id, connection, function () {
                    connection.onMessage.removeListener(onMessage);
                    connection.onDisconnect.removeListener(onDisconnect);
                });
                connection.id = message.id;
                _this.emit(EVENT.PANEL.CONNECTED, connection.id);
                _this.inject(message.id);
            }
            else {
                _this.emit(EVENT.PANEL.MESSAGE, connection.id, message.payload);
            }
        };
        var onDisconnect = function () {
            _this.killUpstream(connection.id);
        };
        connection.onMessage.addListener(onMessage);
        connection.onDisconnect.addListener(onDisconnect);
    };
    Operator.prototype.handleDownstreamConnection = function (connection) {
        var _this = this;
        var id = this.injectedID;
        var onMessage = function (message) {
            _this.emit(EVENT.CONTENT.MESSAGE, id, message);
        };
        var onDisconnect = function () {
            _this.killDownstream(id);
            _this.reinject(id);
        };
        this.setDownstream(id, connection, function () {
            connection.onMessage.removeListener(onMessage);
            connection.onMessage.removeListener(onDisconnect);
        });
        this.emit(EVENT.CONTENT.CONNECTED, id);
        connection.onMessage.addListener(onMessage);
        connection.onDisconnect.addListener(onDisconnect);
    };
    Operator.prototype.getConnection = function (id) {
        return _.find(this.switchboard, ['id', id]);
    };
    Operator.prototype.setUpstream = function (id, connection, destructor) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream = {
                connection: connection,
                destructor: destructor
            };
        }
        else {
            this.switchboard.push({
                id: id,
                tabClosed: false,
                upstream: {
                    connection: connection,
                    destructor: destructor
                },
                downstream: null
            });
        }
    };
    Operator.prototype.markTabClosed = function (id) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].tabClosed = true;
        }
    };
    Operator.prototype.setDownstream = function (id, connection, destructor) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream = {
                connection: connection,
                destructor: destructor
            };
        }
        else {
            this.switchboard.push({
                id: id,
                tabClosed: false,
                upstream: null,
                downstream: {
                    connection: connection,
                    destructor: destructor
                }
            });
        }
    };
    Operator.prototype.killUpstream = function (id) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream.destructor();
            this.switchboard[existing].upstream = null;
            this.emit(EVENT.PANEL.DISCONNECTED, id);
            this.messageDownstream(id, 'decommission');
        }
    };
    Operator.prototype.killDownstream = function (id) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream.destructor();
            this.switchboard[existing].downstream = null;
            this.emit(EVENT.CONTENT.DISCONNECTED, id);
        }
    };
    Operator.prototype.messageUpstream = function (id, message) {
        var connection = this.getConnection(id);
        if (connection && connection.upstream) {
            connection.upstream.connection.postMessage(message);
        }
    };
    Operator.prototype.messageDownstream = function (id, message) {
        var connection = this.getConnection(id);
        if (connection && connection.downstream) {
            connection.downstream.connection.postMessage(message);
        }
    };
    return Operator;
}(EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Operator;
//# sourceMappingURL=operator.js.map