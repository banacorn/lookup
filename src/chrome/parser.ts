import * as _ from 'lodash'
import { DOMParserStatic } from 'xmldom';
import { Section, LanguageSection, Inline, mapSection, toText } from '../types'

function isHeader(s: string, level?: number): boolean {
    const match = s.match(/^[Hh](\d)+$/);
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

const notIgnorable = (node: Node) => {
    const isComment = node.nodeType === 8;
    const isTextAndEmpty = node.nodeType == 3 && !/[^\t\n\r ]/.test(node.textContent);
    return !(isComment || isTextAndEmpty);
}

export function parseXML(raw: string): Document {
    if (typeof window === 'undefined') {
        // in nodejs
        const DOMParser: DOMParserStatic = require('xmldom').DOMParser;
        return new DOMParser().parseFromString(raw, 'text/html')
    } else {
        // in browser
        return new DOMParser().parseFromString(raw, 'text/html')
    }
}

export function parseDocument(doc: Document): Section<Inline[]> {
    const contentNode: Node = doc.getElementById('mw-content-text');
    const nodeList: Node[] = Array.prototype.slice.call(contentNode.childNodes);
    return buildSection(nodeList, "Entry", 2);
}

function sectionToText(s: Section<Inline[]>): Section<string> {
    return mapSection(inlines => inlines.map(toText).join(''), s);
}

export default function parse(raw: string): LanguageSection[] {
    const entry = parseDocument(parseXML(raw));
    return entry.subs.map(s => ({
        languageName: s.name,
        subs: s.subs.map(sectionToText)
    }))
}


// given a NodeList, build a tree with headers as ineteral nodes
function buildSection(list: Node[], name: string, level: number): Section<Inline[]> {

    let intervals: number[] = [];
    list.forEach((node, i) => {
        if (isHeader(node.nodeName, level))
            intervals.push(i);
    });
    if (intervals.length > 0) {
        const body = _.take(list, intervals[0]).filter(notIgnorable).map(node => <Inline>({
            kind: 'plain',
            text: node.textContent
        }));
        const subs = intervals.map((start, i) => {
            const name = list[start].childNodes[0].textContent;
            let interval: [number, number];
            if (i === intervals.length - 1) {  // last inteval
                interval = [start + 1, list.length];
            } else {
                interval = [start + 1, intervals[i + 1]];
            }
            const segment = list.slice(interval[0], interval[1]);
            return buildSection(segment, name, level + 1);
        });
        return {
            name: name,
            body: body,
            subs: subs
        }

    } else {
        const body = list.filter(notIgnorable).map(node => <Inline>({
            kind: 'plain',
            text: node.textContent
        }));
        return {
            name: name,
            body: body,
            subs: []
        }
    }
}
