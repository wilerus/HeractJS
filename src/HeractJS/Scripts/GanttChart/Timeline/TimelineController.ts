import * as React from 'react';
import {TasklineTimeItem}  from './TMDateline'
import {TasklineBar}  from './TMTask'
import {TasklineMilestone}  from './TMMilestone'
import {TasklineCallouts} from './TMCallout'
import {AppMediator} from '../../../scripts/services/ApplicationMediator'

const GCMediator: any = AppMediator.getInstance();
const objectConstuctor = Object as any //just to get rid of console lint junk
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
                    case 'completeItemEditing':
                        this.updateElements(change.data)
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

    private updateElements(newData) {
        const currentState = GCMediator.getState();
        const selectedElementId = newData.selectedTask || currentState.selectedTasks[0].id;
        const selectedElementType = currentState.selectedTasks[0].type;
        const selectedElement = currentState.items.find((item: any) => {
            if (item.id === selectedElementId) {
                return true
            }
        });
        if (selectedElementId) {
            if (selectedElementType !== 'milestone') {
                let timelineTasks = currentState.timelineTasks;
                let elem = timelineTasks.find((task, index) => {
                    if (task.id === selectedElementId && task.timelineDisplay) {
                        for (let prop in newData) {
                            task[prop] = newData[prop]
                        }
                        return true
                    } else if (task.id === selectedElementId) {
                        timelineTasks.splice(index, 1);
                        return true
                    }
                })
                let timelineCallouts = currentState.timelineCallouts;
                let callout = timelineCallouts.find((task, index) => {
                    if (task.id === selectedElementId && !selectedElement.calloutDisplay) {
                        timelineCallouts.splice(index, 1);
                        return true
                    }
                })
                if (!callout && selectedElement.calloutDisplay) {
                    timelineCallouts.push(selectedElement)
                }
            } else {
                let timelineMilestones = currentState.timelineMilestones;
                let elem = timelineMilestones.find((task, index) => {
                    if (task.id === selectedElementId && task.timelineDisplay) {
                        for (let prop in newData) {
                            task[prop] = newData[prop]
                        }
                        return true
                    } else if (task.id === selectedElementId) {
                        timelineMilestones.splice(index, 1);
                        return true
                    }
                })
                if (!elem && selectedElement.timelineDisplay) {
                    timelineMilestones.push(selectedElement)
                }
            }
            this.setState({
                tasklineTasks: GCMediator.getState().timelineTasks,
                tasklineMilestones: GCMediator.getState().timelineMilestones,
                tasklineCallouts: GCMediator.getState().timelineCallouts
            });
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
