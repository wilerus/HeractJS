import React = require('react')

import {TasklineTimeItem}  from './TasklineTimeItem'
import {AppMediator} from '../../scripts/services/AppMediator'
let GCMediator: any = AppMediator.getInstance()

export class TaskLineView extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            TasklineTimeItems: GCMediator.getState().tasklineTimeItems,
            TasklineBars: GCMediator.getState().tasklineBars
        }
    }

    public render() {
        const tasklineTimeline = this.state.TasklineTimeItems.map((timeLineItem: any) => {
            return React.createElement(TasklineTimeItem, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })

        //const tasklineBars = this.state.TasklineBars.map((timeLineItem: any) => {
        //    return React.createElement(TasklineTimeItem, {
        //        key: timeLineItem.id,
        //        data: timeLineItem
        //    })
        //})

        return React.createElement('div', {
            id: 'tasklineContainer',
            className: 'tasklineContainer'
        },
            React.createElement('svg', {
                className: 'taskLineCallouts',
                id: 'taskLineCallouts'
            }),
            React.createElement('svg', {
                className: 'tasklineTimeline',
                id: 'tasklineTimeline'
            }, tasklineTimeline),
            React.createElement('svg', {
                className: 'tasklineBars',
                id: 'tasklineBars'
            }), //,tasklineBars),
            React.createElement('svg', {
                className: 'tasklineMilestones',
                id: 'tasklineMilestones'
            }))
    }
};
