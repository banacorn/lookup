import * as React from 'react'
import { connect } from 'react-redux';
import { State, LookupState } from '../types'
import { search } from '../actions'

interface NavProps extends React.Props<any> {
    lookup: LookupState,
    onSearch: (e: Event) => void
};

const mapStateToProps = (state: State) => {
    return {
        lookup: state.lookup
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
        const { lookup, onSearch } = this.props;
        return (
            <nav>
                <p>{`${lookup.word}: ${lookup.status}`}</p>
                <p>{ lookup.history }</p>
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
