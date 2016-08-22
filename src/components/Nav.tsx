import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../types'
import { search } from '../actions'

interface NavProps extends React.Props<any> {
    lookupStatus: "pending" | "succeed" | "failed",
    onSearch: (e: Event) => void
};

const mapStateToProps = (state: State) => {
    return {
        lookupStatus: state.lookupStatus,
    }
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
        const { lookupStatus, onSearch } = this.props;
        return (
            <nav>
                <p>{ lookupStatus }</p>
                <form onSubmit={onSearch}>
                    <input id="search-box" type="text"/>
                </form>
            </nav>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);
