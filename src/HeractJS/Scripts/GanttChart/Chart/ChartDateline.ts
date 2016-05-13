import * as React from 'react';

export class Timeline extends React.Component<any, any> {
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
        },
            React.createElement('rect', {
                y: -1,
                x: this.state.marginLeft,
                width: this.state.width,
                height: 29,
                strokeWidth: 0.5,
                stroke: 'rgb(190, 190, 190)',
                fill: 'none'
            }),
            React.createElement('text', {
                className: 'timeLineText',
                x: this.state.marginLeft + this.state.width * 0.5,
                y: 18
            }, this.state.text)
        );
    }
};
