import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';
import {ChartBar} from '../GanttBar';

const GCMediator: any = AppMediator.getInstance();

export class TasklineMilestone extends ChartBar {

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
