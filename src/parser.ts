import * as Promise from 'bluebird'

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

var xml2js: any = require('xml2js');

function parseXMLPromise(raw: string): Promise<any> {
    return new Promise((resolve, reject) => {
        xml2js.parseString(raw, {
            explicitChildren: true,
            preserveChildrenOrder: true
        }, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.html.body[0].div[2].div[2].div[3]);
            }
        });
    });
}

export default parseXMLPromise
