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
                    case 'setTimelineDateStep':
                        this.setState({
                            TasklineTimeItems: GCMediator.getState().timelineTimeItems
                        });
                        break;
                    case 'startDragging':
                        document.getElementsByClassName('tasklineBars')[0].style.transition = 'initial';
                        document.getElementsByClassName('tasklineMilestones')[0].style.transition = 'initial';
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private updateElements(newData: any = {}) {
        const currentState = GCMediator.getState();
        const selectedElementId = newData.selectedTask || currentState.selectedTasks[0].id;
        const selectedElementType = currentState.selectedTasks[0].type;
        const selectedElement = currentState.items.find((item: any) => {
            if (item.id === selectedElementId) {
                return true
            }
        });
        if (selectedElementType !== 'milestone') {
            const timelineTasks = currentState.timelineTasks;
            timelineTasks.find((task: any, index: number) => {
                if (task.id === selectedElementId && task.timelineDisplay) {
                    for (let prop in newData) {
                        task[prop] = newData[prop];
                    }
                    return true;
                } else if (task.id === selectedElementId) {
                    timelineTasks.splice(index, 1);
                    return true;
                }
            })
            const timelineCallouts = currentState.timelineCallouts;
            const callout = timelineCallouts.find((task: any, index: number) => {
                if (task.id === selectedElementId && !selectedElement.calloutDisplay) {
                    timelineCallouts.splice(index, 1);
                    return true;
                }
            })
            if (!callout && selectedElement.calloutDisplay) {
                timelineCallouts.push(selectedElement);
            }
        } else {
            const timelineMilestones = currentState.timelineMilestones;
            const elem = timelineMilestones.find((task: any, index: number) => {
                if (task.id === selectedElementId && task.timelineDisplay) {
                    for (let prop in newData) {
                        task[prop] = newData[prop];
                    }
                    return true;
                } else if (task.id === selectedElementId) {
                    timelineMilestones.splice(index, 1);
                    return true;
                }
            })
            if (!elem && selectedElement.timelineDisplay) {
                timelineMilestones.push(selectedElement);
            }
        }
        this.setState({
            tasklineTasks: GCMediator.getState().timelineTasks,
            tasklineMilestones: GCMediator.getState().timelineMilestones,
            tasklineCallouts: GCMediator.getState().timelineCallouts
        });
    }

    private startPanning(event: MouseEvent) {
        const eventTarget = event.target as any;
        if (eventTarget.parentNode.classList[0] === 'tasklineContainer') {
            const view: any = document.getElementById('tasklineContainer').parentElement;
            const startScroll = view.scrollLeft;
            const startPoint = event.pageX;
            GCMediator.dispatch({ type: 'startPanning' });
            document.body.style.webkitUserSelect = 'none';
            document.onmousemove = (moveEvent: MouseEvent) => {
                view.scrollLeft = startPoint - moveEvent.pageX + startScroll;
            }
            document.onmouseup = () => {
                GCMediator.dispatch({ type: 'stopPanning' });
                document.body.style.webkitUserSelect = 'inherit';
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }

    private startScrolling(event: MouseEvent) {
        if (event.ctrlKey) {
            this.updateDateline();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private updateDateline() {
        const currentState = GCMediator.getState();
        switch (GCMediator.getState().timelineDateStep) {
            case 0:
                GCMediator.dispatch({
                    type: 'setTimelineDateStep',
                    data: 1
                });
                break;
            case 1:
                GCMediator.dispatch({
                    type: 'setTimelineDateStep',
                    data: 2
                });
                break;
            case 2:
                GCMediator.dispatch({
                    type: 'setTimelineDateStep',
                    data: 3
                });
                break;
            case 3:
                GCMediator.dispatch({
                    type: 'setTimelineDateStep',
                    data: 0
                });
                break;
            default:
                this.state.timelineData = currentState.timelineDay;
        }
    }

    public render() {
        const tasklineTimeline = this.state.TasklineTimeItems.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineTimeItem, {
                key: itemData.id,
                data: itemData
            } as React.DOMAttributes);
        });
        const tasklineBars = this.state.tasklineTasks.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineBar, {
                key: itemData.id,
                data: itemData
            } as React.DOMAttributes);
        });
        const tasklineMilestones = this.state.tasklineMilestones.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineMilestone, {
                key: itemData.id,
                data: itemData
            } as React.DOMAttributes);
        });
        const tasklineCallouts = this.state.tasklineCallouts.map((timeLineItem: any) => {
            const itemData = objectConstuctor.assign({}, timeLineItem)
            itemData.id += 'TLI'
            return React.createElement(TasklineCallouts, {
                key: itemData.id,
                data: itemData
            } as React.DOMAttributes);
        });
        return React.createElement('div', {
            id: 'tasklineContainer',
            className: 'tasklineContainer',
            onMouseDown: this.startPanning.bind(this),
            onWheel: this.startScrolling.bind(this)
        } as React.DOMAttributes,
            React.createElement('svg', {
                className: 'taskLineCallouts',
                id: 'taskLineCallouts'
            } as React.DOMAttributes, tasklineCallouts),
            React.createElement('svg', {
                className: 'tasklineTimeline',
                id: 'tasklineTimeline'
            } as React.DOMAttributes, tasklineTimeline),
            React.createElement('svg', {
                className: 'tasklineBars',
                id: 'tasklineBars'
            } as React.DOMAttributes, tasklineBars),
            React.createElement('svg', {
                className: 'tasklineMilestones',
                id: 'tasklineMilestones'
            } as React.DOMAttributes, tasklineMilestones));
    }
};
