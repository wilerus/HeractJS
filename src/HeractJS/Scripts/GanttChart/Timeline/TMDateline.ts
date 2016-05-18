import * as React from 'react';

export class TasklineTimeItem extends React.Component<any, any> {
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

    private componentDidMount() {
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
        } as React.DOMAttributes,
            React.createElement('rect', {
                y: -1,
                x: this.state.marginLeft,
                width: this.state.width,
                height: 20,
                stroke: 'rgb(200,200,200)',
                strokeWidth: 1,
                fill: 'none'
            } as React.DOMAttributes),
            React.createElement('text', {
                className: 'tasklineTimeLineText',
                x: this.state.marginLeft + this.state.width / 2,
                y: 13
            } as React.DOMAttributes, this.state.text)
        );
    }
};
