import * as _ from 'lodash'
import * as Promise from 'bluebird'
import { parseString } from 'xml2js';
import { Section } from '../types'

function isHeader(s: string, level?: number): boolean {
    const match = s.match(/^h(\d)+$/);
    if (match) {
        if (level) {
            return parseInt(match[1]) === level;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

// given a list of DOM elements, build a tree with headers as ineteral nodes
function groupByHeader(nodes: any[], name: string, level: number): Section {

    let intervals: number[] = [];
    nodes.forEach((node, i) => {
        if (node['#name'] && isHeader(node['#name'], level))
            intervals.push(i);
    });

    // console.log("looking for: h" + level);
    // console.log("intervals:", intervals)
    // console.log("total length:", nodes.length)
    if (intervals.length > 0) {
        const body = _.take(nodes, intervals[0]);
        const subs = intervals.map((start, i) => {
            const name = nodes[start].$$[0]._;
            let interval: [number, number];
            if (i === intervals.length - 1) {  // last inteval
                interval = [start + 1, nodes.length];
            } else {
                interval = [start + 1, intervals[i + 1]];
            }
            const segment = nodes.slice(interval[0], interval[1]);
            return groupByHeader(segment, name, level + 1);
        });
        return {
            name: name,
            body: body,
            subs: subs
        }

    } else {
        const body = nodes;
        return {
            name: name,
            body: body,
            subs: []
        }
    }
}

function truncate(input: any): any {
    let nodes = input.html.body[0].div[2].div[2].div[3].$$;
    // trucates some nodes before the content parts
    nodes = _.drop(nodes, _.findIndex(nodes, ['#name', 'h2']));
    // removes <hr>s between language sections
    nodes = nodes.filter((node: any) => node['#name'] !== 'hr' );

    return nodes;
}

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

function parseXML(raw: string): Promise<any> {
    return new Promise<Section[]>((resolve, reject) => {
        parseString(raw, {
            explicitChildren: true,
            preserveChildrenOrder: true
        }, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


function parser(raw: string): Promise<Section[]> {
    return new Promise<Section[]>((resolve, reject) => {
        parseString(raw, {
            explicitChildren: true,
            preserveChildrenOrder: true,
            ignoreAttrs: true
        }, (err: Error, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(transform(result));
            }
        });
    });
}

export {
    truncate,
    groupByHeader,
    parseXML,
    parser
}
