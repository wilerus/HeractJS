import * as React from 'react';
import {ChartBar} from '../GanttBar';

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
            cellCapacity: this.appMediator.getState().cellCapacity
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
            cellCapacity: this.appMediator.getState().cellCapacity
        });
    }

    public render() {
        let element: any;
        const position = this.state.position;
        const id = this.props.data.id;
        const startDate = this.state.startDate * this.state.cellCapacity;
        const duration = this.state.duration * this.state.cellCapacity;
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
                    this.rect({
                        className: 'barSelectBody',
                        y: position - 1,
                        x: 0
                    }),
                    this.rect({
                        className: 'barChartBody',
                        id: id,
                        y: position + 4,
                        x: startDate,
                        width: duration,
                        rx: 3,
                        ry: 3,
                        filter: 'url(#shadowFilter)'
                    }),
                    this.rect({
                        className: 'barChartFillBody',
                        y: position + 5,
                        x: startDate + 1,
                        width: progress
                    }),
                    this.text({
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
                    this.rect({
                        className: 'barSelectBody',
                        y: position - 1,
                        x: 0
                    }),
                    this.rect({
                        className: 'milestoneBody',
                        id: id,
                        y: position + 4,
                        x: startDate,
                        rx: 3,
                        ry: 3,
                        filter: 'url(#shadowFilter)'
                    }),
                    this.text({
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
                    this.rect({
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
                    this.text({
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
