import * as React from 'react';
import {ChartBar} from '../GanttBar';

export class TasklineMilestone extends ChartBar {
    constructor(props: any, context: Object) {
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
        const startDate = this.state.startDate * this.state.cellCapacity;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            this.rect({
                className: 'milestoneTimeline',
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
            this.text({
                className: 'barTitle',
                x: startDate - 40,
                y: 40
            }, 'This will be date')
        );
    }
}
