type TabID = number;

class Status {
    private lastInjected: TabID;
    private connected: {};
    constructor() {
        this.connected = {};
    }

    // the last injected tab id
    set tabID(id: TabID) {
        this.lastInjected = id;
    }

    get tabID(): TabID {
        return this.lastInjected;
    }

    // connected tabs
    register(id: TabID) {
        this.connected[id] = true;
    }
    unregister(id: TabID) {
        delete this.connected[id]
    }
    shouldReInject(id: TabID): boolean {
        return this.connected[id] === true;
    }
}

const connectionStatus = new Status;

// the switchboard operator, that listens to all established connections coming in
const operator = (conn: any) => {
    switch (conn.name) {
        case "woerterbuch-panel":
            panelListener(conn);
            break;
        case "woerterbuch-injected":
            injectedListener(conn);
            break;
    }
};

const injectScript = (tabID: TabID) => {
    chrome.tabs.get(tabID, () => {
        chrome.tabs.executeScript(tabID, { file: "./dist/injected.js" });
        connectionStatus.tabID = tabID;
    })
}

const panelListener = (conn: any) => {
    let tabID: TabID = null;
    // assign the listener function to a variable so we can remove it later
    const onMessage = (message: any) => {
        console.info(message.tabId, "injected");
        injectScript(message.tabId);
        tabID = message.tabId;
        connectionStatus.register(tabID);
    };
    conn.onMessage.addListener(onMessage);
    conn.onDisconnect.addListener(() => {
        console.info(tabID, "removed");
        connectionStatus.unregister(tabID);
        conn.onMessage.removeListener(onMessage);
    });
};

const injectedListener = (conn: any) => {
    const tabID = connectionStatus.tabID;
    // assign the listener function to a variable so we can remove it later
    const onMessage = (message: any) => {
    };
    conn.onMessage.addListener(onMessage);
    conn.onDisconnect.addListener(() => {
        conn.onMessage.removeListener(onMessage);
        // determine if the content script should be re-injected
        if (connectionStatus.shouldReInject(tabID)) {
            injectScript(tabID);
        }
    });
};

// starts listening to all incoming connections
chrome.runtime.onConnect.addListener(operator);

// unregister the tab when it's removed
chrome.tabs.onRemoved.addListener((tabID: TabID) => {
    connectionStatus.unregister(tabID);
})
