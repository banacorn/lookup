import * as React from 'react'
import { connect } from 'react-redux';
import { State, NavState } from '../types'
import { search } from '../actions'

interface NavProps extends React.Props<any> {
    nav: NavState,
    onSearch: (e: Event) => void
};

const mapStateToProps = (state: State) => {
    return {
        nav: state.nav
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSearch: (e: Event) => {
            e.preventDefault(); // prevent submit from refreshing the page
            const searchBox = document.getElementById('search-box') as HTMLInputElement;
            const word: string = searchBox.value;
            dispatch(search(word));
        }
    };
};

class Nav extends React.Component<NavProps, void> {
    render() {
        const { nav, onSearch } = this.props;
        return (
            <nav>
                <p>{`${nav.word}: ${nav.status}`}</p>
                <p>{ nav.history }</p>
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
