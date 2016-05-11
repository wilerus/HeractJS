import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineBar extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
        const data = props.data
        this.state = {
            id: data.id,
            order: data.order,
            collapsed: data.collapsed,
            position: data.position,
            calloutDisplay: data.calloutDisplay,
            timelineDisplay: data.timelineDisplay,
            link: data.link,
            name: data.name,
            type: data.type,
            description: data.description,
            assignee: data.assignee,
            parent: data.parent,
            predecessors: data.predecessors,
            progress: data.progress,
            duration: data.duration,
            startDate: data.startDate,
            finish: data.finish,
            priority: data.priority
        };
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change && change.data && change.data.type === 'task') {
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
        if (JSON.stringify(this.state) !== JSON.stringify(nextState.data)) {
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
            calloutDisplay: data.calloutDisplay,
            timelineDisplay: data.timelineDisplay,
            link: data.link,
            name: data.name,
            type: data.type,
            description: data.description,
            assignee: data.assignee,
            parent: data.parent,
            predecessors: data.predecessors,
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
                            id: id.substring(0, id.length - 3),
                            type: 'task'
                        }
                    });
                }
            } else {
                const id = this.state.id
                GCMediator.dispatch({
                    type: 'selectTask',
                    data: {
                        id: id.substring(0, id.length - 3),
                        type: 'task'
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
        const titleElement = eventTarget.parentNode.getElementsByClassName('taskLineTaskTitle')[0];
        const dateElement = eventTarget.parentNode.getElementsByClassName('taskLineTaskDate')[0];
        const clipPath = eventTarget.parentNode.getElementsByClassName('clipRect')[0];
        document.onmousemove = (event: MouseEvent) => {
            const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
            if (newStartDate > 0) {
                eventTarget.setAttribute('x', newStartDate)
                titleElement.setAttribute('x', newStartDate)
                dateElement.setAttribute('x', newStartDate)
                clipPath.setAttribute('x', newStartDate)
            }
        }
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
                top: coords.top - 160 < 0 ? coords.top + 30 : coords.top - 160,
                title: this.state.name,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration,
                description: this.state.description
            }
        })
    }

    private showActionPopup(event) {
        const coords = event.target.getBoundingClientRect();
        this.startTaskSelection();
        GCMediator.dispatch({
            type: 'showActionTimelinePopup',
            data: {
                left: coords.left + coords.width / 2 - 100,
                top: coords.top + 22,
                title: this.state.name
            }
        })
        event.preventDefault();
        event.stopPropagation();
    }

    private selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId + 'TLI');
        if (selectedElement && selectedElement.tagName === 'rect') {
            selectedElement.setAttribute('class', 'tasklineBarBody tasklineBarSelected');
        }
    }

    private updateStartDate(event: MouseEvent, eventTarget: any) {
        if (!document.onmousemove) {
            const startDate = event.pageX;
            const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
            const startWidth = parseInt(eventTarget.getAttribute('width'));
            document.onmousemove = (event: MouseEvent) => {
                const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                const newWidth = Math.round(startWidth + (startDate - event.pageX));
                if (newStartDate > 0 && newWidth > 1) {
                    eventTarget.setAttribute('x', newStartDate);
                    eventTarget.setAttribute('width', newWidth);
                }
            }
        }
    }

    private updateСompleteDate(event: any, eventTarget: any) {
        const cellCapacity = GCMediator.getState().tasklineCellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        const clipRect = eventTarget.parentNode.getElementsByClassName('clipRect')[0];
        document.onmousemove = function (event) {
            newDuration = Math.round(event.pageX - startPoint);
            if (newDuration > 0) {
                eventTarget.setAttribute('width', newDuration)
                clipRect.setAttribute('width', newDuration)
            }
        }.bind(this);
    }

    private startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        if (event.button !== 2) {
            const elementRect = eventTarget.getBoundingClientRect();
            const clickCoordX = event.clientX;
            this.startTaskSelection();
            GCMediator.dispatch({ type: 'startDragging' });
            if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.startBarRelocation(event, eventTarget);
            } else if (clickCoordX > elementRect.right - 15) {
                this.updateСompleteDate(event, eventTarget);
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate(event, eventTarget);
            }
            document.onmouseup = (event: MouseEvent) => {
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

    public deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i].id + 'TLI');
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'tasklineBarBody');
            }
        }
    }

    public render() {
        const id = this.props.data.id;
        const startDate = this.state.startDate * GCMediator.getState().tasklineCellCapacity;
        const duration = this.state.duration * GCMediator.getState().tasklineCellCapacity;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('defs', {
            }, React.createElement('clipPath', {
                id: id + 'clipPath'
            }, React.createElement('rect', {
                className: 'clipRect',
                id: id + 'clipRect',
                x: startDate + 1,
                height: 28,
                width: duration - 2
            }))),
            React.createElement('rect', {
                className: 'tasklineBarBody',
                id: id,
                x: startDate,
                y: 1.5,
                width: duration,
                filter: 'url(#shadowFilter)'
            }),
            React.createElement('text', {
                className: 'taskLineTaskTitle',
                x: startDate + 2,
                width: duration - 2,
                clipPath: `url(#${id}clipPath)`,
                y: 13
            }, `${this.props.data.name} - ${this.props.data.description}`),
            React.createElement('text', {
                className: 'taskLineTaskDate',
                x: startDate + 2,
                width: duration - 2,
                clipPath: `url(#${id}clipPath)`,
                y: 25
            }, this.state.date)
        );
    }
}
