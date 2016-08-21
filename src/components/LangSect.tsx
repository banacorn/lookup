import * as React from 'react'
import { connect } from 'react-redux';
import { State, Section } from '../types'
import Sect from './sect'

interface LangSectProps extends React.Props<any> {
    languageName: string;
    subs: Section<string>[];
};

class LangSect extends React.Component<LangSectProps, void> {
    render() {
        const { languageName, subs } = this.props;
        return (
            <Sect
                name={languageName}
                level={2}
                body={""}
                subs={subs}>
            </Sect>
            // <section>
            //     <h2>{ languageName }</h2>
            //     <ul>
            //         {subs.map((val, i) =>
            //             <li key={languageName + `-` + i}>{val.name}</li>
            //         )}
            //     </ul>
            // </section>
        )
    }
}

export default LangSect;
