import React = require('react')

export class Timeline extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: ''
        }
    }

    private componentDidMount() {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            width: this.props.data.style.width,
            top: this.props.data.style.top,
            height: this.props.data.style.height,
            text: this.props.data.text
        })
    }

    render() {
        return React.createElement('g', {
            y: this.state.top,
            x: this.state.marginLeft
        },
            React.createElement('rect', {
                y: this.state.top,
                x: this.state.marginLeft,
                width: this.state.width,
                height: this.state.height,
                stroke: 'rgb(100,100,100)',
                //strokeDasharray: '0, 90, 60, 90',
                strokeWidth: 0.5,
                fill: 'none'
            }),
            React.createElement('text', {
                className: 'timeLineText',
                fontSize: 12,
                x: this.state.marginLeft + this.state.width * 0.5,
                y: this.state.top + 20
            }, this.state.text)
        )
    }
};
