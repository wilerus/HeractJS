import * as React from 'react';

export class DateLine extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: ''
        };
    }

    public componentDidMount() {
        const data = this.props.data;
        this.setState({
            marginLeft: data.style.marginLeft,
            width: data.style.width,
            top: data.style.top,
            height: data.style.height,
            text: data.text
        });
    }

    public render() {
        return React.createElement('g', {
            y: this.state.top,
            x: this.state.marginLeft
        } as React.DOMAttributes<React.Component>,
            React.createElement('rect', {
                className: 'dateLineItem',
                x: this.state.marginLeft,
                y: -1,
                width: this.state.width
            } as React.DOMAttributes<React.Component>),
            React.createElement('text', {
                className: 'timeLineText',
                x: this.state.marginLeft + this.state.width * 0.5,
                y: 18
            } as React.DOMAttributes<React.Component>, this.state.text)
        );
    }
};
