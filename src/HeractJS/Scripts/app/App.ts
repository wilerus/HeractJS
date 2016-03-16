/// <reference path="../../typings/main.d.ts" />

import $ = require('jquery');
import React = require('react')
import DOM = require('react-dom')
export = ganttBar;

class ganttBar extends React.Component<any, any>  {
    constructor() {
        super()
        this.state = {
            width: 100,
            marginLeft: 10,
            fillDivWidth: 10,
            elementText: 'Task 10'
        }
    }

    componentDidMount() {
        this.setState({ marginLeft: this.props.style.marginLeft })
    }

    onDragRight(e) {
        let newWidth = e.pageX - this.state.marginLeft;
        if (newWidth !== 0 && e.pageX!== 0) {
            this.setState({
                width: newWidth
            })
        }
    }

    onDragLeft(e) {
        let newMarginLeft = e.pageX;
        let newWidth =  this.state.width - (e.pageX - this.state.marginLeft) ;
        if (newMarginLeft !== 0 && e.pageX!== 0) {
            this.setState({
                marginLeft: newMarginLeft,
                width: newWidth
            })
        }
    }

    onDragFill(e) {
        let newFillDivWidth = e.pageX - this.state.marginLeft;
        if (newFillDivWidth !== 0 && e.pageX !== 0) {
            this.setState({
                fillDivWidth: newFillDivWidth
            })
        }
    }

    render() {
        let el = React.createElement("div", {
            style: {
                position: 'relative',
                marginTop: '20px',
                marginBottom: '20px',
                top: this.props.style.top
            }
        },
            React.createElement("div", { // main element
                style: {
                    position: 'absolute',
                    borderRadius: '2px',
                    width: this.state.width,
                    marginLeft: this.state.marginLeft,
                    height: '20px',
                    backgroundColor: '#3db9d3',
                    boxShadow: '0 0 5px #299cb4',
                    border: '1px solid #2898b0'
                }
            }),
            React.createElement('div', { // the fill div
                style: {
                    position: 'absolute',
                    color: 'rgb(255,255,255)',
                    textShadow: '2px 2px rgb(0,0,0)',
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px',
                    width: this.state.fillDivWidth,
                    marginLeft: this.state.marginLeft,
                    height: '21px',
                    textAlign: 'center',
                    backgroundColor: '#299cb4'
                }
            }),
            React.createElement("div", { // text element
                style: {
                    position: 'absolute',
                    color: 'rgb(255,255,255)',
                    width: this.state.width,
                    marginLeft: this.state.marginLeft,
                    marginTop: '2px',
                    height: '20px',
                    backgroundColor: 'transparent',
                    textAlign: 'center'
                }
            }, this.props.text),
            React.createElement('div', { // controls the main element width
                onDrag: this.onDragRight.bind(this),
                draggable: 'true',
                style: {
                    position: 'absolute',
                    color: 'rgb(255,255,255)',
                    textShadow: '2px 2px rgb(0,0,0)',
                    borderTopRightRadius: '5px',
                    borderBottomRightRadius: '5px',
                    width: '10px',
                    marginLeft: this.state.width + this.state.marginLeft - 10,
                    textAlign: 'center',
                    backgroundColor: 'rgba(155,100,100,0)'
                }
            }, '||'),
            React.createElement('div', { // controls the main element left margin
                onDrag: this.onDragLeft.bind(this),
                draggable: 'true',
                style: {
                    position: 'absolute',
                    color: 'rgb(255,255,255)',
                    textShadow: '2px 2px rgb(0,0,0)',
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px',
                    width: '10px',
                    marginLeft: this.state.marginLeft,
                    textAlign: 'center',
                    backgroundColor: 'rgba(155,100,100,0)'
                }
            }, '||'),
            React.createElement('div', { // control the fill div width
                onDrag: this.onDragFill.bind(this),
                draggable: 'true',
                style: {
                    position: 'absolute',
                    color: 'rgba(0,0,0)',
                    fontSize: '26px',
                    marginTop: '19px',
                    width: '20px',
                    marginLeft: this.state.marginLeft + this.state.fillDivWidth - 10,
                    textAlign: 'center',
                    backgroundColor: 'rgba(155,100,100)'
                }
            }, '^')
        );
        return el;
    }
};

var ganttChartBar = React.createFactory(ganttBar);

var ganttBars = [];

for (var i = 0; i < 10; i++) {
    let topMargin = 50 * i
    let text = 'Task ' + i.toString()
    let leftMargin = 30 * i

    ganttBars.push(ganttChartBar({
        id: 'id1',
        text: text,
        style: {
            top: topMargin,
            marginLeft: leftMargin
        }
    }));
}

class ganttChartView extends React.Component<any, any> {
    render() {
        return React.createElement('div', {
            id: 'wrap'
        },
            ganttBars
        )
    }
};

DOM.render(React.createElement(ganttChartView), document.getElementById('content'))
