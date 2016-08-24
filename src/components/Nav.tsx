import * as React from 'react'
import { connect } from 'react-redux';
import { State, Status, History } from '../types'
import { lookup, backward, forward } from '../actions'
// stylesheets
require('../stylesheets/main.less');

interface NavProps extends React.Props<any> {
    word: string,
    status: Status,

    // history
    // history: History,

    onSearch: (word: string) => void,
    onBackward: (e: Event) => void,
    onForward: (e: Event) => void
};

const mapStateToProps = ({ status, entry }: State) => {
    return {
        word: entry.word,
        status
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSearch: (word: string) => {
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

type NavState = {
    toggleSearch: boolean
}

class Nav extends React.Component<NavProps, NavState> {
    constructor(props: NavProps) {
        super(props);

        this.state = {
            toggleSearch: false,
        };
    }

    handleClick() {
        this.setState({
            toggleSearch: true
        });
        const searchBox = document.getElementById('search') as HTMLInputElement;
        setTimeout(() => searchBox.focus(), 0);
    }

    handleSearch(e: any) {

        e.preventDefault(); // prevent submit from refreshing the page
        const searchBox = document.getElementById('search') as HTMLInputElement;
        const word: string = searchBox.value;
        this.props.onSearch(word);

        this.handleQuitSearch();
    }

    handleQuitSearch() {
        this.setState({
            toggleSearch: false
        });
    }

    render() {
        const { word, status, onSearch, onBackward, onForward } = this.props;

        return (
            <nav id="nav">
            <button onClick={onBackward}><i className="fa fa-chevron-left" aria-hidden="true"></i></button>
            <form
                className={this.state.toggleSearch ? '' : 'hidden'}
                onSubmit={e => this.handleSearch(e)}
                onBlur={e => this.handleQuitSearch()}
            >
                <label htmlFor="search"><i className="fa fa-search" aria-hidden="true"></i></label>
                <input id="search" type="text" />
            </form>
            <h1
                className={this.state.toggleSearch ? 'hidden' : ''}
                onClick={e => this.handleClick()}
            >{ word }</h1>
            <button onClick={onForward}><i className="fa fa-chevron-right" aria-hidden="true"></i></button>
            </nav>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);
