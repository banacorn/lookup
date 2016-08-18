import * as Promise from 'bluebird'
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

var xml2js: any = require('xml2js');

function parseXMLPromise(raw: string): Promise<any> {
    const optionsAugemented = (text: string, callback: any) => xml2js.parseString(text, {
        explicitChildren: true,
        preserveChildrenOrder: true
    }, callback);
    return Promise.promisify(optionsAugemented)(raw);
}

export default parseXMLPromise
