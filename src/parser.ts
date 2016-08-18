import * as Promise from 'bluebird'
import { parseString } from 'xml2js';

function parseXMLPromise(raw: string): Promise<any> {
    return new Promise((resolve, reject) => {
        parseString(raw, {
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
