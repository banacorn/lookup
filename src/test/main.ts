// import * as _ from 'lodash';
import { search } from './util';
import { parseXML, parseDocument } from '../chrome/parser';
// import { parser, parseXML, groupByHeader, truncate } from '../chrome/parser';
import { Section } from '../types';

const word = process.argv[2];

if (word) {
    search(word, (body) => {
        console.log('=================================================='.magenta)
        console.time('parse')
        const doc = parseXML(body);
        console.timeEnd('parse')
        console.time('build')
        const section = parseDocument(doc);
        console.timeEnd('build')
        // debug(section)
        // console.log(result.documentElement.childNodes[3].nodeName)
        // const contentNodeList: NodeList = result.documentElement.childNodes[3].childNodes[5].childNodes[9].childNodes;
        // console.log(contentNodeList[1])
        // Array.prototype.slice.call(contentNodeList).forEach((node: Node) => {
        //     console.log(node.nodeName)
        // })
    })
}
