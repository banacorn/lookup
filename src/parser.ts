import * as _ from 'lodash'
import * as Promise from 'bluebird'
import { parseString } from 'xml2js';
import { Section } from './types'

function transform(input: any): Section[] {
    const nodes = input.html.body[0].div[2].div[2].div[3].$$;
    let result: Section[] = [];
    nodes.forEach((node: any) => {
        switch (node['#name']) {
            case 'h2':
                result.push({
                    name: node.span[0]._,
                    body: "...",
                    subs: []
                });
                break;
        }
        console.log(node);
    })
    return result;
}


function parseXMLPromise(raw: string): Promise<Section[]> {
    return new Promise<Section[]>((resolve, reject) => {
        parseString(raw, {
            explicitChildren: true,
            preserveChildrenOrder: true
        }, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(transform(result));
            }
        });
    });
}

export default parseXMLPromise
