import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineBar extends React.Component<any, any> {

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
            date: 'This will be date',

            progress: props.data.progress,
            duration: props.data.duration,
            startDate: props.data.startDate,
            finish: props.data.finish,
            priority: props.data.priority,
            columnWidth: GCMediator.getState().tasklineCellCapacity
        };
    }

    private shouldComponentUpdate(nextState: any) {
        if (this.state !== nextState) {
            return true;
        } else {
            return false;
        }
    }

    private componentWillReceiveProps() {
        const data = this.props.data
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
            if (GCMediator.getState().selectedTasks[0]) {
                GCMediator.dispatch({ type: 'deselectAllTasks' });
            }
            const id = this.state.id
            GCMediator.dispatch({
                type: 'selectTask',
                data: id.substring(0, id.length - 3)
            });
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

    private clearTempElements(event: Event) {
        const currentState = GCMediator.getState();
        currentState.ganttChartView.refs.infoPopup.hide();
        if (!currentState.isDragging) {
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

    private contextMenu(event: Event) {
        this.showActionPopup(event.target);
        event.preventDefault();
        event.stopPropagation();
    }

    private showInfoPopup(hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        const popup = GCMediator.getState().ganttChartView.refs.infoPopup;

        popup.setState({
            left: coords.left + coords.width / 2 - 100,
            top: coords.top - 160,
            title: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration,
            description: this.state.description
        });
        popup.show();
    }

    private showActionPopup(hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        const popup = GCMediator.getState().ganttChartView.refs.actionTasklinePopup;

        this.startTaskSelection();
        popup.setState({
            left: coords.left + coords.width / 2 - 100,
            top: coords.top + 22,
            title: this.state.name
        });
        popup.show();
    }

    public static selectTask(taskId: string) {
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
            const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
            document.onmousemove = (event: MouseEvent) => {
                const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                const newWidth = Math.round(startWidth + (startDate - event.pageX));
                if (newStartDate > 0 && newWidth > 1) {
                    eventTarget.setAttribute('x', newStartDate);
                    fillTarget.setAttribute('x', newStartDate);
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
            document.onmouseup = function (event: MouseEvent) {
                GCMediator.dispatch({
                    type: 'editTask',
                    data: {
                        duration: Math.round(eventTarget.getAttribute('width') / GCMediator.getState().tasklineCellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / GCMediator.getState().tasklineCellCapacity)
                    }
                })
                GCMediator.dispatch({ type: 'stopDragging' })
                this.clearTempElements(event)
            }.bind(this)
        }
    }

    public static deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i] + 'TLI');
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'tasklineBarBody');
            }
        }
    }

    public render() {
        const position = this.state.position;
        const id = this.props.data.id;
        const startDate = this.state.startDate * this.state.columnWidth;
        const duration = this.state.duration * this.state.columnWidth;

        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.clearTempElements.bind(this),
            onContextMenu: this.contextMenu.bind(this),
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
                width: duration
            }))),
            React.createElement('rect', {
                className: 'tasklineBarBody',
                id: id,
                x: startDate,
                y: 1.5,
                width: duration
            }),
            React.createElement('text', {
                className: 'taskLineTaskTitle',
                x: startDate,
                width: duration,
                clipPath: `url(#${id}clipPath)`,
                y: 12
            }, `${this.props.data.name} - ${this.props.data.description}`),
            React.createElement('text', {
                className: 'taskLineTaskDate',
                x: startDate,
                width: duration,
                clipPath: `url(#${id}clipPath)`,
                y: 24
            }, this.state.date)
        );
    }
}
