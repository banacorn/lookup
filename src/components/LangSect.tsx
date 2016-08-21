import * as React from 'react'
import { connect } from 'react-redux';
import { State, Section, BlockElem } from '../types'
import Sect from './Sect'

interface LangSectProps extends React.Props<any> {
    languageName: string;
    subs: Section<BlockElem[]>[];
};

class LangSect extends React.Component<LangSectProps, void> {
    render() {
        const { languageName, subs } = this.props;
        return (
            <Sect
                name={languageName}
                level={2}
                body={[] as BlockElem[]}
                subs={subs}>
            </Sect>
        )
    }
}

export default LangSect;
