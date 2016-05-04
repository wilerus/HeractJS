import * as React from 'react';
import {TasklineTimeItem}  from './TasklineTimeItem'
import {TasklineBar}  from './TasklineBar'
import {TasklineMilestone}  from './TasklineMilestone'
import {TasklineCallouts} from './TasklineCallout'
import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();
let objectConstuctor = Object as any //just to get rid of console lint junk
export class TaskLineView extends React.Component<any, any> {

    constructor() {
        super();
        this.state = {
            TasklineTimeItems: GCMediator.getState().timelineTimeItems,
            tasklineTasks: GCMediator.getState().timelineTasks,
            tasklineMilestones: GCMediator.getState().timelineMilestones,
            tasklineCallouts: GCMediator.getState().timelineCallouts
        };

        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'removeTask':
                    case 'editTask':
                    case 'updateTimeline':
                        this.setState({
                            tasklineTasks: GCMediator.getState().timelineTasks,
                            tasklineMilestones: GCMediator.getState().timelineMilestones,
                            tasklineCallouts: GCMediator.getState().timelineCallouts
                        });
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private componentDidMount() {
        document.getElementById('tasklineContainer').onmousedown = (event: MouseEvent) => {
            const eventTarget = event.target as any;
            if (eventTarget.parentNode.classList[0] === 'tasklineContainer') {
                const view: any = document.getElementById('tasklineContainer').parentElement;
                const startScroll = view.scrollLeft;
                const startPoint = event.pageX;
                GCMediator.dispatch({ type: 'startPanning' });
                document.body.style.webkitUserSelect = 'none';
                document.onmousemove = (event: MouseEvent) => {
                    view.scrollLeft = startPoint - event.pageX + startScroll;
                }
                document.onmouseup = () => {
                    GCMediator.dispatch({ type: 'stopPanning' });
                    document.body.style.webkitUserSelect = 'inherit';
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    }

    public render() {
        const tasklineTimeline = this.state.TasklineTimeItems.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineTimeItem, {
                key: itemData.id,
                data: itemData
            });
        });
        const tasklineBars = this.state.tasklineTasks.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineBar, {
                key: itemData.id,
                data: itemData
            });
        });
        const tasklineMilestones = this.state.tasklineMilestones.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineMilestone, {
                key: itemData.id,
                data: itemData
            });
        });
        const tasklineCallouts = this.state.tasklineCallouts.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineCallouts, {
                key: itemData.id,
                data: itemData
            });
        });
        return React.createElement('div', {
            id: 'tasklineContainer',
            className: 'tasklineContainer'
        },
            React.createElement('svg', {
                className: 'taskLineCallouts',
                id: 'taskLineCallouts'
            }, tasklineCallouts),
            React.createElement('svg', {
                className: 'tasklineTimeline',
                id: 'tasklineTimeline'
            }, tasklineTimeline),
            React.createElement('svg', {
                className: 'tasklineBars',
                id: 'tasklineBars'
            }, tasklineBars),
            React.createElement('svg', {
                className: 'tasklineMilestones',
                id: 'tasklineMilestones'
            }, tasklineMilestones));
    }
};
