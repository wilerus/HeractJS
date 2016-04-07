import React = require('react')

import {GanttChartMediator} from './Mediator';
let GCMediator: GanttChartMediator = GanttChartMediator.getInstance();

export class GanttToolbar extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: ''
        }
    }

    private undo() {
        GCMediator.undo()
    }

    private redo() {
        GCMediator.redo()
    }

    private removeTask() {
        GCMediator.dispatch({
            type: 'removeTask',
            task: ''
        })
    }

    private addTask() {
        GCMediator.dispatch({
            type: 'addTask',
            task: ''
        })
    }

    private moveToTask() {
        GCMediator.dispatch({
            type: 'moveToTask',
            task: ''
        })
    }

    private addLink() {
        GCMediator.dispatch({
            type: 'addLink',
            task: ''
        })
    }

    private removeLink() {
        GCMediator.dispatch({
            type: 'removeLink',
            task: ''
    })
    }

    private completeTask() {
        GCMediator.dispatch({
            type: 'completeTask',
            task: ''
    })
    }

    private reopenTask() {
        GCMediator.dispatch({
            type: 'updateScrollPosition',
            task: ''
        })
    }

    public render() {
        return React.createElement('div', {
            id: 'toolbarContainer',
            className: 'toolbarContainer'
        },
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.undo.bind(this)
            }, 'Undo'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.redo.bind(this)
            }, 'Redo'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.removeTask.bind(this)
            }, 'Remove task'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.addTask.bind(this)
            }, 'Add task'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.moveToTask.bind(this)
            }, 'Move to task'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.addLink.bind(this)
            }, 'Add link'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.removeLink.bind(this)
            }, 'Remove link'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.completeTask.bind(this)
            }, 'Complete task'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.reopenTask.bind(this)
            }, 'Reopen task')
        )
    }
};
