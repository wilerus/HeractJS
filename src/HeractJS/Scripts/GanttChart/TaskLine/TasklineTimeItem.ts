import React = require('react')

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
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            width: this.props.data.style.width,
            top: this.props.data.style.top,
            height: this.props.data.style.height,
            text: this.props.data.text
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
                height: 21,
                stroke: 'black',
                strokeWidth: 0.5,
                fill: 'none'
            }),
            React.createElement('text', {
                className: 'tasklineTimeLineText',
                x: this.state.marginLeft + this.state.width / 2,
                y: 13
            }, this.state.text)
        );
    }
};
