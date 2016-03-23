/// <reference path="../../typings/main.d.ts" />

import $ = require('jquery');
import React = require('react')
import DOM = require('react-dom')
import * as globalStore from "./globalStore";
import * as gunttChartClasses from "./gunttChartClasses";
export = ganttChartView;

let globalStoreClass = new globalStore.globalStore();
// initial set up
const amountOfElements = 100;
const svgGridWidth = 100;

let ganttBars = [];
let counter = 0;

// simulating server data
for (var i = 0; i < amountOfElements; i++) {
    if (i % 2 === 0) {
        counter++;
    }

    let topMargin = 50 * i
    let text = 'Task ' + i.toString()
    let leftMargin = svgGridWidth * counter
    let barClass = 'group1'

    if (counter < 6) {
        barClass = 'group1'
    } else if (counter >= 6 && counter <= 11) {
        barClass = 'group2'
    } else {
        barClass = 'group3'
    }

    ganttBars.push({
        id: 'bar' + i,
        barClass: barClass,
        type: 'bar',
        text: text,
        style: {
            top: topMargin,
            marginLeft: leftMargin
        }
    });
}

// gannt bars wrapper
class ganttChartView extends React.Component<any, any> {
    componentWillMount() {
        this.setState({
            items: this.props.data
        })

    }
    render() {
        return React.createElement('svg', {
            className: 'ganttChartView',
            id: 'ganttChartView'
        },
            React.createElement('pattern', { // bacground grid
                id: "grid",
                width: svgGridWidth,
                height: "50",
                patternUnits: "userSpaceOnUse"
            }, React.createElement('rect', { // bacground grid's cells
                width: svgGridWidth,
                height: "20",
                fill: "url(#smallGrid)",
                stroke: "#aaaaaa",
                strokeWidth: "0.5"
            })
            ),
            React.createElement('rect', { // bacground grid's cells
                width: "100%",
                height: "100%",
                fill: "url(#grid)"
            }),
            this.state.items.map(function (ganttBar) { // creating multiple elements from data
                if (ganttBar.type === 'bar') {
                    return React.createElement(ganttChartBar, {
                        key: ganttBar.id,
                        data: ganttBar
                    })
                } else if (ganttBar.type === 'connection') {
                    return React.createElement(ganttChartConnection, {
                        ref: ganttBar.id,
                        key: ganttBar.id,
                        data: ganttBar
                    })
                }
            })
        )
    }
};
// gantt chart item
class ganttChartBar extends React.Component<any, any> {
    globalStorePoints: globalStore.globalStore

    constructor() {
        super()
        this.globalStorePoints = globalStoreClass;
        this.state = {
            width: svgGridWidth,
            marginLeft: 10,
            top: 10,
            fillWidth: 10,
            connectionsIds: [],
            connections: []
        }
    }

    componentDidMount() {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            top: this.props.data.style.top
        })
    }

    onDragRight(e) {
        let eventTarget = e.target;

        let startWidth = eventTarget.getBoundingClientRect().width;
        document.onmousemove = function (event) {
            let newWidth = event.pageX - eventTarget.getAttribute('x') - 140;
            let correctWidth = (Math.floor(Math.floor((newWidth + svgGridWidth)) / svgGridWidth)) * 100;

            if (eventTarget && correctWidth.toString() !== eventTarget.getAttribute('width') && correctWidth >= 100) {
                let animation = eventTarget.animate([{ width: this.state.width + 'px' }, { width: correctWidth + 'px' }], 100);
                animation.addEventListener('finish', function () {
                    eventTarget.setAttribute('width', correctWidth)
                    this.setState({ width: correctWidth })
                }.bind(this));
            }
        }.bind(this)
    }

    onDragLeft(e) {
        let eventTarget = e.target;
        document.onmousemove = function (event) {
            let newMargin = (event.pageX - 135)
            //let newWidth = this.state.width - (newMargin - this.state.marginLeft);

            //let correctWidth = (Math.floor(Math.floor((newWidth + svgGridWidth)) / svgGridWidth)) * 100;
            let correctMargin = (Math.floor(newMargin / svgGridWidth)) * 100;
            let newWidth = this.state.width + this.state.marginLeft - correctMargin;

            if (this.state.marginLeft !== correctMargin && eventTarget && eventTarget.tagName === 'rect' && newWidth >= 100) {
                this.setState({
                    marginLeft: correctMargin,
                    width: newWidth
                })
            }
        }.bind(this)
    }

    onDragFill(e) {
        if (e.pageX !== 0) {
            this.setState({
                fillDivWidth: e.pageX - this.state.marginLeft
            })
        }
    }

    addNewConnection(targetCoords) {
        this.globalStorePoints.endPointX = targetCoords.left;
        this.globalStorePoints.endPointY = targetCoords.top;

        let firstPoint = (this.globalStorePoints.startPointX - 130) + ',' + this.globalStorePoints.startPointY
        let secondPoint = this.globalStorePoints.startPointX + ',' + (this.globalStorePoints.startPointY - 20) + ''
        let thirdPoint = '' + targetCoords.left + ',' + (this.globalStorePoints.startPointY - 20) + ''
        let endPoint = "" + (targetCoords.left - 130) + ',' + targetCoords.top + '';

        this.globalStorePoints.isNewConnection = false;

        let currentItems = ganttChartViewComp.state.items;

        let topMargin = 50 * i
        let text = 'Task ' + i.toString()
        let leftMargin = 60 * i
        let barClass = 'group1'
        let newId = 'id' + (currentItems.length + 1);

        currentItems.push({
            id: newId,
            text: text,
            barClass: 'group1',
            firstP: this.globalStorePoints.connectionFirstPoint,
            endP: this,
            firstPoint: firstPoint,
            secondPoint: secondPoint,
            thirdPoint: thirdPoint,
            endPoint: endPoint,
            type: 'connection',
            style: {
                top: topMargin,
                marginLeft: leftMargin
            }
        });
        ganttChartViewComp.setState({ items: currentItems })

        let newConnections = this.globalStorePoints.connectionFirstPoint.state.connections
        newConnections.push(ganttChartViewComp.refs[newId])
        this.globalStorePoints.connectionFirstPoint.setState({
            connections: newConnections
        })
        let newConnections2 = this.state.connections

        newConnections2.push(ganttChartViewComp.refs[newId])
        this.setState({
            connections: newConnections2
        })
        document.onmousemove = null;
        this.globalStorePoints.connectionFirstPoint = null;
        document.getElementById('ganttChartView').removeChild(this.globalStorePoints.tempLine);
        this.globalStorePoints.tempLine = null;
    }

    handleElementDragDrop(event) {
        var eventTarget = event.target;
        this.globalStorePoints.currentDraggingElement = this
        let dropTarget = eventTarget;
        if (eventTarget.tagName === 'rect' || eventTarget.tagName === 'text') {
            dropTarget = dropTarget.parentNode;
        }
        if (dropTarget.tagName === 'g') {
            document.onmousemove = function (event) {
                let transform = dropTarget.parentNode.createSVGMatrix();
                dropTarget.transform.baseVal.getItem(0).setMatrix(
                    transform.translate(
                        event.clientX - eventTarget.parentNode.getAttribute('x') - 135,
                        event.clientY - eventTarget.parentNode.getAttribute('y'))
                );
            }
        }
    }

    handleRectDrop(event) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (this.globalStorePoints.currentDraggingElement) {
            let transform = event.target.parentNode.createSVGMatrix ? event.target.parentNode.createSVGMatrix() : event.target.parentNode.parentNode.createSVGMatrix();
            let currentDraggingElement = DOM.findDOMNode(this.globalStorePoints.currentDraggingElement) as any
            if (this.globalStorePoints.currentDropTarger && this.globalStorePoints.isCurrentlyDragging) {

                let moveToSateX = this.globalStorePoints.currentDropTarger.state.marginLeft;
                let moveToSateY = this.globalStorePoints.currentDropTarger.state.top;

                let exchToSateX = this.globalStorePoints.currentDraggingElement.state.marginLeft;
                let exchToSateY = this.globalStorePoints.currentDraggingElement.state.top;

                this.globalStorePoints.currentDraggingElement.setState({ marginLeft: moveToSateX })
                this.globalStorePoints.currentDraggingElement.setState({ top: moveToSateY })

                let currentDropTarget = DOM.findDOMNode(this.globalStorePoints.currentDropTarger) as any

                this.globalStorePoints.currentDropTarger.setState({ marginLeft: exchToSateX })
                this.globalStorePoints.currentDropTarger.setState({ top: exchToSateY })

                currentDropTarget.setAttribute('transform', 'translate(0, 0)')
            }
            currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
        }

        let connections = this.state.connections;
        let length = connections.length

        for (let i = 0; i < length; i++) {
            connections[i].update();
        }
        if (this.globalStorePoints.isCurrentlySizing) {


        }
        this.globalStorePoints.isCurrentlyDragging = false;
        this.globalStorePoints.isCurrentlySizing = false;
    }

    handleRectHover(event) {
        this.clearTempElements()
        var eventTarget = event.target;

        if (this.globalStorePoints.isCurrentlyDragging && eventTarget.classList[0] !== 'barDragging') {
            let currentDropTarget = DOM.findDOMNode(this) as any
            this.globalStorePoints.currentDropTarger = this;
            //currentDropTarget.animate([
            //    { transform: 'translate(0, 0)' },
            //    { transform: 'translate(30px, 30px)' }
            //], 100);

            //setTimeout(function () {
            //    if (currentDropTarget.getAttribute('transform') !== 'translate(0, 0)') {
            //        currentDropTarget.animate([
            //            { transform: 'translate(30px, 30px)' },
            //            { transform: 'translate(0, 0)' }
            //        ], 100);
            //    }
            //}, 1000)
        } else {
            if (!this.globalStorePoints.isCurrentlyDragging && !this.globalStorePoints.isCurrentlySizing && eventTarget.tagName === 'rect') {
                let leftCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
                let rightCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");

                var rect = event.target.getBoundingClientRect();
                leftCircle.setAttribute("id", "leftTempCircle");

                leftCircle.setAttribute('cy', (rect.top + 10).toString());
                leftCircle.setAttribute('strokeWidth', '1');
                leftCircle.setAttribute('cx', (rect.left - 155).toString());
                leftCircle.setAttribute('r', '8');
                leftCircle.setAttribute('fill', '#ffeeee');
                leftCircle.setAttribute('stroke', '#299cb4');

                rightCircle.setAttribute("id", "rightTempCircle");
                rightCircle.setAttribute('cy', (rect.top + 10).toString());
                rightCircle.setAttribute('strokeWidth', '1');
                rightCircle.setAttribute('cx', (rect.left + rect.width - 130).toString());
                rightCircle.setAttribute('r', '8');
                rightCircle.setAttribute('fill', '#ffeeee');
                rightCircle.setAttribute('stroke', '#299cb4');

                document.getElementById('ganttChartView').appendChild(rightCircle);

                document.getElementById('ganttChartView').appendChild(leftCircle);

                let self = this;

                leftCircle.addEventListener('mousedown', function (event) {
                    self.handleircleClick(event, this)
                })

                rightCircle.addEventListener('mousedown', function (event) {
                    self.handleircleClick(event, this)
                })

                leftCircle.addEventListener('mouseup', function (event) {
                    self.handleircleClick(event, this)
                })

                rightCircle.addEventListener('mouseup', function (event) {
                    self.handleircleClick(event, this)
                })
            }
        }
    }

    handleRectSizing(event) {
        let elementRect = event.target.getBoundingClientRect()
        let clickCoordX = event.clientX
        let clickCoordY = event.clientY
        this.clearTempElements()
        if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
            this.handleElementDragDrop(event);
            document.onmouseup = function (event) {
                this.handleRectDrop(event)
            }.bind(this)
            this.globalStorePoints.isCurrentlyDragging = true;
        } else if (clickCoordX > elementRect.right - 15) {
            this.onDragRight(event);
            document.onmouseup = function (event) {
                this.handleRectDrop(event)
            }.bind(this)
            this.globalStorePoints.isCurrentlySizing = true;
        } else if (clickCoordX < elementRect.left + 15) {
            this.onDragLeft(event);
            document.onmouseup = function (event) {
                this.handleRectDrop(event)
            }.bind(this)
            this.globalStorePoints.isCurrentlySizing = true;
        }
    }

    handleFillSizing(event) {
    }

    handleMouseOut(event) {
        let eventTarget = event.target
        if (eventTarget.tagName === 'rect' && eventTarget.classList[0] === 'barExchanging') {
            setTimeout(function () {
                if (eventTarget.classList[0] === 'barExchanging') {
                    eventTarget.setAttribute('class', 'barChartBody ' + eventTarget.classList[2])

                    let transformeMatrix = eventTarget.parentNode.createSVGMatrix();
                    transformeMatrix = transformeMatrix.translate(0, 0);
                    if (eventTarget.transform.baseVal.length === 0 && eventTarget.parentNode.createSVGMatrix) {
                        eventTarget.transform.baseVal.appendItem(eventTarget.parentNode.createSVGTransformFromMatrix(transformeMatrix))
                    } else {
                        eventTarget.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                    }
                }
            }.bind(this), 1000);
        }
        if (document.getElementById("leftTempCircle")) {
            //setTimeout(function () {
            // this.clearTempElements()
            //  }.bind(this), 1000);
        }
    }

    handleircleClick(e, parentElement) {
        let targetCoords = e.target.getBoundingClientRect();
        this.globalStorePoints.isLineDrawStarted = true;
        const eventTarget = e.target as any;
        if (!this.globalStorePoints.isNewConnection) {
            this.globalStorePoints.isNewConnection = true;

            this.globalStorePoints.startPointX = targetCoords.left
            this.globalStorePoints.startPointY = targetCoords.top

            let firstPoint = this.globalStorePoints.startPointX + ',' + this.globalStorePoints.startPointY

            let tempLine = document.createElementNS('http://www.w3.org/2000/svg', "line");

            var rect = eventTarget.getBoundingClientRect();
            tempLine.setAttribute("id", "tempLine");

            tempLine.setAttribute('x1', (eventTarget.getAttribute('cx')).toString());
            tempLine.setAttribute('strokeWidth', '1');
            tempLine.setAttribute('y1', (eventTarget.getAttribute('cy')).toString());
            tempLine.setAttribute('stroke', '#299cb4');

            document.onmousemove = function (event) {
                const eventTarget = event.target as any;
                tempLine.setAttribute('x2', (event.clientX - 135).toString());
                tempLine.setAttribute('y2', event.clientY.toString());
            }
            this.globalStorePoints.tempLine = tempLine
            document.getElementById('ganttChartView').appendChild(tempLine);
            if (!this.globalStorePoints.connectionFirstPoint) {
                this.globalStorePoints.connectionFirstPoint = this;
            }
            document.onmouseup = function (event) {
                this.clearTempLine()
            }.bind(this)
        } else {
            this.addNewConnection(targetCoords);

        }
    }

    clearTempElements() {
        if (document.getElementById("leftTempCircle")) {
            document.getElementById("ganttChartView").removeChild(document.getElementById("leftTempCircle"))
            document.getElementById("ganttChartView").removeChild(document.getElementById("rightTempCircle"))
        }
    }

    clearTempLine() {
        if (this.globalStorePoints.tempLine) {
            document.getElementById('ganttChartView').removeChild(this.globalStorePoints.tempLine);
            this.globalStorePoints.tempLine = null;
        }
    }

    render() {
        return React.createElement('g', { // group for svg elements
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.handleMouseOut.bind(this),
            onMouseDown: this.handleRectSizing.bind(this),
            transform: 'translate(0, 0)',
            y: this.state.top,
            x: this.state.marginLeft,
            width: this.state.width
        },
            React.createElement('rect', { // fill element
                className: 'barChartFillBody ',
                group: this.props.data.barClass,
                y: this.state.top,
                x: this.state.marginLeft,
                width: this.state.fillWidth
            }),
            React.createElement('rect', { // main element
                className: 'barChartBody ' + this.props.data.barClass,
                group: this.props.data.barClass,
                id: this.props.data.id,
                y: this.state.top,
                x: this.state.marginLeft,
                width: this.state.width
            })
            ,
            React.createElement('text', {// title element
                className: 'barTitle',
                x: this.state.marginLeft + this.state.width * 0.5,
                y: this.state.top + 15
            }, this.props.data.text)

            // ,
            //React.createElement('polygon', {// fill moving tool
            //    className: 'barChartFillTool',
            //    points: (this.props.data.style.marginLeft + this.state.fillWidth) + ',' + (this.props.data.style.top + 20) + ' ' +
            //    (this.props.data.style.marginLeft + this.state.fillWidth + 5) + ',' + (this.props.data.style.top + 30) + ' ' +
            //    (this.props.data.style.marginLeft + this.state.fillWidth - 5) + ',' + (this.props.data.style.top + 30)               
            //    //x: this.props.data.style.marginLeft + this.state.width * 0.5,
            //    //y: this.props.data.style.top + 15
            //}, this.props.data.text)
        )
    }
};
//gantt chart connections polyline
class ganttChartConnection extends React.Component<any, any> {
    globalStorePoints: globalStore.globalStore

    constructor() {
        super()
    }

    componentWillMount() {
        this.state = {
            firstPoint: this.props.data.firstPoint,
            firstP: this.props.data.firstP,
            endP: this.props.data.endP,
            //  secondPoint: '',
            //  thirdPoint: '',
            endPoint: this.props.data.endPoint,
        }
    }

    update(event) {
        let first = DOM.findDOMNode(this.state.firstP);
        let second = DOM.findDOMNode(this.state.endP);
        let firstCoords = first.getBoundingClientRect();
        let secondCoords = second.getBoundingClientRect();

        this.setState({
            firstPoint: (firstCoords.left - 30) + ' ' + (firstCoords.top + 10),
            //   secondPoint: this.props.secondPoint,
            //  thirdPoint: this.props.thirdPoint,
            endPoint: (secondCoords.left - 30) + ' ' + (secondCoords.top + 10)
        })
    }

    render() {
        return React.createElement('polyline', {
            points: this.state.firstPoint + ' ' /*+ this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' */ + this.state.endPoint,
            strokeWidth: "3",
            stroke: "#888888",
            strokeLinecap: "round",
            strokeDasharray: "10,10",
            strokeLinejoin: "round",
            fill: "none"
        })
    }
};

let ganttChartViewComp = DOM.render(React.createElement(ganttChartView, { data: ganttBars }), document.getElementById('gantChartView')) as any