import * as React from 'react';
import { State, Section, BlockElem, InlineElem, inlineToText } from '../types';


class Inline extends React.Component<React.Props<any>, void> {
    private id: string;
    componentWillMount() {
        this.id = _.uniqueId();
    }
    render(): JSX.Element {
        const elem = this.props.children as InlineElem;
        switch (elem.kind) {
            case 'plain':
                return <span>{elem.text}</span>;
            case 'italic':
                return <i>{elem.body.map((e, i) => (
                    <Inline key={`italic-${i}`}>{e}</Inline>
                ))}</i>;
            default: return null;
        }
    }
}

export default Inline;
