import React = require('react')
import DOM = require('react-dom')

import {AppMediator} from '../../scripts/services/AppMediator'

let GCMediator: any = AppMediator.getInstance()

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

    private shouldComponentUpdate(nextState: any) {
        return this.state !== nextState ? true : false
    }

    private startTaskSelection(event: MouseEvent) {
        GCMediator.dispatch({ type: 'deselectAllTasks' })

        GCMediator.dispatch({
            type: 'selectTask',
            data: this.state.id
        })
    }

    private startBarRelocation(event: MouseEvent) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        })
        var eventTarget: any = event.target
        let dropTarget = eventTarget
        if (eventTarget.tagName === 'rect') {
            dropTarget = dropTarget.parentNode
        }

        var e: any = event.target
        var dim = e.getBoundingClientRect()
        var startY = event.clientY
        var startX = event.clientX
        var x = startX - dim.left

        if (eventTarget.getAttribute('class') === 'barChartBody') {
            eventTarget.setAttribute('class', 'barChartBody barOver')
        }
        document.onmousemove = function (event: MouseEvent) {
            let transform = dropTarget.parentNode.createSVGMatrix()
            let currentState = GCMediator.getState()
            if (Math.abs(event.clientX - startX) > 30 && !currentState.isDrawingConnection) {
                dropTarget.transform.baseVal.getItem(0).setMatrix(
                    transform.translate(event.clientX - eventTarget.parentNode.getAttribute('x') - 8 - x, 0)
                )
                GCMediator.dispatch({ type: 'dragStart' })
            }
            if (Math.abs(event.clientY - startY) > 30 && !currentState.isDragging) {
                GCMediator.dispatch({ type: 'startLinking' })

                let templine = document.createElementNS('http://www.w3.org/2000/svg', 'line')

                templine.setAttribute('id', 'templine')
                eventTarget.parentNode.setAttribute('transform', 'translate(0, 0)')

                templine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + eventTarget.getAttribute('width') / 2).toString())
                templine.setAttribute('strokeWidth', '2')
                templine.setAttribute('y1', (eventTarget.getAttribute('y')).toString())
                templine.setAttribute('stroke', 'rgb(80,80,220)')

                if (eventTarget.getAttribute('class') === 'barChartBody') {
                    eventTarget.setAttribute('class', 'barChartBody barOver')
                }

                const parentNode: any = DOM.findDOMNode(this).parentNode
                const leftMargin = parentNode.getBoundingClientRect().left
                document.onmousemove = (event: MouseEvent) => {
                    templine.setAttribute('x2', (event.clientX - leftMargin).toString())
                    templine.setAttribute('y2', (event.clientY - 100).toString())
                }
                GCMediator.dispatch({
                    type: 'setTempline',
                    data: templine
                })
                document.getElementById('ganttChartView').appendChild(templine)

                document.onmouseup = function () {
                    if (GCMediator.getState().isLinking) {
                        document.onmouseup = null
                        this.addNewConnection()
                    }
                    this.clearTempElements()
                }.bind(this)
            }
        }.bind(this)
    }

    private startBarUpdate(event: MouseEvent) {
        document.onmousemove = null
        if (event.button !== 2) {
            let eventTarget: any = event.target
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
                this.updateComplitionState(event)
            } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.startBarRelocation(event)
                document.onmouseup = function (event: MouseEvent) {
                    this.completeBarRelocation(event)
                }.bind(this)
            } else if (clickCoordX > elementRect.right - 15) {
                this.updateСompleteDate(event)
                document.onmouseup = function (event: MouseEvent) {
                    this.completeBarRelocation(event)
                }.bind(this)
                GCMediator.dispatch({ type: 'startSizing' })
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate(event)
                document.onmouseup = function (event: MouseEvent) {
                    this.completeBarRelocation(event)
                }.bind(this)
                GCMediator.dispatch({ type: 'startSizing' })
            }
        }
    }

    private updateСompleteDate(event: MouseEvent) {
        let eventTarger: any = event.target
        let startX = eventTarger.getAttribute('x')
        document.onmousemove = function (event) {
            let currentState = GCMediator.getState()
            const parentNode: any = DOM.findDOMNode(this).parentNode
            const leftMargin = parentNode.getBoundingClientRect().left
            let newDuration = (event.pageX - startX - leftMargin) / currentState.cellCapacity

            if (newDuration) {
                let newCompletion = this.state.progress / currentState.cellCapacity
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
            let currentState = GCMediator.getState()
            document.onmousemove = function (event) {
                const parentNode: any = DOM.findDOMNode(this).parentNode
                const leftMargin = parentNode.getBoundingClientRect().left
                let newStartDate = event.pageX - leftMargin
                let newDuration = (this.state.startDate - newStartDate) / currentState.cellCapacity + this.state.duration

                if (this.state.startDate !== newStartDate && newDuration) {
                    let newCompletion = this.state.progress
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

    private updateComplitionState(event: MouseEvent) {
        let eventTarget: any = event.target
        let elementRect = eventTarget.getBoundingClientRect()
        let clickCoordX = event.clientX

        this.clearTempElements()
        if (clickCoordX > elementRect.right - 15) {
            document.onmousemove = function (event) {
                const parentNode: any = DOM.findDOMNode(this).parentNode
                const leftMargin = parentNode.getBoundingClientRect().left

                let newComplition = event.pageX - event.target.getAttribute('x') - leftMargin

                newComplition = newComplition / GCMediator.getState().cellCapacity
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
                document.onmousemove = null
                document.onmouseup = null
            }
            document.onmouseup = function (event) {
                this.completeBarRelocation(event)
            }.bind(this)
        }
    }

    private addNewConnection() {
        const currentState = GCMediator.getState()
        const currentItems = currentState.items
        const newId = 'connection ' + (currentItems.length + 1)

        //currentItems.push()
        GCMediator.dispatch({
            type: 'create',
            item: {
                id: newId,
                firstP: currentState.draggingElement,
                endP: currentState.dropTarget,
                type: 'connection'
            }
        })
        //currentState.ganttChartView.setState({ ganttBars: currentItems })

        const newConnections = currentState.draggingElement.state.connections
        newConnections.push(currentState.ganttChartView.refs[newId])
        currentState.draggingElement.setState({
            connections: newConnections
        })

        const newConnections2 = currentState.dropTarget.state.connections
        newConnections2.push(currentState.ganttChartView.refs[newId])
        this.setState({
            connections: newConnections2
        })

        document.onmousemove = null
        document.getElementById('ganttChartView').removeChild(currentState.templine)
        GCMediator.dispatch({ type: 'removeTempline' })

        let el = DOM.findDOMNode(currentState.draggingElement).getElementsByClassName('barChartBody barOver')
        if (el.length) {
            el[0].setAttribute('class', 'barChartBody')
        }
        el = DOM.findDOMNode(currentState.dropTarget).getElementsByClassName('barChartBody barOver')
        if (el.length) {
            el[0].setAttribute('class', 'barChartBody')
        }
        GCMediator.dispatch({ type: 'stopDragging' })
        GCMediator.dispatch({ type: 'stopSizing' })
        GCMediator.dispatch({ type: 'stopLinking' })
        GCMediator.dispatch({ type: 'removeDropTarget' })
        GCMediator.dispatch({ type: 'removeDraggingElement' })
    }

    private handleRectHover(event: Event) {
        let currentState = GCMediator.getState()
        this.clearTempElements()
        var eventTarget: any = event.target

        if ((!currentState.isDragging || !currentState.isLinking) && this !== currentState.draggingElement && this !== currentState.dropTarget) {
            GCMediator.dispatch({
                type: 'setDropTarget',
                data: this
            })

            if (eventTarget.getAttribute('class') === 'barChartBody') {
                eventTarget.setAttribute('class', 'barChartBody barOver')
            }
        } else {
            if (!GCMediator.getState().isCurrentlyDragging && !GCMediator.getState().isCurrentlySizing && eventTarget.classList[0] === 'barChartBody') {
                let coords = eventTarget.getBoundingClientRect()
                let hoverElement = event.target

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
                        GCMediator.getState().ganttChartView.refs.infoPopup.show()
                    }
                }.bind(this, hoverElement), 500)
                let el = DOM.findDOMNode(this) as any
                this.clearTempElements()
                let elementRect = eventTarget.getBoundingClientRect()

                document.onmousemove = function (event) {
                    let clickCoordX = event.clientX
                    if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                        el.style.cursor = 'move'
                    } else if (clickCoordX > elementRect.right - 15) {
                        el.style.cursor = 'e-resize'
                    } else if (clickCoordX < elementRect.left + 15) {
                        el.style.cursor = 'e-resize'
                    }
                }
            }
        }
    }

    private completeBarRelocation(event: Event) {
        document.onmousemove = null
        document.onmouseup = null
        let currentState = GCMediator.getState()
        if (currentState.draggingElement) {
            let draggingElement = DOM.findDOMNode(currentState.draggingElement) as any
            if (currentState.dropTarget && currentState.isCurrentlyDragging) {

                let moveToSateX = currentState.dropTarget.state.startDate
                let moveToSateY = currentState.dropTarget.state.top

                let exchToSateX = currentState.draggingElement.state.startDate
                let exchToSateY = currentState.draggingElement.state.top

                currentState.draggingElement.setState({ startDate: moveToSateX })
                currentState.draggingElement.setState({ top: moveToSateY })

                let dropTarget = DOM.findDOMNode(currentState.dropTarget) as any

                currentState.dropTarget.setState({ startDate: exchToSateX })
                currentState.dropTarget.setState({ top: exchToSateY })

                dropTarget.setAttribute('transform', 'translate(0, 0)')
                draggingElement.setAttribute('transform', 'translate(0, 0)')
            } else {
                let currentMargin = currentState.draggingElement.state.startDate
                let delta = draggingElement.transform.baseVal[0].matrix.e

                currentState.draggingElement.setState({ startDate: currentMargin + delta })

                draggingElement.setAttribute('transform', 'translate(0, 0)')
            }
        }
        if (currentState.draggingElement) {
            let connectionsDropTarget = currentState.draggingElement.state.connections
            if (connectionsDropTarget) {
                let length = connectionsDropTarget.length

                for (let i = 0; i < length; i++) {
                    connectionsDropTarget[i].buildConnection()
                }
            }
        }

        if (currentState.dropTarget) {
            let draggingElement = currentState.dropTarget.state.connections
            if (draggingElement) {
                let length = draggingElement.length

                for (let i = 0; i < length; i++) {
                    draggingElement[i].buildConnection()
                }
            }
        }

        currentState.isCurrentlyDragging = false
        currentState.isCurrentlySizing = false
        currentState.isDrawingConnection = false
        currentState.dropTarget = null
        currentState.draggingElement = null
        const eventTarget: any = event.target
        if (eventTarget.getAttribute('class') === 'barChartBody barOver') {
            eventTarget.setAttribute('class', 'barChartBody')
        }
    }

    private completeBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target
        let currentState = GCMediator.getState()
        if (eventTarget.getAttribute('class') === 'barChartBody barOver' && !currentState.isCurrentlyDragging) {
            eventTarget.setAttribute('class', 'barChartBody')
        }
        const relatedTarget: any = event.relatedTarget
        if (relatedTarget && relatedTarget.id === 'gridPattern') {
            if (eventTarget.classList[0] === 'barExchanging') {
                setTimeout(function () {
                    if (eventTarget.classList[0] === 'barExchanging') {
                        eventTarget.setAttribute('class', 'barChartBody{}' + eventTarget.classList[2])

                        let transformeMatrix = eventTarget.parentNode.createSVGMatrix()
                        transformeMatrix = transformeMatrix.translate(0, 0)
                        if (eventTarget.transform.baseVal.length === 0 && eventTarget.parentNode.createSVGMatrix) {
                            eventTarget.transform.baseVal.appendItem(eventTarget.parentNode.createSVGTransformFromMatrix(transformeMatrix))
                        } else {
                            eventTarget.transform.baseVal.getItem(0).setMatrix(transformeMatrix)
                        }
                    }
                }.bind(this), 1000)
            }
            this.clearTempElements()
        }
    }

    private clearTempElements() {
        if (document.getElementById('leftTempCircle')) {
            document.getElementById('ganttChartView').removeChild(document.getElementById('leftTempCircle'))
            document.getElementById('ganttChartView').removeChild(document.getElementById('rightTempCircle'))
        }
        GCMediator.getState().ganttChartView.refs.infoPopup.hide()
        if (!GCMediator.getState().isDragging && !GCMediator.getState().isSizing && !GCMediator.getState().isLinking && GCMediator.getState().templine) {
            document.getElementById('ganttChartView').removeChild(GCMediator.getState().templine)
            GCMediator.dispatch({ type: 'removeTempline' })
        }
    }

    private contextMenu(event: Event) {
        console.log(event)
        event.preventDefault()
        event.stopPropagation()
    }

    private showModalWindow() {
        const currentState = GCMediator.getState()
        const modalWindow = currentState.ganttChartView.refs.modalWindow

        currentState.ganttChartView.refs.infoPopup.hide()
        modalWindow.show()

        modalWindow.setState({
            title: this.state.title,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration
        })
    }

    public static selectTask(taskId: string) {
        let selectedElement = document.getElementById(taskId)
        if (selectedElement && selectedElement.tagName === 'rect') {
            selectedElement.setAttribute('class', 'barChartBody barSelected')
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this)
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any
        }
        selectedElement.setAttribute('class', 'barChartBody')
    }

    public static deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            let selectedElement = document.getElementById(tasks[i])
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'barChartBody')
            }
        }
    }

    public render() {
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.completeBarUpdate.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            y: this.state.position + 6,
            x: this.state.startDate,
            transform: 'translate(0, 0)'
        },
            React.createElement('rect', { // main element
                onClick: this.startTaskSelection.bind(this),
                className: 'barChartBody',
                group: this.props.data.barClass,
                id: this.props.data.id,
                y: this.state.position + 6,
                x: this.state.startDate,
                width: this.state.duration * GCMediator.getState().cellCapacity
            }),
            React.createElement('rect', { // progress element
                className: 'barChartFillBody',
                group: this.props.data.barClass,
                y: this.state.position + 6,
                x: this.state.startDate,
                width: this.state.progress * GCMediator.getState().cellCapacity,
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: this.state.startDate + this.state.duration * GCMediator.getState().cellCapacity * 0.5,
                y: this.state.position + 15 + 6
            }, this.props.data.name)
        )
    }
}
