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
    const isTextAndEmpty = node.nodeType === 3 && !/[^\t\n\r ]/.test(node.textContent);
    const isEmptyParagraph = node.nodeName === 'p' || node.nodeName === 'P' && !/[^\t\n\r ]/.test(node.textContent);
    return !(isComment || isTextAndEmpty || isEmptyParagraph);
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
    removeWhitespace(contentNode);
    const nodeList: Node[] = Array.prototype.slice.call(contentNode.childNodes);
    console.log(contentNode)
    return buildSection(nodeList, "Entry", 2);
}

export default function parse(raw: string): LanguageSection[] {
    const entry = parseDocument(parseXML(raw));
    return entry.subs.map(s => ({
        languageName: s.name,
        subs: s.subs
    }))
}

// removes whitespaces in the tree
function removeWhitespace(node: Node) {
    if (node && node.childNodes) {
        const children: Node[] = Array.prototype.slice.call(node.childNodes);
        children.forEach(child => {
            if (notIgnorable(child)) {
                removeWhitespace(child);
            } else {
                node.removeChild(child);
            }
        });
    }
}

// given a NodeList, build a tree with headers as ineteral nodes
function buildSection(list: Node[], name: string, level: number): Section<BlockElem[]> {
    let intervals: number[] = [];
    list.forEach((node, i) => {
        if (isHeader(node.nodeName, level))
            intervals.push(i);
    });
    if (intervals.length > 0) {
        const body = _.take(list, intervals[0]).map(parseBlockElem)
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
        const body = list.map(parseBlockElem)
        return {
            name: name,
            body: body,
            subs: []
        }
    }
}

function toArray(nodes: NodeList): Node[] {
    if (nodes)
        return Array.prototype.slice.call(nodes);
    else
        return [];
}

function parseBlockElem(node: Node): BlockElem {
    switch (node.nodeName) {
        case 'p':
        case 'P':
            return <BlockElem>({
                kind: 'p',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            })
        case 'ol':
        case 'OL':
            return <BlockElem>({
                kind: 'ol',
                body: _.flatten(toArray(node.childNodes).map(parseBlockElem))
            });
        case 'ul':
        case 'UL':
            return <BlockElem>({
                kind: 'ul',
                body: _.flatten(toArray(node.childNodes).map(parseBlockElem))
            })
        case 'li':
        case 'LI':
            return <BlockElem>({
                kind: 'li',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            })
        default:
            return <BlockElem>({
                kind: 'p',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            })
    }
}

function parseInlineElem(node: Node): InlineElem[] {
    switch (node.nodeName) {
        // base case: plain text node
        case '#text':
            return <InlineElem[]>[{
                kind: 'plain',
                text: node.textContent
            }]
        // subtree of inline elements
        case 'span':
        case 'SPAN':
            return _.flatten(toArray(node.childNodes).map(parseInlineElem));
        // italic
        case 'i':
        case 'I':
            return <InlineElem[]>[{
                kind: 'i',
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
            }]
        // link
        case 'a':
        case 'A':
            return <InlineElem[]>[{
                kind: 'a',
                href: (<Element>node).getAttribute('href'),
                title: (<Element>node).getAttribute('title'),
                body: _.flatten(toArray(node.childNodes).map(parseInlineElem))
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
