import * as React from 'react'
import { connect } from 'react-redux';
import { State, Status, History } from '../types'
import { lookup, backward, forward } from '../actions'

interface NavProps extends React.Props<any> {
    status: Status,

    // history
    history: History,

    onSearch: (e: Event) => void,
    onBackward: (e: Event) => void,
    onForward: (e: Event) => void
};

const mapStateToProps = ({ status, history }: State) => {
    return {
        status,
        history: history.present
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
        },
        onForward: (e: Event) => {
            dispatch(forward);
        }
    };
};

class Nav extends React.Component<NavProps, void> {
    render() {
        const { status, history, onSearch, onBackward, onForward } = this.props;
        return (
            <nav>
                <button onClick={onBackward}>backward</button>
                <button onClick={onForward}>forward</button>
                <p>{`${_.last(history.words)}: ${status}`}</p>
                <p>{ history.words.toString() }</p>
                <p>{ history.cursor }</p>
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
