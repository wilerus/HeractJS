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
            width: 50,
            startDate: 10,
            top: 10,
            fillWidth: 10,
            connectionsIds: [],
            connections: []
        }
    }

    componentWillMount() {
        this.setState({
            startDate: this.props.data.startDate,
            top: this.props.data.style.top,
            title: this.props.data.text,
            complition: this.props.data.complition,
            duration: this.props.data.duration,
            description: this.props.data.description
        })
    }

    private shouldComponentUpdate(nextState) {
        return this.state !== nextState ? true : false
    }

    private startBarRelocation(event) {
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

        if (eventTarget.getAttribute('class') === 'barChartBody') {
            eventTarget.setAttribute('class', 'barChartBody barOver')
        }
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

                let tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

                tempLine.setAttribute('id', 'tempLine');
                eventTarget.parentNode.setAttribute('transform', 'translate(0, 0)')

                tempLine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + eventTarget.getAttribute('width') / 2).toString());
                tempLine.setAttribute('strokeWidth', '2');
                tempLine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
                tempLine.setAttribute('stroke', 'rgb(80,80,220)');

                if (eventTarget.getAttribute('class') === 'barChartBody') {
                    eventTarget.setAttribute('class', 'barChartBody barOver')
                }

                document.onmousemove = function (event) {
                    tempLine.setAttribute('x2', (event.clientX - 10).toString());
                    tempLine.setAttribute('y2', (event.clientY - 110).toString());
                }
                globalStore.tempLine = tempLine
                document.getElementById('ganttChartView').appendChild(tempLine);

                document.onmouseup = function () {
                    if (globalStore.isDrawingConnection) {
                        document.onmouseup = null;
                        this.addNewConnection();
                    }
                    this.clearTempLine()
                }.bind(this)
            }
        }.bind(this)
    }

    private startBarUpdate(event) {
        document.onmousemove = null;
        if (event.button !== 2) {
            let eventTarget = event.target
            let parentElement
            let parentCoords
            if (eventTarget.getAttribute('class') === 'barChartFillBody') {
                parentElement = eventTarget
                eventTarget = eventTarget.parentNode
                parentCoords = parentElement.getBoundingClientRect()
            }

            let elementRect = eventTarget.getBoundingClientRect()
            let clickCoordX = event.clientX
            this.clearTempElements()

            if (parentElement && clickCoordX > parentCoords.right - 15) {
                this.updateComplitionState(event);
            } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.startBarRelocation(event);
                document.onmouseup = function (event) {
                    this.completeBarRelocation(event)
                }.bind(this)
            } else if (clickCoordX > elementRect.right - 15) {
                this.updateСompleteDate(event);
                document.onmouseup = function (event) {
                    this.completeBarRelocation(event)
                }.bind(this)
                globalStore.isCurrentlySizing = true;
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate(event);
                document.onmouseup = function (event) {
                    this.completeBarRelocation(event)
                }.bind(this)
                globalStore.isCurrentlySizing = true;
            }
        }
    }

    private updateСompleteDate(event) {
        let startX = event.target.getAttribute('x')
        document.onmousemove = function (event) {
            let newDuration = (event.pageX - startX - 15) / globalStore.cellCapacity;

            if (newDuration) {
                let newCompletion = this.state.complition / globalStore.cellCapacity;
                if (newCompletion > newDuration || newCompletion === this.state.duration) {
                    newCompletion = newDuration
                    this.setState({
                        complition: newCompletion
                    })
                }
                this.setState({
                    duration: newDuration
                })
            }
        }.bind(this)
    }

    private updateStartDate(e) {
        if (!document.onmousemove) {
            document.onmousemove = function (event) {
                let newStartDate = event.pageX
                let newDuration = (this.state.startDate - newStartDate) / globalStore.cellCapacity + this.state.duration

                if (this.state.startDate !== newStartDate && newDuration) {
                        let newCompletion = this.state.complition;
                        if (newCompletion > newDuration || newCompletion === this.state.duration) {
                            newCompletion = newDuration
                        } 
                    this.setState({
                        startDate: newStartDate,
                        duration: newDuration,
                        complition: newCompletion
                    })
                }
            }.bind(this)
        }
    }

    private updateComplitionState(event) {
        let eventTarget = event.target
        let elementRect = eventTarget.getBoundingClientRect()
        let clickCoordX = event.clientX

        this.clearTempElements()
        if (clickCoordX > elementRect.right - 15) {
            document.onmousemove = function (event) {
                let newComplition = event.pageX - event.target.getAttribute('x');

                newComplition = newComplition / globalStore.cellCapacity;
                if (newComplition <= 0) {
                    newComplition = 0
                } else if (this.state.duration < newComplition) {
                    newComplition = this.state.duration
                }
                this.setState({
                    complition: newComplition
                })
            }.bind(this)

            document.onmouseup = function (event) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            document.onmouseup = function (event) {
                this.completeBarRelocation(event)
            }.bind(this)
        }
    }

    private addNewConnection() {
        let currentItems = globalStore.ganttChartView.state.ganttBars
        let newId = 'connection ' + (currentItems.length + 1)

        currentItems.push({
            id: newId,
            firstP: globalStore.currentDraggingElement,
            endP: globalStore.currentDropTarget,
            type: 'connection'
        });
        globalStore.ganttChartView.setState({ ganttBars: currentItems })

        let newConnections = globalStore.currentDraggingElement.state.connections
        newConnections.push(globalStore.ganttChartView.refs[newId])
        globalStore.currentDraggingElement.setState({
            connections: newConnections
        })

        let newConnections2 = globalStore.currentDropTarget.state.connections
        newConnections2.push(globalStore.ganttChartView.refs[newId])
        this.setState({
            connections: newConnections2
        })

        document.onmousemove = null;
        document.getElementById('ganttChartView').removeChild(globalStore.tempLine);
        globalStore.tempLine = null;

        let el = DOM.findDOMNode(globalStore.currentDraggingElement).getElementsByClassName('barChartBody barOver');
        if (el.length ) {
            el[0].setAttribute('class', 'barChartBody')
        }
        el = DOM.findDOMNode(globalStore.currentDropTarget).getElementsByClassName('barChartBody barOver');
        if (el.length) {
            el[0].setAttribute('class', 'barChartBody')
        }
        globalStore.isCurrentlyDragging = false;
        globalStore.isCurrentlySizing = false;
        globalStore.isDrawingConnection = false;
        globalStore.currentDropTarget = null;
        globalStore.currentDraggingElement = null;
    }

    private handleRectHover(event) {
        this.clearTempElements()
        var eventTarget = event.target;

        if ((globalStore.isCurrentlyDragging || globalStore.isDrawingConnection) && this !== globalStore.currentDraggingElement) {
            globalStore.currentDropTarget = this;
            if (eventTarget.getAttribute('class') === 'barChartBody') {
                eventTarget.setAttribute('class', 'barChartBody barOver')
            }
        } else {
            if (!globalStore.isCurrentlyDragging && !globalStore.isCurrentlySizing && eventTarget.classList[0] === 'barChartBody') {
                let coords = eventTarget.getBoundingClientRect();
                let hoverElement = event.target;

                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !globalStore.isCurrentlyDragging) {
                        globalStore.ganttChartView.refs.infoPopup.setState({
                            left: parseInt(hoverElement.getAttribute('x')) + coords.width / 2 - 84,
                            top: parseInt(hoverElement.getAttribute('y')) - 55,
                            title: this.state.title,
                            startDate: this.state.startDate,
                            endDate: this.state.startDate + this.state.duration,
                            duration: this.state.duration,
                            description: this.state.description 
                        })
                        globalStore.ganttChartView.refs.infoPopup.show();
                    }
                }.bind(this, hoverElement), 500);
                let el = DOM.findDOMNode(this) as any;
                this.clearTempElements()
                let elementRect = event.target.getBoundingClientRect()

                document.onmousemove = function (event)  {
                    let clickCoordX = event.clientX
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
    }

    private completeBarRelocation(event) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (globalStore.currentDraggingElement) {
            let currentDraggingElement = DOM.findDOMNode(globalStore.currentDraggingElement) as any
            if (globalStore.currentDropTarget && globalStore.isCurrentlyDragging) {

                let moveToSateX = globalStore.currentDropTarget.state.startDate;
                let moveToSateY = globalStore.currentDropTarget.state.top;

                let exchToSateX = globalStore.currentDraggingElement.state.startDate;
                let exchToSateY = globalStore.currentDraggingElement.state.top;

                globalStore.currentDraggingElement.setState({ startDate: moveToSateX })
                globalStore.currentDraggingElement.setState({ top: moveToSateY })

                let currentDropTarget = DOM.findDOMNode(globalStore.currentDropTarget) as any

                globalStore.currentDropTarget.setState({ startDate: exchToSateX })
                globalStore.currentDropTarget.setState({ top: exchToSateY })

                currentDropTarget.setAttribute('transform', 'translate(0, 0)')
                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            } else {
                let currentMargin = globalStore.currentDraggingElement.state.startDate;
                let delta = currentDraggingElement.transform.baseVal[0].matrix.e;

                globalStore.currentDraggingElement.setState({ startDate: currentMargin + delta })

                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            }
        }
        if (globalStore.currentDraggingElement) {
            let connectionsDropTarget = globalStore.currentDraggingElement.state.connections;
            if (connectionsDropTarget) {
                let length = connectionsDropTarget.length

                for (let i = 0; i < length; i++) {
                    connectionsDropTarget[i].update();
                }
            }
        }

        if (globalStore.currentDropTarget) {
            let connectionsDraggingElement = globalStore.currentDropTarget.state.connections;
            if (connectionsDraggingElement) {
                let length = connectionsDraggingElement.length

                for (let i = 0; i < length; i++) {
                    connectionsDraggingElement[i].update();
                }
            }
        }

        globalStore.isCurrentlyDragging = false;
        globalStore.isCurrentlySizing = false;
        globalStore.isDrawingConnection = false;
        globalStore.currentDropTarget = null;
        globalStore.currentDraggingElement = null;

        if (event.target.getAttribute('class') === 'barChartBody barOver') {
            event.target.setAttribute('class', 'barChartBody');
        }
    }

    private completeBarUpdate(event) {
        let eventTarget = event.target
        if (eventTarget.getAttribute('class') === 'barChartBody barOver' && !globalStore.isCurrentlyDragging) {
            eventTarget.setAttribute('class', 'barChartBody');
        }
        if (event.relatedTarget.id === 'gridPattern') {
            if (eventTarget.classList[0] === 'barExchanging') {
                setTimeout(function () {
                    if (eventTarget.classList[0] === 'barExchanging') {
                        eventTarget.setAttribute('class', 'barChartBody{}' + eventTarget.classList[2])

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
    }

    private clearTempElements() {
        if (document.getElementById('leftTempCircle')) {
            document.getElementById('ganttChartView').removeChild(document.getElementById('leftTempCircle'))
            document.getElementById('ganttChartView').removeChild(document.getElementById('rightTempCircle'))
        }
        globalStore.ganttChartView.refs.infoPopup.hide();
    }

    private clearTempLine() {
        if (globalStore.tempLine) {
            document.getElementById('ganttChartView').removeChild(globalStore.tempLine);
            globalStore.tempLine = null;
        }
    }

    private contextMenu(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }

    private showModalWindow() {
        globalStore.ganttChartView.refs.infoPopup.hide();
        let modalWindow = globalStore.ganttChartView.refs.modalWindow;
        modalWindow.show();

        modalWindow.setState({
            title: this.state.title,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration
        })
    }

    render() {
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.completeBarUpdate.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            y: this.state.top,
            x: this.state.startDate,
            transform: 'translate(0, 0)'
        },
            React.createElement('rect', { // main element
                className: 'barChartBody',
                group: this.props.data.barClass,
                id: this.props.data.id,
                y: this.state.top,
                x: this.state.startDate,
                width: this.state.duration * globalStore.cellCapacity
            }),
            React.createElement('rect', { // complition element
                className: 'barChartFillBody',
                group: this.props.data.barClass,
                y: this.state.top,
                x: this.state.startDate,
                width: this.state.complition * globalStore.cellCapacity,
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: this.state.startDate + this.state.duration * globalStore.cellCapacity * 0.5,
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
            this.setState ({
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30 ) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30 ) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            })
        } else if (firstPointCoordsX - 10 > secondPointCoordsX) {
            this.setState({
                firstPoint: (firstPointCoordsX) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX - 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX - 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX) + ' , ' + (secondPointCoordsY + 10)
            })
        } else {
            this.setState({
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            })
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
            stroke: 'rgb(80,80,220)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: 'url(#triangle)',
            fill: 'none'
        })
    }
};
