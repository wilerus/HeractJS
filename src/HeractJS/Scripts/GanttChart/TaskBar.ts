import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TaskBar extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            id: props.data.id,
            order: props.data.order,
            collapsed: props.data.collapsed,
            position: props.data.position,

            name: props.data.name,
            type: props.data.type,
            description: props.data.description,
            assignee: props.data.assignee,
            parent: props.data.parent,
            predecessors: props.data.startDate,

            progress: props.data.progress,
            duration: props.data.duration,
            startDate: props.data.startDate,
            finish: props.data.finish,
            priority: props.data.priority
        };
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'deselectAllTasks':
                        if (change.data) {
                            this.deselectAllTasks(change.data.tasks);
                        }
                        break;
                    case 'selectTask':
                        this.selectTask(change.data.id);
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private shouldComponentUpdate(nextState: any) {
        if (this.state !== nextState) {
            return true;
        } else {
            return false;
        }
    }

    private componentWillReceiveProps() {
        const data = this.props.data as any
        this.setState({
            id: data.id,
            order: data.order,
            collapsed: data.collapsed,
            position: data.position,

            name: data.name,
            description: data.description,
            assignee: data.assignee,
            parent: data.parent,
            predecessors: data.startDate,

            progress: data.progress,
            duration: data.duration,
            startDate: data.startDate,
            finish: data.finish,
            priority: data.priority
        });
    }

    private startTaskSelection() {
        if (!GCMediator.getState().isDragging) {
            const selectedTask = GCMediator.getState().selectedTasks[0];
            if (selectedTask) {
                GCMediator.dispatch({ type: 'deselectAllTasks' });
                const id = this.state.id
                if (selectedTask !== id) {
                    GCMediator.dispatch({
                        type: 'selectTask',
                        data: {
                            id: id,
                            type: this.state.type
                        }
                    });
                }
            } else {
                const id = this.state.id
                GCMediator.dispatch({
                    type: 'selectTask',
                    data: {
                        id: id,
                        type: this.state.type
                    }
                });
            }
        }
    }

    private startBarRelocation(event: MouseEvent, eventTarget) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const startY = event.clientY;
        const startX = event.clientX;
        document.onmousemove = function (event: MouseEvent) {
            if (Math.abs(event.clientX - startX) > 30) {
                const startDate = event.pageX;
                const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
                const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
                document.onmousemove = (event: MouseEvent) => {
                    const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                    if (newStartDate > 0) {
                        eventTarget.setAttribute('x', newStartDate)
                        if (fillTarget) {
                            fillTarget.setAttribute('x', newStartDate)
                        }
                    }
                }
            }

            if (Math.abs(event.clientY - startY) > 30) {
                const templine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                templine.setAttribute('id', 'templine');
                templine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + eventTarget.getAttribute('width') / 2).toString());
                templine.setAttribute('strokeWidth', '2');
                templine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
                templine.setAttribute('stroke', 'rgb(80,80,220)');

                const parentNode: any = DOM.findDOMNode(this).parentNode;
                const leftMargin = parentNode.getBoundingClientRect().left;
                document.onmousemove = (event: MouseEvent) => {
                    templine.setAttribute('x2', (event.clientX - leftMargin).toString());
                    templine.setAttribute('y2', (event.clientY - 100).toString());
                };
                GCMediator.dispatch({
                    type: 'setTempline',
                    data: templine
                });
                document.getElementById('ganttChartView').appendChild(templine);
            }
        }.bind(this);
    }

    private startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        let documentAny = document as any
        if (documentAny.selection) {
            documentAny.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        if (event.button !== 2 && eventTarget.classList[0] !== 'barSelectBody') {
            let parentElement: any = null;
            let parentCoords: any = null;
            this.startTaskSelection();
            if (eventTarget.getAttribute('class') === 'barChartFillBody') {
                parentElement = eventTarget;
                eventTarget = eventTarget.parentNode.getElementsByClassName('barChartBody')[0];
                parentCoords = parentElement.getBoundingClientRect();
            }

            const elementRect = eventTarget.getBoundingClientRect();
            const clickCoordX = event.clientX;
            GCMediator.dispatch({ type: 'startDragging' });
            if (eventTarget.getAttribute('class') === 'milestoneBody') {
                this.startBarRelocation(event, eventTarget);
            } else {
                if (parentElement && parentCoords && clickCoordX > parentCoords.right - 15) {
                    this.updateComplitionState(event, eventTarget);
                } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                    this.startBarRelocation(event, eventTarget);
                } else if (clickCoordX > elementRect.right - 15) {
                    this.updateСompleteDate(event, eventTarget);
                } else if (clickCoordX < elementRect.left + 15) {
                    this.updateStartDate(event, eventTarget);
                }
            }

            document.onmouseup = function (event: MouseEvent) {
                GCMediator.dispatch({
                    type: 'editTask',
                    data: {
                        duration: Math.round(eventTarget.getAttribute('width') / GCMediator.getState().cellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / GCMediator.getState().cellCapacity)
                    }
                })
                GCMediator.dispatch({ type: 'stopDragging' })
                this.clearTempElements()
            }.bind(this)
        }
    }

    private updateСompleteDate(event: any, eventTarget: any) {
        const cellCapacity = GCMediator.getState().cellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        document.onmousemove = function (event) {
            newDuration = Math.round(event.pageX - startPoint);
            if (newDuration > 0) {
                eventTarget.setAttribute('width', newDuration)
            }
        }.bind(this);
    }

    private updateStartDate(event: MouseEvent, eventTarget: any) {
        if (!document.onmousemove) {
            const startDate = event.pageX;
            const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
            const startWidth = parseInt(eventTarget.getAttribute('width'));
            const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
            document.onmousemove = (event: MouseEvent) => {
                const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                const newWidth = Math.round(startWidth + (startDate - event.pageX));
                if (newStartDate > 0 && newWidth > 1) {
                    eventTarget.setAttribute('x', newStartDate)
                    fillTarget.setAttribute('x', newStartDate)
                    eventTarget.setAttribute('width', newWidth)
                }
            };
        }
    }

    private updateComplitionState(event: MouseEvent, eventTarget) {
        const clickCoordX = event.pageX;
        const target = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
        const maxWidth = eventTarget.parentNode.getElementsByClassName('barChartBody')[0].getAttribute('width');
        const width = parseInt(target.getAttribute('width'));
        document.onmousemove = function (event) {
            const newComplition = Math.round(width + (event.pageX - clickCoordX));
            if (newComplition > 0 && newComplition < maxWidth) {
                target.setAttribute('width', newComplition);
            }
        }.bind(this);
    }

    private addNewConnection(event: MouseEvent) {
        const currentState = GCMediator.getState();
        const currentItems = currentState.items;
        GCMediator.dispatch({
            type: 'create',
            item: {
                id: `connection ${currentItems.length + 1}`,
                firstP: currentState.draggingElement,
                endP: currentState.dropTarget,
                type: 'connection'
            }
        })
    }

    private handleRectHover(event: MouseEvent) {
        const currentState = GCMediator.getState();
        if (!currentState.isPanning) {
            const eventTarget: any = event.target;
            if (!currentState.isDragging) {
                const el = DOM.findDOMNode(this) as any;
                const elementRect = eventTarget.getBoundingClientRect();
                let hoverElement = event.target as any;
                if (hoverElement.classList[0] !== 'barSelectBody') {
                    hoverElement = hoverElement.parentNode.getElementsByClassName('barSelectBody')[0]
                }
                if (hoverElement) {
                    setTimeout(function (hoverElement, clientX: number) {
                        let currentHoverElement = hoverElement.parentElement.querySelector(':hover');
                        if (currentHoverElement && currentHoverElement.classList[0] !== 'barSelectBody') {
                            currentHoverElement = currentHoverElement.parentNode.getElementsByClassName('barSelectBody')[0]
                        }
                        if (currentHoverElement && currentHoverElement === hoverElement && !GCMediator.getState().isDragging) {
                            this.showInfoPopup(clientX, hoverElement);
                            currentHoverElement.onmouseout = function () {
                                this.clearTempElements();
                            }.bind(this)
                        }
                    }.bind(this, hoverElement, event.clientX), 500);
                    document.onmousemove = (event) => {
                        const clickCoordX = event.clientX;
                        if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                            el.style.cursor = 'move';
                        } else if (clickCoordX > elementRect.right - 15) {
                            el.style.cursor = 'e-resize';
                        } else if (clickCoordX < elementRect.left + 15) {
                            el.style.cursor = 'e-resize';
                        }
                    };
                }
            } else if (this !== currentState.draggingElement && this !== currentState.dropTarget) {
                GCMediator.dispatch({
                    type: 'setDropTarget',
                    data: this
                });
            }
        }
    }

    private clearTempElements(event: MouseEvent) {
        const currentState = GCMediator.getState();
        if (event) {
            const eventTarget = event.target as any;
            eventTarget.parentNode.style = ''
        }
        if (!currentState.isDragging && !currentState.isPanning) {
            GCMediator.dispatch({ type: 'hideInfoPopup' })
            document.onmousemove = null;
            document.onmouseup = null;

            if (currentState.templine) {
                document.getElementById('ganttChartView').removeChild(GCMediator.getState().templine);
                GCMediator.dispatch({ type: 'removeTempline' });
            }
            if (currentState.draggingElement) {
                GCMediator.dispatch({ type: 'removeDraggingElement' });
            }
            if (currentState.dropTarget) {
                GCMediator.dispatch({ type: 'removeDropTarget' });
            }
        }
    }

    private contextMenu(event: MouseEvent) {
        this.showActionPopup(event, event.target);
        event.preventDefault();
        event.stopPropagation();
    }

    private showModalWindow() {
        GCMediator.dispatch({ type: 'hideAllPopups' })
        GCMediator.dispatch({
            type: 'showModalWindow',
            data: {
                title: this.state.name,
                description: this.state.description,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration
            }
        })
    }

    private showInfoPopup(clientX, hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        let leftMargin: number;
        let topMargin: number = coords.top - 160 < 0 ? coords.top + 30 : coords.top - 160;

        if (hoverElement.getAttribute('class') === 'barSelectBody') {
            leftMargin = clientX;
        } else {
            leftMargin = coords.left + coords.width / 2 - 100;
        }
        GCMediator.dispatch({
            type: 'showInfoPopup',
            data: {
                left: leftMargin,
                top: topMargin,
                title: this.state.name,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration,
                description: this.state.description
            }
        })
    }

    private showActionPopup(event: MouseEvent, hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        let leftMargin: number;
        let topMargin: number = coords.top + 22;
        this.startTaskSelection();
        if (hoverElement.getAttribute('class') === 'barSelectBody barSelected') {
            leftMargin = event.clientX;
        } else {
            leftMargin = coords.left + coords.width / 2 - 100;
        }
        GCMediator.dispatch({
            type: 'showActionChartPopup',
            data: {
                left: leftMargin,
                top: topMargin,
                title: this.state.name
            }
        })
    }

    private selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId);
        if (selectedElement && selectedElement.getAttribute('class') !== 'barSelectBody') {
            const parent = selectedElement.parentNode as any;
            const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
            selectingElement.setAttribute('class', 'barSelectBody barSelected');
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this);
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any;
        }
        selectedElement.setAttribute('class', 'barChartBody');
    }

    private deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i].id);
            if (selectedElement && selectedElement.getAttribute('class') !== 'barSelectBody') {
                const parent = selectedElement.parentNode as any;
                const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
                selectingElement.setAttribute('class', 'barSelectBody');
            }
        }
    }

    public render() {
        let element = null;
        const position = this.state.position;
        const id = this.props.data.id;
        const columnWidth = GCMediator.getState().cellCapacity;
        const startDate = this.state.startDate * columnWidth;
        const duration = this.state.duration * columnWidth;
        const length = startDate + duration;
        const configProgress = this.state.progress * duration / 100 - 2;
        const progress = configProgress > 0 ? configProgress : 0;
        const taskTitle = this.props.data.name;
        const taskType = this.state.type;

        switch (taskType) {
            case 'task':
                element = React.createElement('g', {
                    onMouseEnter: this.handleRectHover.bind(this),
                    onMouseDown: this.startBarUpdate.bind(this),
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this)
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position - 1,
                        x: 0
                    }),
                    React.createElement('rect', {
                        className: 'barChartBody',
                        id: id,
                        y: position + 4,
                        x: startDate,
                        width: duration,
                        rx: 3,
                        ry: 3
                    }),
                    React.createElement('rect', {
                        className: 'barChartFillBody',
                        y: position + 5,
                        x: startDate + 1,
                        width: progress
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: length,
                        y: position
                    }, taskTitle)
                );
                break;
            case 'milestone':
                element = React.createElement('g', {
                    onMouseEnter: this.handleRectHover.bind(this),
                    onMouseDown: this.startBarUpdate.bind(this),
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this)
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position - 1,
                        x: 0
                    }),
                    React.createElement('rect', {
                        className: 'milestoneBody',
                        id: id,
                        y: position + 4,
                        x: startDate,
                        rx: 3,
                        ry: 3
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: length,
                        y: position
                    }, taskTitle)
                );
                break;
            case 'project':
                element = React.createElement('g', {
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this)
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position - 1,
                        x: 0
                    }),
                    React.createElement('path', {
                        d: `M${startDate} ${position + 15} C ${startDate + 3} ${position + 10}, ${startDate + 3} ${position + 10}, ${startDate + 7} ${position + 10},
                            L${startDate + 7} ${position + 10}, ${length - 7} ${position + 10},
                            M${length - 7} ${position + 10} C ${length - 3} ${position + 10}, ${length - 3} ${position + 10}, ${length} ${position + 15}`,
                        stroke: 'black',
                        fill: 'transparent',
                        className: 'projectBody',
                        id: id
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: length,
                        y: position
                    }, taskTitle)
                );
                break;
            default:
                break;
        }

        return element;
    }
}
