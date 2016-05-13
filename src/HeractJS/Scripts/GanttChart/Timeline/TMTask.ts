import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';
import {ChartBar} from '../GanttBar';

const GCMediator: any = AppMediator.getInstance();

export class TasklineBar extends ChartBar {

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
                title: this.state.name,
                target: 'task'
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
