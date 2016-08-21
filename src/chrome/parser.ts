import * as _ from 'lodash'
import { DOMParserStatic } from 'xmldom';
import { Section, LanguageSection, InlineElem, BlockElem, mapSection, blockToText } from '../types'

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

export function parseDocument(doc: Document): Section<BlockElem[]> {
    const contentNode: Node = doc.getElementById('mw-content-text');
    const nodeList: Node[] = Array.prototype.slice.call(contentNode.childNodes);
    return buildSection(nodeList, "Entry", 2);
}

export default function parse(raw: string): LanguageSection[] {
    const entry = parseDocument(parseXML(raw));
    return entry.subs.map(s => ({
        languageName: s.name,
        subs: s.subs
        // subs: s.subs.map(sectionToText)
    }))
}


// given a NodeList, build a tree with headers as ineteral nodes
function buildSection(list: Node[], name: string, level: number): Section<BlockElem[]> {

    let intervals: number[] = [];
    list.forEach((node, i) => {
        if (isHeader(node.nodeName, level))
            intervals.push(i);
    });
    if (intervals.length > 0) {
        const body = _.take(list, intervals[0])
            .filter(notIgnorable)
            .map(parseBlockElem)
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
        const body = list
            .filter(notIgnorable)
            .map(parseBlockElem)
        return {
            name: name,
            body: body,
            subs: []
        }
    }
}

function toArray(nodes: NodeList): Node[] {
    return Array.prototype.slice.call(nodes);
}

function parseBlockElem(node: Node): BlockElem {
    switch (node.nodeName) {
        case 'p':
        case 'P':
            return <BlockElem>({
                kind: 'paragraph',
                body: _.flatten(toArray(node.childNodes).map(parseInline))
            })
        default:
            return <BlockElem>({
                kind: 'paragraph',
                body: _.flatten(toArray(node.childNodes).map(parseInline))
            })
    }
}

function parseInline(node: Node): InlineElem[] {
    switch (node.nodeName) {
        // induction case: subtree of inline elements
        case 'span':
        case 'SPAN':
            return _.flatten(toArray(node.childNodes).map(parseInline));
        // plain text node
        case '#text':
            return <InlineElem[]>[{
                kind: 'plain',
                text: node.textContent
            }]
        // italic
        case 'i':
        case 'I':
            return <InlineElem[]>[{
                kind: 'italic',
                body: _.flatten(toArray(node.childNodes).map(parseInline))
            }]
        // link
        case 'a':
        case 'A':
            return <InlineElem[]>[{
                kind: 'link',
                href: (<Element>node).getAttribute('href'),
                title: (<Element>node).getAttribute('title'),
                body: _.flatten(toArray(node.childNodes).map(parseInline))
            }]
        default:
            return <InlineElem[]>[{
                kind: 'plain',
                text: `<${node.nodeName}>${node.textContent}</${node.nodeName}>\n`
            }]
    }
}

export function sectionToText(s: Section<BlockElem[]>): Section<string> {
    return mapSection(blocks => blocks.map(blockToText).join(''), s);
}
