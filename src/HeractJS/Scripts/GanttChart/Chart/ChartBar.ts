import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';
import {ChartBar} from '../GanttBar';

const GCMediator: any = AppMediator.getInstance();

export class TaskBar extends ChartBar {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            id: props.data.id,
            order: props.data.order,
            collapsed: props.data.collapsed,
            position: props.data.position,
            calloutDisplay: props.data.calloutDisplay,
            timelineDisplay: props.data.timelineDisplay,
            link: props.data.link,
            name: props.data.name,
            type: props.data.type,
            description: props.data.description,
            assignee: props.data.assignee,
            parent: props.data.parent,
            predecessors: props.data.predecessors,
            progress: props.data.progress,
            duration: props.data.duration,
            startDate: props.data.startDate,
            finish: props.data.finish,
            priority: props.data.priority,
            columnWidth: GCMediator.getState().cellCapacity
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

    private showActionPopup(event: MouseEvent) {
        const eventTarget = event.target as any;
        const coords = eventTarget.getBoundingClientRect();
        let leftMargin: number;
        let topMargin: number = coords.top + 22;
        this.startTaskSelection();
        if (eventTarget.getAttribute('class') === 'barSelectBody barSelected') {
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
        event.preventDefault();
        event.stopPropagation();
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
        const startDate = this.state.startDate * this.state.columnWidth;
        const duration = this.state.duration * this.state.columnWidth;
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
                    onContextMenu: this.showActionPopup.bind(this),
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
                        ry: 3,
                        filter: 'url(#shadowFilter)'
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
                    onContextMenu: this.showActionPopup.bind(this),
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
                        ry: 3,
                        filter: 'url(#shadowFilter)'
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
                    onContextMenu: this.showActionPopup.bind(this),
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
                        x: length + 10,
                        y: position + 15
                    }, taskTitle)
                );
                break;
            default:
                break;
        }

        return element;
    }
}
