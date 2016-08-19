import * as React from 'react'
import { connect } from 'react-redux';
import { State, Section } from '../types'

interface LangSectProps extends React.Props<any> {
    languageName: string;
    subs: Section<any>[];
};

class LangSect extends React.Component<LangSectProps, void> {
    render() {
        const { languageName, subs } = this.props;
        return (
            <section>
                <h2>{ languageName }</h2>
                <ul>
                    {subs.map((val, i) =>
                        <li key={languageName + `-` + i}>{val.name}</li>
                    )}
                </ul>
            </section>
        )
    }
}

export default LangSect;
