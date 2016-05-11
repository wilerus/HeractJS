import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineCallouts extends React.Component<any, any> {

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
            if (change && change.data && change.data.type === 'callout') {
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
                            type: 'callout'
                        }
                    });
                }
            } else {
                const id = this.state.id
                GCMediator.dispatch({
                    type: 'selectTask',
                    data: {
                        id: id.substring(0, id.length - 3),
                        type: 'callout'
                    }
                });
            }
        }
    }

    private startBarRelocation(event: MouseEvent) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const startX = event.clientX;
        document.onmousemove = function (event: MouseEvent) {
            if (Math.abs(event.clientX - startX) > 30) {
                const currentState = GCMediator.getState();
                const cellCapacity = currentState.cellCapacity;
                const startDate = this.state.startDate;
                const startPointStartDate = event.pageX - startDate * cellCapacity;
                document.onmousemove = function (event: MouseEvent) {
                    const newStartDate = (event.pageX - startPointStartDate) / cellCapacity;
                    this.setState({
                        startDate: newStartDate
                    });
                }.bind(this);
            }
        }.bind(this);
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

    private showActionPopup(event) {
        const coords = event.target.getBoundingClientRect();
        this.startTaskSelection();

        GCMediator.dispatch({
            type: 'showActionTimelinePopup',
            data: {
                left: coords.left + coords.width / 2 - 100,
                top: coords.top + 22,
                title: this.state.name,
                target: 'callout'
            }
        });
        event.preventDefault();
        event.stopPropagation();
    }

    private selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId);
        if (selectedElement && selectedElement.tagName === 'rect') {
            selectedElement.setAttribute('class', 'barChartBody barSelected');
        }
    }

    private deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i].id);
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'barChartBody');
            }
        }
    }

    public render() {
        const startDate = this.state.startDate * this.state.columnWidth;
        const duration = this.state.duration * this.state.columnWidth;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('defs', {
            }, React.createElement('clipPath', {
                id: this.props.data.id + 'clipPath'
            }, React.createElement('rect', {
                id: this.props.data.id + 'clipRect',
                x: this.state.startDate * this.state.columnWidth,
                height: 29,
                width: duration
            }))),
            React.createElement('path', {
                d: `M${startDate} 37 C ${startDate + 3} 32, ${startDate + 3} 32, ${startDate + 7} 32,
                    L${startDate + 7} 32, ${duration - 7 + startDate} 32,
                    M${duration + startDate - 7} 32 C ${duration - 3 + startDate} 32, ${duration + startDate - 3} 32, ${duration + startDate} 37`,
                stroke: 'rgb(200,200,200)',
                fill: 'transparent'
            }),
            React.createElement('text', {
                className: 'taskLineTaskTitle',
                x: startDate + duration / 2,
                textAnchor: 'middle',
                clipPath: `url(#${this.props.data.id}clipPath)`,
                width: duration,
                y: 14
            }, `${this.props.data.name} - ${this.props.data.description}`),
            React.createElement('text', {
                className: 'taskLineTaskDate',
                x: startDate + duration / 2,
                clipPath: `url(#${this.props.data.id}clipPath)`,
                textAnchor: 'middle',
                width: duration,
                y: 29
            }, 'This will be date')
        );
    }
}
