import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../types'
import { lookup, backward } from '../actions'

interface NavProps extends React.Props<any> {
    status: 'pending' | 'succeed' | 'failed',

    // history
    history: string[],

    onSearch: (e: Event) => void,
    onBackward: (e: Event) => void
};

const mapStateToProps = ({ status, history }: State) => {
    return {
        status, history
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSearch: (e: Event) => {
            e.preventDefault(); // prevent submit from refreshing the page
            const searchBox = document.getElementById('search-box') as HTMLInputElement;
            const word: string = searchBox.value;
            dispatch(lookup(word));
        },
        onBackward: (e: Event) => {
            dispatch(backward);
        }
    };
};

class Nav extends React.Component<NavProps, void> {
    render() {
        const { status, history, onSearch, onBackward } = this.props;
        return (
            <nav>
                <button onClick={onBackward}>backward</button>
                <p>{`${_.last(history)}: ${status}`}</p>
                <p>{ history.toString() }</p>
                <form onSubmit={onSearch}>
                    <input id='search-box' type='text'/>
                </form>
            </nav>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);
