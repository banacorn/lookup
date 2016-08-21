import * as React from 'react';
import { State, Section, BlockElem, InlineElem, inlineToText } from '../types';
import Inline from './Inline'

class Block extends React.Component<React.Props<any>, void> {
    render(): JSX.Element {
        const elem = this.props.children as BlockElem;
        switch (elem.kind) {
            case 'p':
                return <p>{
                    elem.body.map((inline, i) => <Inline key={i}>{inline}</Inline>)
                }</p>;
            case 'ul':
                console.log(elem)
                return <ul>{
                    elem.body.map((li, i) => <Block key={i}>{li}</Block>)
                }</ul>;
            case 'li':
                return <li>{
                    elem.body.map((inline, i) => <Inline key={i}>{inline}</Inline>)
                }</li>;
            default: return null;
        }
    }
}

export default Block;
