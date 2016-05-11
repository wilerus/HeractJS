import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineMilestone extends React.Component<any, any> {

    constructor(props, context) {
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
            priority: props.data.priority,
            columnWidth: GCMediator.getState().tasklineCellCapacity
        };
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change && change.data && change.data.type === 'milestone') {
                switch (change.type) {
                    case 'deselectAllTasks':
                        this.deselectAllTasks(change.data.tasks);
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

    private componentWillReceiveProps(nextProps) {
        const data = nextProps.data
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
                GCMediator.dispatch({
                    type: 'deselectAllTasks'
                });
                const id = this.state.id
                if (selectedTask !== id) {
                    GCMediator.dispatch({
                        type: 'selectTask',
                        data: {
                            id: id.substring(0, id.length - 3),
                            type: 'milestone'
                        }
                    });
                }
            } else {
                const id = this.state.id
                GCMediator.dispatch({
                    type: 'selectTask',
                    data: {
                        id: id.substring(0, id.length - 3),
                        type: 'milestone'
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
        const currentState = GCMediator.getState();
        const startDate = event.pageX;
        const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
        const connection = eventTarget.parentNode.getElementsByClassName('bodyConnection')[0];
        const title = eventTarget.parentNode.getElementsByClassName('barTitle')[0];
        document.onmousemove = (event: MouseEvent) => {
            const newStartDate = startPointStartDate + (event.pageX - startDate);
            if (newStartDate > 0) {
                eventTarget.setAttribute('x', newStartDate)
                connection.setAttribute('x1', newStartDate + 7.5)
                connection.setAttribute('x2', newStartDate + 7.5)
                title.setAttribute('x', newStartDate - 40)
            }
        };
    }

    private startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        if (event.button !== 2) {
            this.startTaskSelection();
            GCMediator.dispatch({ type: 'startDragging' });
            this.startBarRelocation(event, eventTarget);
            document.onmouseup = () => {
                GCMediator.dispatch({
                    type: 'editTask',
                    data: {
                        duration: Math.round(eventTarget.getAttribute('width') / GCMediator.getState().tasklineCellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / GCMediator.getState().tasklineCellCapacity)
                    }
                })
                GCMediator.dispatch({ type: 'stopDragging' })
                GCMediator.dispatch({ type: 'completeEditing' });
            }
        }
    }

    private updateСompleteDate(event: MouseEvent) {
        const cellCapacity = GCMediator.getState().cellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        let newCompletion = this.state.progress / cellCapacity;
        document.onmousemove = function (event) {
            newDuration = (event.pageX - startPoint) / cellCapacity;
            if (newDuration) {
                newCompletion = this.state.progress / cellCapacity;
                if (newCompletion > newDuration || newCompletion === duration) {
                    this.setState({
                        progress: newDuration
                    });
                }
                this.setState({
                    duration: newDuration
                });
            }
        }.bind(this);
    }

    private updateStartDate(event: MouseEvent) {
        if (!document.onmousemove) {
            const currentState = GCMediator.getState();
            const cellCapacity = currentState.cellCapacity;
            const startDate = this.state.startDate;
            const startPointStartDate = event.pageX - startDate * cellCapacity;
            document.onmousemove = function (event: MouseEvent) {
                const newStartDate = (event.pageX - startPointStartDate) / cellCapacity;
                const newDuration = this.state.duration - (newStartDate - this.state.startDate);
                if (this.state.startDate !== newStartDate && newDuration) {
                    // let newCompletion = this.state.progress
                    //if (newCompletion > newDuration || newCompletion === this.state.duration) {
                    //    newCompletion = newDuration
                    //}
                    this.setState({
                        startDate: newStartDate,
                        duration: newDuration
                        // progress: newCompletion
                    });
                }
            }.bind(this);
        }
    }

    private updateComplitionState(event: MouseEvent) {
        const eventTarget: any = event.target;
        const elementRect = eventTarget.getBoundingClientRect();
        const clickCoordX = event.clientX;
        if (clickCoordX > elementRect.right - 15) {
            document.onmousemove = function (event) {
                const parentNode: any = DOM.findDOMNode(this).parentNode;
                const leftMargin = parentNode.getBoundingClientRect().left;
                let newComplition = event.pageX - event.target.getAttribute('x') - leftMargin;
                newComplition = newComplition / GCMediator.getState().cellCapacity;
                if (newComplition <= 0) {
                    newComplition = 0;
                } else if (this.state.duration < newComplition) {
                    newComplition = this.state.duration;
                }
                this.setState({
                    progress: newComplition
                });
            }.bind(this);
            document.onmouseup = () => {
                GCMediator.dispatch({ type: 'completeEditing' });
            }
        }
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
        });
        GCMediator.dispatch({ type: 'completeEditing' });
    }

    private handleRectHover(event: Event) {
        const currentState = GCMediator.getState();
        if (!currentState.isPanning) {
            if (!currentState.isDragging) {
                const el = DOM.findDOMNode(this) as any;
                const hoverElement = event.target as any;
                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !GCMediator.getState().isCurrentlyDragging) {
                        hoverElement.onmouseout = () => {
                            GCMediator.dispatch({ type: 'completeEditing' });
                        }
                        this.showInfoPopup(hoverElement);
                    }
                }.bind(this, hoverElement), 500);
                el.style.cursor = 'move';
            } else if (this !== currentState.draggingElement && this !== currentState.dropTarget) {
                GCMediator.dispatch({
                    type: 'setDropTarget',
                    data: this
                });
            }
        }
    }

    private showInfoPopup(hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        GCMediator.dispatch({
            type: 'showInfoPopup',
            data: {
                left: coords.left + coords.width / 2 - 100,
                top: coords.top - 160,
                title: this.state.name,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration,
                description: this.state.description
            }
        });
    }

    private showModalWindow() {
        GCMediator.dispatch({ type: 'hideAllPopups' });
        GCMediator.dispatch({
            type: 'showModalWindow',
            data: {
                title: this.state.name,
                description: this.state.description,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration
            }
        });
    }

    private showActionPopup(event) {
        const coords = event.target.getBoundingClientRect();
        this.startTaskSelection();
        GCMediator.dispatch({
            type: 'showActionTimelinePopup',
            data: {
                left: coords.left + coords.width / 2 - 100,
                top: coords.top + 22,
                title: this.state.name,
                target: 'milestone'
            }
        });
        event.preventDefault();
        event.stopPropagation();
    }

    private selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId + 'TLI');
        if (selectedElement && selectedElement.tagName === 'rect') {
            selectedElement.setAttribute('class', 'milestoneBody milestoneSelected');
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this);
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any;
        }
        selectedElement.setAttribute('class', 'milestoneBody');
    }

    private deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i].id + 'TLI');
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'milestoneBody');
            }
        }
    }

    public render() {
        const startDate = this.state.startDate * this.state.columnWidth;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('rect', {
                className: 'milestoneBody',
                id: this.props.data.id,
                x: startDate,
                y: 3,
                rx: 3,
                ry: 3,
                filter: 'url(#shadowFilter)'
            }),
            React.createElement('line', {
                className: 'bodyConnection',
                x1: startDate + 7.5,
                y1: 20,
                x2: startDate + 7.5,
                y2: 30,
                strokeWidth: 1,
                stroke: 'rgb(120,120,120)'
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: startDate - 40,
                y: 40
            }, 'This will be date')
        );
    }
}
