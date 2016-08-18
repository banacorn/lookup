import * as _ from 'lodash'
import { jump, render, parseError } from '../actions';
import parser from './parser';

// import { parseString } from 'xml2js';

type ID = number;
type Connection = {
    id: ID,
    tabClosed: boolean,
    upstream: {
        connection: any,
        destructor: () => void
    },
    downstream: {
        connection: any,
        destructor: () => void
    }
};



// upstream  : connetion from devtools panel
// downstream: connetion from injected webpage
class Operator {

    private injectedID: ID;

    // operator's switchboard
    private switchboard: Connection[];

    constructor() {
        this.switchboard = [];

        // starts listening to all incoming connections
        chrome.runtime.onConnect.addListener((connection: any) => {
            switch (connection.name) {
                case 'woerterbuch-panel':
                    this.handleUpstreamConnection(connection);
                    break;
                case 'woerterbuch-injected':
                    this.handleDownstreamConnection(connection);
                    break;
            }
        });

        // when some tabs got removed
        chrome.tabs.onRemoved.addListener((id: ID) => {
            console.info(id, 'tab X');
            this.markTabClosed(id);
        });
    }

    inject(id: ID) {
        chrome.tabs.get(id, () => {
            chrome.tabs.executeScript(id, { file: './dist/injected.js' });
            this.injectedID = id;
        });
    }

    // re-inject script if the upstream is still good but the downstream is dead
    reinject(id: ID) {
        console.info('attemping to reinject')
        const connection = this.getConnection(id);
        if (connection) {
            if (connection.upstream && !connection.downstream && !connection.tabClosed) {
                this.inject(id);
                console.info('reinjected!')
            }
        }
    }


    handleUpstreamConnection(connection: any) {
        // assign the listener function to a variable so we can remove it later
        const onMessage = (message: any) => {
            this.setUpstream(message.tabId, connection, () => {
                connection.onMessage.removeListener(onMessage);
                connection.onDisconnect.removeListener(onDisconnect);
            });
            connection.id = message.tabId;
            console.log(connection.id, 'upstream O');
            this.inject(message.tabId);
        };
        const onDisconnect = () => {
            this.killUpstream(connection.id);
        };
        connection.onMessage.addListener(onMessage);
        connection.onDisconnect.addListener(onDisconnect);
    }

    handleDownstreamConnection(connection: any) {
        const id = this.injectedID;
        // assign the listener function to a variable so we can remove it later
        const onMessage = (word: any) => {
            console.log('word:', word);

            // action: JUMP
            this.messageUpstream(id, jump(word));

            fetch(word, (raw) => {
                parser(raw).then(
                    result => {
                        // action: RENDER
                        this.messageUpstream(id, render(result))
                    },
                    error => this.messageUpstream(id, parseError(error))
                );
            });
        };
        const onDisconnect = () => {
            this.killDownstream(id);
            this.reinject(id);
        };
        // register connection
        this.setDownstream(id, connection, () => {
            connection.onMessage.removeListener(onMessage);
            connection.onMessage.removeListener(onDisconnect);
        });
        console.log(id, 'downstream O')
        connection.onMessage.addListener(onMessage);
        connection.onDisconnect.addListener(onDisconnect);
    }

    // switchboard
    getConnection(id: ID): Connection {
        return _.find(this.switchboard, ['id', id]);
    }

    setUpstream(id: ID, connection: any, destructor: () => void) {
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream = {
                connection: connection,
                destructor: destructor
            };
        } else {
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
    }

    markTabClosed(id: ID) {
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].tabClosed = true;
        }
    }

    setDownstream(id: ID, connection: any, destructor: () => void) {
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream = {
                connection: connection,
                destructor: destructor
            };
        } else {
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
    }

    killUpstream(id: ID) {
        console.info(id, 'removing upstream')
        this.showConnection(id);
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream.destructor();
            this.switchboard[existing].upstream = null;
            console.info(id, 'upstream XXX')

            // ask downstream to disconnect (if it still exists)
            this.messageDownstream(id, 'decommission');
        }
    }

    killDownstream(id: ID) {
        console.info(id, `removing downstream`)
        this.showConnection(id);

        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream.destructor();
            this.switchboard[existing].downstream = null;
            console.info(id, 'downstream XXX')
        }
    }

    messageUpstream(id: ID, message: any) {
        const connection = this.getConnection(id);
        if (connection && connection.upstream) {
            connection.upstream.connection.postMessage(message);
        }
    }
    messageDownstream(id: ID, message: any) {
        const connection = this.getConnection(id);
        if (connection && connection.downstream) {
            connection.downstream.connection.postMessage(message);
        }
    }

    showConnection(id: ID) {
        const existing = _.findIndex(this.switchboard, ['id', id]);

        let upConn = false;
        let upDstr = false;
        let downConn = false;
        let downDstr = false;


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

        let message = ''
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
        console.info(message)

    }
}

new Operator;

function fetch(word: string, callback: (word: string) => any) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}
