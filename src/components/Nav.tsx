import * as React from 'react'
import { connect } from 'react-redux';
import { State } from '../types'
import { search } from '../actions'

interface NavProps extends React.Props<any> {
    status: 'pending' | 'succeed' | 'failed',

    // history
    history: string[],

    onSearch: (e: Event) => void
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
            dispatch(search(word));
        }
    };
};

class Nav extends React.Component<NavProps, void> {
    render() {
        const { status, history, onSearch } = this.props;
        return (
            <nav>
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
