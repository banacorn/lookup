import * as React from 'react';
import { State, Section, BlockElem, InlineElem, inlineToText } from '../types';


class Inline extends React.Component<React.Props<any>, void> {
    render(): JSX.Element {
        const elem = this.props.children as InlineElem;
        switch (elem.kind) {
            case 'plain':
                return <span>{elem.text}</span>;
            case 'i':
                return <i>{elem.body.map((e, i) => (
                    <Inline key={`i-${i}`}>{e}</Inline>
                ))}</i>;
            case 'em':
                return <em>{elem.body.map((e, i) => (
                    <Inline key={`em-${i}`}>{e}</Inline>
                ))}</em>;
            case 'b':
                return <b>{elem.body.map((e, i) => (
                    <Inline key={`b-${i}`}>{e}</Inline>
                ))}</b>;
            case 'strong':
                return <strong>{elem.body.map((e, i) => (
                    <Inline key={`strong-${i}`}>{e}</Inline>
                ))}</strong>;
            case 'sup':
                return <sup>{elem.body.map((e, i) => (
                    <Inline key={`sup-${i}`}>{e}</Inline>
                ))}</sup>;
            case 'abbr':
                return <abbr
                    title={elem.title}
                >{elem.body.map((e, i) => (
                    <Inline key={`abbr-${i}`}>{e}</Inline>
                ))}</abbr>;
            case 'a':
                return <a
                    href={elem.href}
                    title={elem.title}
                    target="_blank"
                >{elem.body.map((e, i) => (
                    <Inline key={`a-${i}`}>{e}</Inline>
                ))}</a>;
            case 'jump':
                return <a
                    onClick={(e) => {e.preventDefault()}}
                    href=""
                    title={elem.name}
                >{elem.body.map((e, i) => (
                    <Inline key={`jump-${i}`}>{e}</Inline>
                ))}</a>;
            default: return null;
        }
    }
}

export default Inline;
