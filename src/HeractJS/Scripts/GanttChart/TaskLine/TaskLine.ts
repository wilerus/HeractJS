import React = require('react')

import {TasklineTimeItem}  from './TasklineTimeItem'
import {TasklineBar}  from './TasklineBar'
import {TasklineMilestone}  from './TasklineMilestone'
import {AppMediator} from '../../../scripts/services/AppMediator'
let GCMediator: any = AppMediator.getInstance()

export class TaskLineView extends React.Component<any, any> {

    constructor() {
        super()
        this.state = {
            TasklineTimeItems: GCMediator.getState().tasklineTimeItems,
            tasklineTasks: GCMediator.getState().tasklineTasks,
            tasklineMilestones: GCMediator.getState().tasklineMilestones,
            tasklineCallouts: GCMediator.getState().tasklineCallouts
        }

        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange()
            if (change) {
                switch (change.type) {
                    case 'addToTaskline':
                        this.setState({
                            tasklineTasks: GCMediator.getState().tasklineTasks,
                            tasklineMilestones: GCMediator.getState().tasklineMilestones,
                            tasklineCallouts: GCMediator.getState().tasklineCallouts
                        })
                        break

                    default:
                        break
                }
            }
        }.bind(this))
    }

    private componentDidMount() {
        document.getElementById('tasklineContainer').onmousedown = (event: MouseEvent) => {
            const view: any = document.getElementById('tasklineContainer').parentElement
            const startScroll = view.scrollLeft
            const startPoint = event.pageX

            GCMediator.dispatch({ type: 'startPanning' })
            document.body.style.webkitUserSelect = 'none'

            document.onmousemove = (event: MouseEvent) => {
                view.scrollLeft = startPoint - event.pageX + startScroll
            }

            document.onmouseup = () => {
                GCMediator.dispatch({ type: 'stopPanning' })
                document.body.style.webkitUserSelect = 'inherit'
                document.onmousemove = null
            }
        }
    }

    public render() {
        const tasklineTimeline = this.state.TasklineTimeItems.map((timeLineItem: any) => {
            timeLineItem.id += 'TLI'
            return React.createElement(TasklineTimeItem, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })

        const tasklineBars = this.state.tasklineTasks.map((timeLineItem: any) => {
            timeLineItem.id += 'TLI'
            return React.createElement(TasklineBar, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })

        const tasklineMilestones = this.state.tasklineMilestones.map((timeLineItem: any) => {
            timeLineItem.id += 'TLI'
            return React.createElement(TasklineMilestone, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })

        const tasklineCallouts = this.state.tasklineCallouts.map((timeLineItem: any) => {
            timeLineItem.id += 'TLI'
            return React.createElement(TasklineBar, {
                key: timeLineItem.id + 'TLI',
                data: timeLineItem
            })
        })

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
            }, tasklineMilestones))
    }
};
