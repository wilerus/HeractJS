import React = require('react')
import DOM = require('react-dom')

import {GanttChartMediator} from './GlobalStore';

let GCMediator = GanttChartMediator.getInstance();

export class TaskBar extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            id: 'Task',
            order: 1,
            collapsed: false,
            position: 1,

            name: 'Task',
            description: 'Desc',
            assignee: '',
            parent: '',
            predecessors: '',

            progress: 20,
            duration: '',
            finish: '',
            priority: '',

            width: 50,
            startDate: 10,
            top: 10,
            fillWidth: 10,
            connectionsIds: [],
            connections: []
        }
    }

    private componentWillMount() {
        this.setState({
            id: this.props.data.id,
            order: this.props.data.order,
            collapsed: this.props.data.collapsed,
            position: this.props.data.position,

            name: this.props.data.name,
            description: this.props.data.description,
            assignee: this.props.data.assignee,
            parent: this.props.data.parent,
            predecessors: this.props.data.startDate,

            progress: this.props.data.progress,
            duration: this.props.data.duration,
            startDate: this.props.data.startDate,
            finish: this.props.data.finish,
            priority: this.props.data.priority
        })
    }

    private shouldComponentUpdate(nextState) {
        return this.state !== nextState ? true : false
    }

    private startBarRelocation(event) {
        var eventTarget = event.target;
        GCMediator.dispatch({
            type: 'setDraggingTask',
            draggingTask: this
        })
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
            let currentState = GCMediator.getState();
            if (Math.abs(event.clientX - startX) > 30 && !currentState.isDrawingConnection) {
                dropTarget.transform.baseVal.getItem(0).setMatrix(
                    transform.translate(event.clientX - eventTarget.parentNode.getAttribute('x') - 8 - x, 0)
                )
                GCMediator.dispatch({ type: 'dragStart' })
            }
            if (Math.abs(event.clientY - startY) > 30 && !currentState.isDragging) {
                GCMediator.dispatch({ type: 'stactLinking' })

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
                GCMediator.dispatch({
                    type: 'setTimpline',
                    tempLine: tempLine
                })
                document.getElementById('ganttChartView').appendChild(tempLine);

                document.onmouseup = function () {
                    if (GCMediator.getState().isLinking) {
                        document.onmouseup = null;
                        this.addNewConnection();
                    }
                    this.clearTempElements()
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
                GCMediator.dispatch({ type: 'startSizing' })
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate(event);
                document.onmouseup = function (event) {
                    this.completeBarRelocation(event)
                }.bind(this)
                GCMediator.dispatch({ type: 'startSizing' })
            }
        }
    }

    private updateСompleteDate(event) {
        let startX = event.target.getAttribute('x')
        document.onmousemove = function (event) {
            let currentState = GCMediator.getState();
            let newDuration = (event.pageX - startX - 15) / currentState.cellCapacity;

            if (newDuration) {
                let newCompletion = this.state.progress / currentState.cellCapacity;
                if (newCompletion > newDuration || newCompletion === this.state.duration) {
                    newCompletion = newDuration
                    this.setState({
                        progress: newCompletion
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
            let currentState = GCMediator.getState();
            document.onmousemove = function (event) {
                let newStartDate = event.pageX
                let newDuration = (this.state.startDate - newStartDate) / currentState.cellCapacity + this.state.duration

                if (this.state.startDate !== newStartDate && newDuration) {
                    let newCompletion = this.state.progress;
                    if (newCompletion > newDuration || newCompletion === this.state.duration) {
                        newCompletion = newDuration
                    }
                    this.setState({
                        startDate: newStartDate,
                        duration: newDuration,
                        progress: newCompletion
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

                newComplition = newComplition / GCMediator.getState().cellCapacity;
                if (newComplition <= 0) {
                    newComplition = 0
                } else if (this.state.duration < newComplition) {
                    newComplition = this.state.duration
                }
                this.setState({
                    progress: newComplition
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
        let currentState = GCMediator.getState();
        let currentItems = currentState.ganttChartView.state.ganttBars
        let newId = 'connection ' + (currentItems.length + 1)

        currentItems.push({
            id: newId,
            firstP: currentState.currentDraggingElement,
            endP: currentState.currentDropTarget,
            type: 'connection'
        });
        currentState.ganttChartView.setState({ ganttBars: currentItems })

        let newConnections = currentState.currentDraggingElement.state.connections
        newConnections.push(currentState.ganttChartView.refs[newId])
        currentState.currentDraggingElement.setState({
            connections: newConnections
        })

        let newConnections2 = currentState.currentDropTarget.state.connections
        newConnections2.push(currentState.ganttChartView.refs[newId])
        this.setState({
            connections: newConnections2
        })

        document.onmousemove = null;
        document.getElementById('ganttChartView').removeChild(currentState.tempLine);
        currentState.dispatch({type: 'removeTempline'})

        let el = DOM.findDOMNode(currentState.currentDraggingElement).getElementsByClassName('barChartBody barOver');
        if (el.length) {
            el[0].setAttribute('class', 'barChartBody')
        }
        el = DOM.findDOMNode(currentState.currentDropTarget).getElementsByClassName('barChartBody barOver');
        if (el.length) {
            el[0].setAttribute('class', 'barChartBody')
        }
        GCMediator.dispatch({ type: 'stopDragging' })
        GCMediator.dispatch({ type: 'stopSizing' })
        GCMediator.dispatch({ type: 'stopLinking' })
        GCMediator.dispatch({ type: 'removeDropTarget' })
        GCMediator.dispatch({ type: 'removeDraggingElement' })
    }

    private handleRectHover(event) {
        let currentState = GCMediator.getState()
        this.clearTempElements()
        var eventTarget = event.target;

        if ((!currentState.isDragging || !currentState.isLinking) && this !== currentState.draggingTask) {
            currentState.currentDropTarget = this;
            if (eventTarget.getAttribute('class') === 'barChartBody') {
                eventTarget.setAttribute('class', 'barChartBody barOver')
            }
        } else {
            if (!GCMediator.getState().isCurrentlyDragging && !GCMediator.getState().isCurrentlySizing && eventTarget.classList[0] === 'barChartBody') {
                let coords = eventTarget.getBoundingClientRect();
                let hoverElement = event.target;

                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !GCMediator.getState().isCurrentlyDragging) {
                        GCMediator.getState().ganttChartView.refs.infoPopup.setState({
                            left: parseInt(hoverElement.getAttribute('x')) + coords.width / 2 - 84,
                            top: parseInt(hoverElement.getAttribute('y')) - 55,
                            title: this.state.title,
                            startDate: this.state.startDate,
                            endDate: this.state.startDate + this.state.duration,
                            duration: this.state.duration,
                            description: this.state.description
                        })
                        GCMediator.getState().ganttChartView.refs.infoPopup.show();
                    }
                }.bind(this, hoverElement), 500);
                let el = DOM.findDOMNode(this) as any;
                this.clearTempElements()
                let elementRect = event.target.getBoundingClientRect()

                document.onmousemove = function (event) {
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
        let currentState = GCMediator.getState();
        if (currentState.currentDraggingElement) {
            let currentDraggingElement = DOM.findDOMNode(currentState.currentDraggingElement) as any
            if (currentState.currentDropTarget && currentState.isCurrentlyDragging) {

                let moveToSateX = currentState.currentDropTarget.state.startDate;
                let moveToSateY = currentState.currentDropTarget.state.top;

                let exchToSateX = currentState.currentDraggingElement.state.startDate;
                let exchToSateY = currentState.currentDraggingElement.state.top;

                currentState.currentDraggingElement.setState({ startDate: moveToSateX })
                currentState.currentDraggingElement.setState({ top: moveToSateY })

                let currentDropTarget = DOM.findDOMNode(currentState.currentDropTarget) as any

                currentState.currentDropTarget.setState({ startDate: exchToSateX })
                currentState.currentDropTarget.setState({ top: exchToSateY })

                currentDropTarget.setAttribute('transform', 'translate(0, 0)')
                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            } else {
                let currentMargin = currentState.currentDraggingElement.state.startDate;
                let delta = currentDraggingElement.transform.baseVal[0].matrix.e;

                currentState.currentDraggingElement.setState({ startDate: currentMargin + delta })

                currentDraggingElement.setAttribute('transform', 'translate(0, 0)')
            }
        }
        if (currentState.currentDraggingElement) {
            let connectionsDropTarget = currentState.currentDraggingElement.state.connections;
            if (connectionsDropTarget) {
                let length = connectionsDropTarget.length

                for (let i = 0; i < length; i++) {
                    connectionsDropTarget[i].buildConnection();
                }
            }
        }

        if (currentState.currentDropTarget) {
            let connectionsDraggingElement = currentState.currentDropTarget.state.connections;
            if (connectionsDraggingElement) {
                let length = connectionsDraggingElement.length

                for (let i = 0; i < length; i++) {
                    connectionsDraggingElement[i].buildConnection();
                }
            }
        }

        currentState.isCurrentlyDragging = false;
        currentState.isCurrentlySizing = false;
        currentState.isDrawingConnection = false;
        currentState.currentDropTarget = null;
        currentState.currentDraggingElement = null;

        if (event.target.getAttribute('class') === 'barChartBody barOver') {
            event.target.setAttribute('class', 'barChartBody');
        }
    }

    private completeBarUpdate(event) {
        let eventTarget = event.target
        let currentState = GCMediator.getState()
        if (eventTarget.getAttribute('class') === 'barChartBody barOver' && !currentState.isCurrentlyDragging) {
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
        GCMediator.getState().ganttChartView.refs.infoPopup.hide();
        if (!GCMediator.getState().isDragging && !GCMediator.getState().isSizing && GCMediator.getState().templine) {
            document.getElementById('ganttChartView').removeChild(GCMediator.getState().templine);
            GCMediator.dispatch({ type: 'removeTempline' })
        }
    }

    private contextMenu(event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }

    private showModalWindow() {
        let currentState = GCMediator.getState()

        currentState.ganttChartView.refs.infoPopup.hide();
        let modalWindow = currentState.ganttChartView.refs.modalWindow;
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
                y: this.state.position,
                x: this.state.startDate,
                width: this.state.duration * GCMediator.getState().cellCapacity
            }),
            React.createElement('rect', { // progress element
                className: 'barChartFillBody',
                group: this.props.data.barClass,
                y: this.state.position,
                x: this.state.startDate,
                width: this.state.progress * GCMediator.getState().cellCapacity,
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: this.state.startDate + this.state.duration * GCMediator.getState().cellCapacity * 0.5,
                y: this.state.position + 15
            }, this.state.name)
        )
    }
};
