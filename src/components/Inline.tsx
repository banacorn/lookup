import * as React from 'react';
import { connect } from 'react-redux';
import { State, Section, InlineElem, inlineToText, Inline as I } from '../types';
import { search } from '../actions';

interface InlineProps extends React.Props<any> {
    onJump: (elem: I.Jump) => (event: Event) => void;
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onJump: (elem: I.Jump) => (event: Event) => {
            dispatch(search(elem.word));
            event.preventDefault(); // prevent submit from refreshing the page
        }
    };
};

class InlineC extends React.Component<InlineProps, void> {
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
                    onClick={this.props.onJump(elem)}
                    href=""
                    title={elem.name}
                    target="_blank"
                >{elem.body.map((e, i) => (
                    <Inline key={`jump-${i}`}>{e}</Inline>
                ))}</a>;
            default: return null;
        }
    }
}

const Inline = connect(null, mapDispatchToProps)(InlineC);
export default Inline;
