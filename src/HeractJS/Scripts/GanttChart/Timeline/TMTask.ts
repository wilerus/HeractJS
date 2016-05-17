import * as React from 'react';
import {ChartBar} from '../GanttBar';

export class TasklineBar extends ChartBar {
    constructor(props: any, context: Object) {
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
            priority: data.priority,
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
            priority: data.priority,
            cellCapacity: this.appMediator.getState().tasklineCellCapacity
        });
    }

    public render() {
        const id = this.props.data.id;
        const startDate = this.state.startDate * this.state.cellCapacity;
        const duration = this.state.duration * this.state.cellCapacity;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('defs', {
            },
                React.createElement('clipPath', {
                    id: id + 'clipPath'
                },
                    this.rect({
                        className: 'clipRect',
                        id: id + 'clipRect',
                        x: startDate + 1,
                        height: 28,
                        width: duration - 2
                    })
                )
            ),
            this.rect({
                className: 'tasklineBarBody',
                id: id,
                x: startDate,
                y: 1.5,
                width: duration,
                filter: 'url(#shadowFilter)'
            }),
            this.text({
                className: 'taskLineTaskTitle',
                x: startDate + 2,
                width: duration - 2,
                clipPath: `url(#${id}clipPath)`,
                y: 13
            }, `${this.props.data.name} - ${this.props.data.description}`),
            this.text({
                className: 'taskLineTaskDate',
                x: startDate + 2,
                width: duration - 2,
                clipPath: `url(#${id}clipPath)`,
                y: 25
            }, this.state.date)
        );
    }
}
