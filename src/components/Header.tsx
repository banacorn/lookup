import * as React from 'react'
import * as _ from 'lodash'

interface HeaderProps extends React.HTMLProps<HTMLElement> {
    level: number;
};

class Header extends React.Component<HeaderProps, void> {
    render () {
        const { level, children } = this.props;
        const otherProps = _.omit(this.props, 'level', 'children');
        switch (level) {
            case 1: return <h1 {...otherProps}>{children}</h1>
            case 2: return <h2 {...otherProps}>{children}</h2>
            case 3: return <h3 {...otherProps}>{children}</h3>
            case 4: return <h4 {...otherProps}>{children}</h4>
            case 5: return <h5 {...otherProps}>{children}</h5>
            case 6: return <h6 {...otherProps}>{children}</h6>
            default:
                return <h1 {...otherProps}>{children}</h1>
        }
    }
}

export default Header;
