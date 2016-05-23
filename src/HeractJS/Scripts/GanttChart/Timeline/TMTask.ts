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
        const props = this.props as any;
        const id = props.data.id;
        const startDate = this.state.startDate * this.state.cellCapacity;
        const duration = this.state.duration * this.state.cellCapacity;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onContextMenu: this.showActionPopup.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onClick: this.startTaskSelection.bind(this)
        } as React.DOMAttributes,
            React.createElement('defs', {
            } as React.DOMAttributes,
                React.createElement('clipPath', {
                    id: id + 'clipPath'
                } as React.DOMAttributes,
                    this.rect({
                        className: 'clipRect',
                        id: id + 'clipRect',
                        x: startDate + 1,
                        height: 28,
                        width: duration
                    } as React.DOMAttributes)
                )
            ),
            this.rect({
                className: 'tasklineBarBody',
                id: id,
                x: startDate,
                y: 1.5,
                width: duration,
                filter: 'url(#shadowFilter)'
            } as React.DOMAttributes),
            this.text({
                className: 'taskLineTaskTitle',
                x: startDate + 2,
                width: duration,
                clipPath: `url(#${id}clipPath)`,
                y: 13
            } as React.DOMAttributes, `${props.data.name} - ${props.data.description}`),
            this.text({
                className: 'taskLineTaskDate',
                x: startDate + 2,
                width: duration,
                clipPath: `url(#${id}clipPath)`,
                y: 25
            } as React.DOMAttributes, this.state.date)
        );
    }
}
