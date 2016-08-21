import * as React from 'react';
import { State, Section, BlockElem, InlineElem, inlineToText } from '../types';
import Inline from './Inline'

class Block extends React.Component<React.Props<any>, void> {
    render(): JSX.Element {
        const elem = this.props.children as BlockElem;
        switch (elem.kind) {
            case 'paragraph':
                return <p>{
                    elem.body.map((inline, i) => <Inline key={i}>{inline}</Inline>)
                }</p>;
            default: return null;
        }
    }
}

export default Block;
