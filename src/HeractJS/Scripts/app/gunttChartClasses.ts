/// <reference path="../../typings/main.d.ts" />

import $ = require('jquery');
import React = require('react')
import DOM = require('react-dom')
import * as globalStore from "./globalStore";

let globalStoreClass = new globalStore.globalStore();
const container = React.createFactory('div');

export class elementsConnection extends React.Component<any, any>  {
    constructor() {
        super()
        this.state = {
            firstPoint: '',
            secondPoint: '',
            thirdPoint: '',
            endPoint: '',
        }
    }

    componentDidMount() {
        this.setState({
            firstPoint: this.props.firstPoint,
            secondPoint: this.props.secondPoint,
            thirdPoint: this.props.thirdPoint,
            endPoint: this.props.endPoint
        })
    }

    render() {
        let el =
            React.createElement('polyline', {
                points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' + this.state.endPoint,
                strokeWidth: "3",
                stroke: "#888888",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "none"
            })

        return el;
    }
}

export class tempLine extends React.Component<any, any>  {
    globalStorePoints: globalStore.globalStore
    constructor() {
        super()
        this.globalStorePoints = globalStoreClass
        this.state = {
            endPointX: 0,
            endPointY: 0,
            listenerFunction: ''
        }
    }
    componentDidMount() {
        var move = (event) => {
            this.setState ( {
                firstPoint: this.props.firstPoint,
                endPointX: this.props.endPointX,
                endPointY: this.props.endPointY
            })

            DOM.render(React.createElement(tempLine, {
                firstPoint: this.props.firstPoint,
                endPointX: event.clientX,
                endPointY: event.clientY
            }), document.getElementById('svgPalet' + this.globalStorePoints.newSvgPaletId));
        }

        this.globalStorePoints.tempFunc = move

        document.onmousemove = move.bind(this)
    }

    componentWillUnmount() {
        document.onmousemove = undefined
    }

    render() {
        return React.createElement('polyline', {
                points: this.state.firstPoint + ' ' + this.state.endPointX + ',' + this.state.endPointY,
                strokeWidth: "3",
                stroke: "#888888",
                strokeLinecap: "round",
                strokeDasharray: "10,10",
                strokeLinejoin: "round",
                fill: "none"
            })
    }
}