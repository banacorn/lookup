import * as React from "react";

export interface HelloProps {
    word: string;
}

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello {this.props.word}</h1>;
    }
}
