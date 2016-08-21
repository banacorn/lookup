import * as React from 'react'
import { State, Section } from '../types'
import Header from './Header'

interface SectProps extends React.Props<any> {
    level: number;
    name: string;
    body: string;
    subs: Section<string>[];
};

class Sect extends React.Component<SectProps, void> {
    render(): JSX.Element {
        const { level, name, body, subs } = this.props;
        return (
            <section>
                <Header level={level}>{name}</Header>
                <p>{body}</p>
                {subs.map((section, i) => (<Sect
                        key={`${level}-${i}`}
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
