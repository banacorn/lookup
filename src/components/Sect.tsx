import * as React from 'react';
import { State, Section, BlockElem } from '../types';
import Header from './Header';
import Block from './Block';

interface SectProps extends React.Props<any> {
    level: number;
    name: string;
    body: BlockElem[];
    subs: Section<BlockElem[]>[];
};

class Sect extends React.Component<SectProps, void> {
    render(): JSX.Element {
        const { level, name, body, subs } = this.props;
        return (
            <section>
                <Header level={level}>{name}</Header>
                {body.map((block, i) => (<Block key={`body-${i}`} >{block}</Block>))}
                {subs.map((section, i) => (<Sect
                        key={`subsection-${i}`}
                        level={level + 1}
                        name={section.name}
                        body={section.body}
                        subs={section.subs}
                    ></Sect>)
                )}
            </section>
        )
    }
}

export default Sect;
