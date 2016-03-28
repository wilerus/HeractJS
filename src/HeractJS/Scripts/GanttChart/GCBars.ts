import React = require('react')
import DOM = require('react-dom')

import {globalStore} from './GCStore';
import {ganttChartInfoPopup} from './GCAdditions';
import {ganttChartModalWindow} from './GCAdditions';
import {ganttChartTimeline}  from './GCTimeline';

export class ganttChartBar extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            width: globalStore.svgGridWidth,
            marginLeft: 10,
            top: 10,
            fillWidth: 10,
            connectionsIds: [],
            connections: []
        }
    }

    componentWillMount() {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            top: this.props.data.style.top,
            title: this.props.data.text,
            complition: this.props.data.complition,
            duration: (this.props.data.duration / globalStore.cellCapacity) * globalStore.svgGridWidth,
            gridWidth: globalStore.svgGridWidth
        })
    }

    changeСompleteDate(e) {
        let eventTarget = e.target;

        let startWidth = eventTarget.getBoundingClientRect().width;
        document.onmousemove = function (event) {
            let newWidth = event.pageX - eventTarget.getAttribute('x');
            let correctWidth = (Math.floor(Math.floor((newWidth)) / globalStore.svgGridWidth)) * globalStore.svgGridWidth;

            if (eventTarget && correctWidth.toString() !== eventTarget.getAttribute('width') && correctWidth >= globalStore.svgGridWidth) {
                //let animation = eventTarget.animate([{ width: this.state.width + 'px' }, { width: correctWidth + 'px' }], 100);
                // animation.addEventListener('finish', function () {
                eventTarget.setAttribute('width', correctWidth)

                correctWidth = (correctWidth / globalStore.cellCapacity) * globalStore.svgGridWidth

                this.setState({ duration: correctWidth })
                //  }.bind(this));
            }
        }.bind(this)
    }

    changeStartDate(e) {
        if (!document.onmousemove) {
            document.onmousemove = function (event) {
                let newMargin = event.pageX
                let correctMargin = (Math.floor(newMargin / globalStore.svgGridWidth)) * globalStore.svgGridWidth;
                let newWidth = this.state.duration + this.state.marginLeft - correctMargin;

                if (this.state.marginLeft !== correctMargin && newWidth >= globalStore.svgGridWidth) {
                    this.setState({
                        marginLeft: correctMargin,
                        duration: newWidth
                    })
                }
            }.bind(this)
        }
    }

    addNewConnection() {
        let targetElement = DOM.findDOMNode(globalStore.currentDropTarget) as any;
        let targetCoords = targetElement.getBoundingClientRect();
        globalStore.endPointX = targetCoords.left;
        globalStore.endPointY = targetCoords.top;

        let firstPoint = globalStore.startPointX + ',' + (globalStore.startPointY - 100)
        let secondPoint = globalStore.startPointX + ',' + (globalStore.startPointY - 20)
        let thirdPoint = targetCoords.left + ',' + (globalStore.startPointY - 20)
        let endPoint = targetCoords.left + ',' + (targetCoords.top - 100);

        globalStore.isNewConnection = false;

        let currentItems = globalStore.ganttChartView.state.ganttBars;

        let topMargin = 50 * 1
        let text = 'Task ' + 1
        let leftMargin = 60 * 1
        let barClass = 'group1'
        let newId = 'id' + (currentItems.length + 1);

        currentItems.push({
            id: newId,
            text: text,
            barClass: 'group1',
            firstP: globalStore.currentDraggingElement,
            endP: globalStore.currentDropTarget,
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
        globalStore.ganttChartView.setState({ ganttBars: currentItems })

        let newConnections = globalStore.connectionFirstPoint.state.connections
        newConnections.push(globalStore.ganttChartView.refs[newId])
        globalStore.connectionFirstPoint.setState({
            connections: newConnections
        })
        let newConnections2 = this.state.connections

        newConnections2.push(globalStore.ganttChartView.refs[newId])
        this.setState({
            connections: newConnections2
        })
        document.onmousemove = null;
        globalStore.connectionFirstPoint = null;
        document.getElementById('ganttChartView').removeChild(globalStore.tempLine);
        globalStore.tempLine = null;

        globalStore.isCurrentlyDragging = false;
        globalStore.isCurrentlySizing = false;
        globalStore.isDrawingConnection = false;
        globalStore.currentDropTarget = null;
        globalStore.currentDraggingElement = null;
    }

    barRelocation(event) {
        var eventTarget = event.target;
        globalStore.currentDraggingElement = this
        let dropTarget = eventTarget;
        if (eventTarget.tagName === 'rect') {
            dropTarget = dropTarget.parentNode;
        }

        var e = event.target;
        var dim = e.getBoundingClientRect();
        var startY = event.clientY;
        var startX = event.clientX;
        var x = startX - dim.left;
        var y = startY - dim.top;

        document.onmousemove = function (event) {
            let transform = dropTarget.parentNode.createSVGMatrix();
            if (Math.abs(event.clientX - startX) > 30 && !globalStore.isDrawingConnection) {
                dropTarget.transform.baseVal.getItem(0).setMatrix(
                    transform.translate(event.clientX - eventTarget.parentNode.getAttribute('x') - 8 - x, 0)
                )
                globalStore.isCurrentlyDragging = true;
            }
            if (Math.abs(event.clientY - startY) > 30 && !globalStore.isCurrentlyDragging) {
                globalStore.isDrawingConnection = true;
                globalStore.startPointX = eventTarget.getBoundingClientRect().left
                globalStore.startPointY = eventTarget.getBoundingClientRect().top
                let firstPoint = globalStore.startPointX + ',' + globalStore.startPointY

                let tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

                var rect = eventTarget.getBoundingClientRect();
                tempLine.setAttribute('id', 'tempLine');
                eventTarget.parentNode.setAttribute('transform', 'translate(0, 0)')

                tempLine.setAttribute('x1', (eventTarget.getAttribute('x')).toString());
                tempLine.setAttribute('strokeWidth', '1');
                tempLine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
                tempLine.setAttribute('stroke', '#299cb4');

                document.onmousemove = function (event) {
                    const eventTarget = event.target as any;
                    tempLine.setAttribute('x2', (event.clientX - 10).toString());
                    tempLine.setAttribute('y2', (event.clientY - 110).toString());
                }
                globalStore.tempLine = tempLine
                document.getElementById('ganttChartView').appendChild(tempLine);
                if (!globalStore.connectionFirstPoint) {
                    globalStore.connectionFirstPoint = this;
                }
                document.onmouseup = function (event) {
                    if (globalStore.isDrawingConnection) {
                        document.onmouseup = null;
                        this.addNewConnection();
                    }
                    this.clearTempLine()
                }.bind(this)
            }
        }.bind(this)
    }

    finishBarRelocation(event) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (globalStore.currentDraggingElement) {
            let transform = event.target.parentNode.createSVGMatrix ? event.target.parentNode.createSVGMatrix() : event.target.parentNode.parentNode.createSVGMatrix();
            let currentDraggingElement = DOM.findDOMNode(globalStore.currentDraggingElement) as any
            if (globalStore.currentDropTarget && globalStore.isCurrentlyDragging) {

                let moveToSateX = globalStore.currentDropTarget.state.marginLeft;
                let moveToSateY = globalStore.currentDropTarget.state.top;

                let exchToSateX = globalStore.currentDraggingElement.state.marginLeft;
                let exchToSateY = globalStore.currentDraggingElement.state.top;

                globalStore.currentDraggingElement.setState({ marginLeft: moveToSateX })
                globalStore.currentDraggingElement.setState({ top: moveToSateY })

                let currentDropTarget = DOM.findDOMNode(globalStore.currentDropTarget) as any

                globalStore.currentDropTarget.setState({ marginLeft: exchToSateX })
                globalStore.currentDropTarget.setState({ top: exchToSateY })

                currentDropTarget.setAttribute('transform', 'translate(0, 0)')
                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            } else {
                let currentMargin = globalStore.currentDraggingElement.state.marginLeft;
                let delta = currentDraggingElement.transform.baseVal[0].matrix.e;

                globalStore.currentDraggingElement.setState({ marginLeft: currentMargin + delta })

                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            }
        }

        let connections = this.state.connections;
        if (connections) {
            let length = connections.length

            for (let i = 0; i < length; i++) {
                connections[i].update();
            }
        }

        globalStore.isCurrentlyDragging = false;
        globalStore.isCurrentlySizing = false;
        globalStore.isDrawingConnection = false;
        globalStore.currentDropTarget = null;
        globalStore.currentDraggingElement = null;
    }

    handleRectHover(event) {
        this.clearTempElements()
        var eventTarget = event.target;

        if ((globalStore.isCurrentlyDragging || globalStore.isDrawingConnection) && this !== globalStore.currentDraggingElement) {
            let currentDropTarget = DOM.findDOMNode(this) as any
            globalStore.currentDropTarget = this;
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
            if (!globalStore.isCurrentlyDragging && !globalStore.isCurrentlySizing && eventTarget.classList[0] === 'barChartBody') {
                let leftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                let rightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

                let node = DOM.findDOMNode(this);

                var rect = event.target.getBoundingClientRect();
                leftCircle.setAttribute('id', 'leftTempCircle');

                leftCircle.setAttribute('cy', (parseInt(node.getAttribute('y')) + 10).toString());
                leftCircle.setAttribute('strokeWidth', '1');
                leftCircle.setAttribute('cx', (parseInt(node.getAttribute('x')) - 10).toString());
                leftCircle.setAttribute('r', '8');
                leftCircle.setAttribute('fill', '#ffeeee');
                leftCircle.setAttribute('stroke', '#299cb4');

                rightCircle.setAttribute('id', 'rightTempCircle');
                rightCircle.setAttribute('cy', (parseInt(node.getAttribute('y')) + 10).toString());
                rightCircle.setAttribute('strokeWidth', '1');
                rightCircle.setAttribute('cx', (parseInt(node.getAttribute('x')) + rect.width + 10).toString());
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

                let coords = eventTarget.getBoundingClientRect();

                let hoverElement = event.target;
                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !globalStore.isCurrentlyDragging) {
                        globalStore.ganttChartView.refs.infoPopup.setState({
                            left: parseInt(node.getAttribute('x')) - coords.width / 2,
                            top: parseInt(node.getAttribute('y')) - 55,
                            title: this.state.title,
                            startDate: 'Placeholder',
                            endDate: 'Placeholder',
                            duration: 'Placeholder'
                        })
                        globalStore.ganttChartView.refs.infoPopup.show();
                    }
                }.bind(this, hoverElement), 500);

                let elementRect = event.target.getBoundingClientRect()
                let clickCoordX = event.clientX
                let clickCoordY = event.clientY
                let el = DOM.findDOMNode(this) as any;
                this.clearTempElements()
                if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                    el.style.cursor = 'move';
                } else if (clickCoordX > elementRect.right - 15) {
                    el.style.cursor = 'e-resize';
                } else if (clickCoordX < elementRect.left + 15) {
                    el.style.cursor = 'e-resize';
                }
            }
        }
    }

    handleRectSizing(event) {
        if (event.button !== 2) {
            let eventTarget
            let isFillTouched: boolean = false
            if (event.target.getAttribute('class') === 'barChartFillBody') {
                eventTarget = event.target.parentElement;
                isFillTouched = true
            } else {
                eventTarget = event.target;
            }
            let elementRect = eventTarget.getBoundingClientRect()
            let clickCoordX = event.clientX
            let clickCoordY = event.clientY
            this.clearTempElements()
            if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.barRelocation(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event)
                }.bind(this)
            } else if (clickCoordX > elementRect.right - 15 && !isFillTouched) {
                this.changeСompleteDate(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event)
                }.bind(this)
                globalStore.isCurrentlySizing = true;
            } else if (clickCoordX < elementRect.left + 15) {
                this.changeStartDate(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event)
                }.bind(this)
                globalStore.isCurrentlySizing = true;
            }
        }
    }

    updateComplitionState(event) {
        document.onmousemove = function (event) {
            let newWidth = event.pageX - event.target.getAttribute('x');
            if (newWidth >= 0 && (this.state.duration / globalStore.cellCapacity) * globalStore.svgGridWidth >= ((this.state.duration / globalStore.cellCapacity) * globalStore.svgGridWidth) * newWidth / 100) {
                this.setState({
                    complition: newWidth
                })
            }
        }.bind(this)

        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    handleMouseOut(event) {
        let eventTarget = event.target
        if (event.relatedTarget.id === 'gridPattern') {
            if (eventTarget.classList[0] === 'barExchanging') {
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
            this.clearTempElements()
        }
        //if (document.getElementById('leftTempCircle')) {
        //setTimeout(function () {
        //  }.bind(this), 1000);
        //  }
    }

    handleircleClick(e, parentElement) {
        let targetCoords = e.target.getBoundingClientRect();
        globalStore.isLineDrawStarted = true;
        const eventTarget = e.target as any;
        if (!globalStore.isNewConnection) {
            globalStore.isNewConnection = true;

            globalStore.startPointX = targetCoords.left
            globalStore.startPointY = targetCoords.top

            let firstPoint = globalStore.startPointX + ',' + globalStore.startPointY

            let tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

            var rect = eventTarget.getBoundingClientRect();
            tempLine.setAttribute('id', 'tempLine');

            tempLine.setAttribute('x1', (eventTarget.getAttribute('cx')).toString());
            tempLine.setAttribute('strokeWidth', '1');
            tempLine.setAttribute('y1', (eventTarget.getAttribute('cy')).toString());
            tempLine.setAttribute('stroke', '#299cb4');

            document.onmousemove = function (event) {
                const eventTarget = event.target as any;
                tempLine.setAttribute('x2', (event.clientX - 135).toString());
                tempLine.setAttribute('y2', event.clientY.toString());
            }
            globalStore.tempLine = tempLine
            document.getElementById('ganttChartView').appendChild(tempLine);
            if (!globalStore.connectionFirstPoint) {
                globalStore.connectionFirstPoint = this;
            }
            document.onmouseup = function (event) {
                this.clearTempLine()
            }.bind(this)
        } else {
            // this.addNewConnection(targetCoords);
        }
    }

    clearTempElements() {
        if (document.getElementById('leftTempCircle')) {
            document.getElementById('ganttChartView').removeChild(document.getElementById('leftTempCircle'))
            document.getElementById('ganttChartView').removeChild(document.getElementById('rightTempCircle'))
        }
        globalStore.ganttChartView.refs.infoPopup.hide();
    }

    clearTempLine() {
        if (globalStore.tempLine) {
            document.getElementById('ganttChartView').removeChild(globalStore.tempLine);
            globalStore.tempLine = null;
        }
    }

    contextMenu(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }

    showModalWindow() {
        globalStore.ganttChartView.refs.modalWindow.show();
    }

    render() {
        return React.createElement('g', { // group for svg elements
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.handleMouseOut.bind(this),
            onMouseDown: this.handleRectSizing.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            y: this.state.top,
            x: this.state.marginLeft,
            transform: 'translate(0, 0)'
        },
            React.createElement('rect', { // main element
                className: 'barChartBody ',
                group: this.props.data.barClass,
                id: this.props.data.id,
                y: this.state.top,
                x: this.state.marginLeft,
                width: this.state.duration
            }),
            React.createElement('rect', { // fill element
                onMouseDown: this.updateComplitionState.bind(this),
                className: 'barChartFillBody',
                group: this.props.data.barClass,
                y: this.state.top,
                x: this.state.marginLeft,
                width: ((this.state.duration / globalStore.cellCapacity) * globalStore.svgGridWidth) * this.state.complition / 100
            }),
            React.createElement('text', {// title element
                className: 'barTitle',
                x: this.state.marginLeft + this.state.width * 0.5,
                y: this.state.top + 15
            }, this.state.title)
        )
    }
};

export class ganttChartConnection extends React.Component<any, any> {
    buildConnection() {
        let firstPoint = DOM.findDOMNode(this.props.data.firstP) as any;
        let firstPointCoordsX = parseInt(firstPoint.getAttribute('x'))
        let firstPointCoordsY = parseInt(firstPoint.getAttribute('y'))
        let firstPointCoordsWidth = firstPoint.getBoundingClientRect().width

        let secondPoint = DOM.findDOMNode(this.props.data.endP) as any;
        let secondPointCoordsX = parseInt(secondPoint.getAttribute('x'))
        let secondPointCoordsY = parseInt(secondPoint.getAttribute('y'))
        let secondPointCoordsWidth = secondPoint.getBoundingClientRect().width

        if (firstPointCoordsX < secondPointCoordsX - 10) {
            this.state = {
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + secondPointCoordsY,
                endPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + secondPointCoordsY
            }

        } else if (firstPointCoordsX - 10 > secondPointCoordsX) {
            this.state = {
                firstPoint: (firstPointCoordsX) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (secondPointCoordsY + 20),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (secondPointCoordsY + 20)
            }
        } else {
            this.state = {
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            }
        }
    }

    componentWillMount() {
        this.buildConnection()
    }

    update(event) {
        this.buildConnection()
    }

    render() {
        return React.createElement('polyline', {
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' + this.state.endPoint,
            strokeWidth: 2,
            stroke: '#888888',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: 'url(#triangle)',
            fill: 'none'
        })
    }
};
