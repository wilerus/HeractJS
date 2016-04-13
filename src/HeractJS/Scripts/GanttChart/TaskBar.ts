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
        if (!GCMediator.getState().isDragging) {
            GCMediator.dispatch({ type: 'deselectAllTasks' })

            GCMediator.dispatch({
                type: 'selectTask',
                data: this.state.id
            })
        }
    }

    private startBarRelocation(event: MouseEvent) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        })
        const eventTarget: any = event.target
        let dropTarget = eventTarget
        if (eventTarget.tagName === 'rect') {
            dropTarget = dropTarget.parentNode
        }

        const e: any = event.target
        const dim = e.getBoundingClientRect()
        const startY = event.clientY
        const startX = event.clientX
        const x = startX - dim.left

        document.onmousemove = function (event: MouseEvent) {
            const transform = dropTarget.parentNode.createSVGMatrix()
            if (Math.abs(event.clientX - startX) > 30) {
                dropTarget.transform.baseVal.getItem(0).setMatrix(
                    transform.translate(event.clientX - eventTarget.parentNode.getAttribute('x') - 8 - x, 0)
                )
            }

            if (Math.abs(event.clientY - startY) > 30) {
                const templine = document.createElementNS('http://www.w3.org/2000/svg', 'line')

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
            }
        }.bind(this)
    }

    private startBarUpdate(event: MouseEvent) {
        document.onmousemove = null
        if (event.button !== 2) {
            let eventTarget: any = event.target
            let parentElement: any = null
            let parentCoords: any = null
            if (eventTarget.getAttribute('class') === 'barChartFillBody') {
                parentElement = eventTarget
                eventTarget = eventTarget.parentNode
                parentCoords = parentElement.getBoundingClientRect()
            }

            const elementRect = eventTarget.getBoundingClientRect()
            const clickCoordX = event.clientX

            GCMediator.dispatch({ type: 'startDragging' })

            if (parentElement && parentCoords && clickCoordX > parentCoords.right - 15) {
                this.updateComplitionState(event)
            } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.startBarRelocation(event)
                document.onmouseup = function () {
                    document.onmouseup = null
                    this.addNewConnection()
                    GCMediator.dispatch({ type: 'stopDragging' })
                    this.clearTempElements()
                }.bind(this)
            } else if (clickCoordX > elementRect.right - 15) {
                this.updateСompleteDate(event)
                document.onmouseup = function (event: MouseEvent) {
                    this.completeBarRelocation(event)
                }.bind(this)
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate()
                document.onmouseup = function (event: MouseEvent) {
                    this.completeBarRelocation(event)
                }.bind(this)
            }
        }
    }

    private updateСompleteDate(event: MouseEvent) {
        const eventTarger: any = event.target
        const startX = eventTarger.getAttribute('x')
        document.onmousemove = function (event) {
            const currentState = GCMediator.getState()
            const parentNode: any = DOM.findDOMNode(this).parentNode
            const leftMargin = parentNode.getBoundingClientRect().left
            const newDuration = (event.pageX - startX - leftMargin) / currentState.cellCapacity

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

    private updateStartDate() {
        if (!document.onmousemove) {
            const currentState = GCMediator.getState()
            document.onmousemove = function (event: MouseEvent) {
                const parentNode: any = DOM.findDOMNode(this).parentNode
                const leftMargin = parentNode.getBoundingClientRect().left
                const newStartDate = event.pageX - leftMargin
                const newDuration = (this.state.startDate - newStartDate) / currentState.cellCapacity + this.state.duration

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
        const eventTarget: any = event.target
        const elementRect = eventTarget.getBoundingClientRect()
        const clickCoordX = event.clientX

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
                this.completeBarRelocation(event)
                document.onmousemove = null
                document.onmouseup = null
            }.bind(this)
        }
    }

    private addNewConnection() {
        const currentState = GCMediator.getState()
        const currentItems = currentState.items

        GCMediator.dispatch({
            type: 'create',
            item: {
                id: `connection ${currentItems.length + 1}`,
                firstP: currentState.draggingElement,
                endP: currentState.dropTarget,
                type: 'connection'
            }
        })

        document.onmousemove = null

        this.clearTempElements()
    }

    private handleRectHover(event: Event) {
        const currentState = GCMediator.getState()
        const eventTarget: any = event.target

        if (!currentState.isDragging) {
            const el = DOM.findDOMNode(this) as any
            const elementRect = eventTarget.getBoundingClientRect()
            const hoverElement = event.target as any

            setTimeout(function (hoverElement) {
                if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                    !GCMediator.getState().isCurrentlyDragging) {
                    this.showPopup(hoverElement)
                }
            }.bind(this, hoverElement), 500)

            document.onmousemove = (event) => {
                let clickCoordX = event.clientX
                if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                    el.style.cursor = 'move'
                } else if (clickCoordX > elementRect.right - 15) {
                    el.style.cursor = 'e-resize'
                } else if (clickCoordX < elementRect.left + 15) {
                    el.style.cursor = 'e-resize'
                }
            }
        } else if (this !== currentState.draggingElement && this !== currentState.dropTarget) {
            GCMediator.dispatch({
                type: 'setDropTarget',
                data: this
            })
        }
        if (eventTarget.getAttribute('class') === 'barChartBody') {
            eventTarget.setAttribute('class', 'barChartBody barOver')
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

        this.clearTempElements()
    }

    private completeBarUpdate(event: MouseEvent) {
        const eventTarget: any = event.target
        const currentState = GCMediator.getState()

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
        }
        this.clearTempElements()
    }

    private clearTempElements() {
        const currentState = GCMediator.getState()

        currentState.ganttChartView.refs.infoPopup.hide()

        if (!currentState.isDragging) {
            if (currentState.templine) {
                document.getElementById('ganttChartView').removeChild(GCMediator.getState().templine)
                GCMediator.dispatch({ type: 'removeTempline' })
            }
            if (currentState.draggingElement) {
                const el = DOM.findDOMNode(currentState.draggingElement).getElementsByClassName('barChartBody barOver')
                if (el.length) {
                    el[0].setAttribute('class', 'barChartBody')
                }
                GCMediator.dispatch({ type: 'removeDraggingElement' })
            }
            if (currentState.dropTarget) {
                const el = DOM.findDOMNode(currentState.dropTarget).getElementsByClassName('barChartBody barOver')
                if (el.length) {
                    el[0].setAttribute('class', 'barChartBody')
                }
                GCMediator.dispatch({ type: 'removeDropTarget' })
            }
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

    private showPopup(hoverElement) {
        const parentNode: any = DOM.findDOMNode(this).parentNode
        const leftMargin = parentNode.getBoundingClientRect().left
        const coords = hoverElement.getBoundingClientRect()

        GCMediator.getState().ganttChartView.refs.infoPopup.setState({
            left: parseInt(hoverElement.getAttribute('x')) + coords.width / 2 - leftMargin,
            top: parseInt(hoverElement.getAttribute('y')) - 55,
            title: this.state.title,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration,
            description: this.state.description
        })
        GCMediator.getState().ganttChartView.refs.infoPopup.show()
    }

    public static selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId)
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
            const selectedElement = document.getElementById(tasks[i])
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
                y: this.state.position + 4,
                x: this.state.startDate,
                width: this.state.duration * GCMediator.getState().cellCapacity
            }),
            React.createElement('rect', { // progress element
                className: 'barChartFillBody',
                group: this.props.data.barClass,
                y: this.state.position + 5,
                x: this.state.startDate + 1,
                width: this.state.progress * GCMediator.getState().cellCapacity,
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: this.state.startDate + this.state.duration * GCMediator.getState().cellCapacity * 0.5,
                y: this.state.position + 15
            }, this.props.data.name)
        )
    }
}
