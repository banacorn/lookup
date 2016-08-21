import * as React from 'react';
import { State, Section, BlockElem, InlineElem, inlineToText } from '../types';


class Inline extends React.Component<React.Props<any>, void> {
    render(): JSX.Element {
        const elem = this.props.children as InlineElem;
        switch (elem.kind) {
            case 'plain':
                return <span>{elem.text}</span>;
            case 'italic':
                return <i>{elem.body.map((e, i) => (
                    <Inline key={`italic-${i}`}>{e}</Inline>
                ))}</i>;
            case 'link':
                return <a
                    href={elem.href}
                    title={elem.title}
                >{elem.body.map((e, i) => (
                    <Inline key={`link-${i}`}>{e}</Inline>
                ))}</a>;
            default: return null;
        }
    }
}

export default Inline;
