import * as React from 'react';
import {AppMediator} from '../../../scripts/services/ApplicationMediator'
import {ChartBar} from '../GanttBar'

const GCMediator: any = AppMediator.getInstance();

export class TasklineCallouts extends ChartBar {

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
