﻿import * as React from 'react';
import {ChartBar} from '../GanttBar';

export class TasklineCallouts extends ChartBar {
    constructor(props: any, context: Object) {
        super(props, context);
        this.state = {
            id: props.data.id,
            order: props.data.order,
            position: props.data.position,
            name: props.data.name,
            type: props.data.type,
            description: props.data.description,
            assignee: props.data.assignee,
            parent: props.data.parent,
            progress: props.data.progress,
            duration: props.data.duration,
            startDate: props.data.startDate,
            finish: props.data.finish,
            priority: props.data.priority,
            cellCapacity: this.appMediator.getState().tasklineCellCapacity
        };
    }

    public componentWillReceiveProps(nextProps: any) {
        const data = nextProps.data
        this.setState({
            id: data.id,
            order: data.order,
            collapsed: data.collapsed,
            position: data.position,
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
            priority: data.priority,
            cellCapacity: this.appMediator.getState().tasklineCellCapacity
        });
    }

    public render() {
        const startDate = this.state.startDate * this.state.cellCapacity;
        const duration = this.state.duration * this.state.cellCapacity;
        const props = this.props as any;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('defs', {},
                React.createElement('clipPath', {
                    id: props.data.id + 'clipPath'
                },
                    this.rect({
                        id: props.data.id + 'clipRect',
                        x: this.state.startDate * this.state.cellCapacity,
                        height: 29,
                        width: duration
                    })
                )
            ),
            React.createElement('path', {
                d: `M${startDate} 37 C ${startDate + 3} 32, ${startDate + 3} 32, ${startDate + 7} 32,
                    L${startDate + 7} 32, ${duration - 7 + startDate} 32,
                    M${duration + startDate - 7} 32 C ${duration - 3 + startDate} 32, ${duration + startDate - 3} 32, ${duration + startDate} 37`,
                stroke: 'rgb(150,150,150)',
                fill: 'transparent'
            }),
            this.text({
                className: 'taskLineTaskTitle',
                x: startDate + duration / 2,
                textAnchor: 'middle',
                clipPath: `url(#${props.data.id}clipPath)`,
                width: duration,
                y: 14
            }, `${props.data.name} - ${props.data.description}`),
            this.text({
                className: 'taskLineTaskDate',
                x: startDate + duration / 2,
                clipPath: `url(#${props.data.id}clipPath)`,
                textAnchor: 'middle',
                width: duration,
                y: 29
            }, 'This will be date')
        );
    }
}
