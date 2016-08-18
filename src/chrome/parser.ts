import * as _ from 'lodash'
import * as Promise from 'bluebird'
import { parseString } from 'xml2js';
import { Section } from '../types'

// function group(input: any[], tag: string): Section[] {
//     let result: Section[] = [];
//
//     let section: Section = null;
//     input.forEach((node: any) => {
//         if (node['#name'] === tag && section === null) {
//             section = {
//                 name: node.span[0]._,
//                 body: "",
//                 subs: []
//             }
//         }
//     })
//     return result;
//     //
//     // let section
//     // if (node['#name'] === tag) {
//     //
//     // }
// }
//

function transform(input: any): Section[] {
    let nodes = input.html.body[0].div[2].div[2].div[3].$$;
    // trucates some nodes before the content parts
    nodes = _.drop(nodes, _.findIndex(nodes, ['#name', 'h2']));
    // removes <hr>s between language sections
    nodes = nodes.filter((node: any) => node['#name'] !== 'hr' );

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
