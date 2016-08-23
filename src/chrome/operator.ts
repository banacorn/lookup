import * as _ from 'lodash'
import * as EventEmitter from 'eventemitter3';

export namespace EVENT {
    export namespace PANEL {
        export const CONNECTED = 'PANEL_CONNECTED';
        export const DISCONNECTED = 'PANEL_DISCONNECTED';
        export const MESSAGE = 'PANEL_MESSAGE';
    }
    export namespace CONTENT {
        export const CONNECTED = 'CONTENT_CONNECTED';
        export const INJECTED = 'CONTENT_INJECTED';
        export const REINJECTED = 'CONTENT_REINJECTED';
        export const DISCONNECTED = 'CONTENT_DISCONNECTED';
        export const MESSAGE = 'CONTENT_MESSAGE';
    }
    export namespace TAB {
        export const CLOSED = 'TAB_CLOSED';
    }
}

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
class Operator extends EventEmitter {

    private injectedID: ID;

    // operator's switchboard
    private switchboard: Connection[];

    constructor() {
        super();
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
            this.emit(EVENT.TAB.CLOSED, id)
            this.markTabClosed(id);
        });
    }

    inject(id: ID) {
        chrome.tabs.get(id, () => {
            chrome.tabs.executeScript(id, { file: './dist/injected.js' });
            this.emit(EVENT.CONTENT.INJECTED, id)
            this.injectedID = id;
        });
    }

    // re-inject script if the upstream is still good but the downstream is dead
    reinject(id: ID) {
        const connection = this.getConnection(id);
        if (connection) {
            if (connection.upstream && !connection.downstream && !connection.tabClosed) {
                this.inject(id);
                this.emit(EVENT.CONTENT.REINJECTED, id)
            }
        }
    }


    handleUpstreamConnection(connection: any) {
        // assign the listener function to a variable so we can remove it later
        const onMessage = (message: any) => {
            if (message.type === 'initialize') {
                this.setUpstream(message.id, connection, () => {
                    connection.onMessage.removeListener(onMessage);
                    connection.onDisconnect.removeListener(onDisconnect);
                });
                connection.id = message.id;
                this.emit(EVENT.PANEL.CONNECTED, connection.id)
                this.inject(message.id);
            } else {
                this.emit(EVENT.PANEL.MESSAGE, connection.id, message.payload);
            }
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
        const onMessage = (message: any) => {
            this.emit(EVENT.CONTENT.MESSAGE, id, message);
        }
        // const onMessage = (word: string) => this.onMessage((msg: any) => this.messageUpstream(id, msg), word);
        const onDisconnect = () => {
            this.killDownstream(id);
            this.reinject(id);
        };
        // register connection
        this.setDownstream(id, connection, () => {
            connection.onMessage.removeListener(onMessage);
            connection.onMessage.removeListener(onDisconnect);
        });
        this.emit(EVENT.CONTENT.CONNECTED, id)
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
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].upstream.destructor();
            this.switchboard[existing].upstream = null;
            this.emit(EVENT.PANEL.DISCONNECTED, id)

            // ask downstream to disconnect (if it still exists)
            this.messageDownstream(id, 'decommission');
        }
    }

    killDownstream(id: ID) {
        const existing = _.findIndex(this.switchboard, ['id', id]);
        if (existing !== -1) {
            this.switchboard[existing].downstream.destructor();
            this.switchboard[existing].downstream = null;
            this.emit(EVENT.CONTENT.DISCONNECTED, id)
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
}

export default new Operator;
