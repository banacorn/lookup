"use strict";
var _ = require('lodash');
var actions_1 = require('../actions');
var parser_1 = require('./parser');
var Operator = (function () {
    function Operator() {
        var _this = this;
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
            console.info(id, 'tab X');
            _this.markTabClosed(id);
        });
    }
    Operator.prototype.inject = function (id) {
        var _this = this;
        chrome.tabs.get(id, function () {
            chrome.tabs.executeScript(id, { file: './dist/injected.js' });
            _this.injectedID = id;
        });
    };
    Operator.prototype.reinject = function (id) {
        console.info('attemping to reinject');
        var connection = this.getConnection(id);
        if (connection) {
            if (connection.upstream && !connection.downstream && !connection.tabClosed) {
                this.inject(id);
                console.info('reinjected!');
            }
        }
    };
    Operator.prototype.handleUpstreamConnection = function (connection) {
        var _this = this;
        var onMessage = function (message) {
            _this.setUpstream(message.tabId, connection, function () {
                connection.onMessage.removeListener(onMessage);
                connection.onDisconnect.removeListener(onDisconnect);
            });
            connection.id = message.tabId;
            console.log(connection.id, 'upstream O');
            _this.inject(message.tabId);
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
        var onMessage = function (word) {
            console.log('word:', word);
            _this.messageUpstream(id, actions_1.jump(word));
            fetch(word, function (raw) {
                _this.messageUpstream(id, actions_1.render(parser_1.default(raw)));
            });
        };
        var onDisconnect = function () {
            _this.killDownstream(id);
            _this.reinject(id);
        };
        this.setDownstream(id, connection, function () {
            connection.onMessage.removeListener(onMessage);
            connection.onMessage.removeListener(onDisconnect);
        });
        console.log(id, 'downstream O');
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
        console.info(id, 'removing upstream');
        this.showConnection(id);
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream.destructor();
            this.switchboard[existing].upstream = null;
            console.info(id, 'upstream XXX');
            this.messageDownstream(id, 'decommission');
        }
    };
    Operator.prototype.killDownstream = function (id) {
        console.info(id, "removing downstream");
        this.showConnection(id);
        var existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream.destructor();
            this.switchboard[existing].downstream = null;
            console.info(id, 'downstream XXX');
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
    Operator.prototype.showConnection = function (id) {
        var existing = _.findIndex(this.switchboard, ['id', id]);
        var upConn = false;
        var upDstr = false;
        var downConn = false;
        var downDstr = false;
        if (existing !== -1) {
            if (this.switchboard[existing].upstream) {
                if (this.switchboard[existing].upstream.connection)
                    upConn = true;
                if (this.switchboard[existing].upstream.destructor)
                    upDstr = true;
            }
            if (this.switchboard[existing].downstream) {
                if (this.switchboard[existing].downstream.connection)
                    downConn = true;
                if (this.switchboard[existing].downstream.destructor)
                    downDstr = true;
            }
        }
        var message = '';
        message += 'up: ';
        if (upConn) {
            message += '📶 ';
        }
        if (upConn) {
            message += '💣 ';
        }
        message += ' down: ';
        if (downConn) {
            message += '📶 ';
        }
        if (downDstr) {
            message += '💣 ';
        }
        console.info(message);
    };
    return Operator;
}());
new Operator;
function fetch(word, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
//# sourceMappingURL=background.js.map