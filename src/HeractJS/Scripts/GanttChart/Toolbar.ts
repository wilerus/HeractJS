import React = require('react')

import {AppMediator} from '../../scripts/services/AppMediator'

let GCMediator: any = AppMediator.getInstance()

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

        GCMediator.subscribe(function () {
            let change = GCMediator.getLastChange()
            if (change) {
                switch (change.type) {
                    case 'selectTask':
                        this.showTaskActions()
                        break

                    case 'removeTask':
                        this.hideTaskActions()
                        break

                    default:
                        break
                }
            }
        }.bind(this))
    }
    private componentDidMount() {
        this.hideTaskActions()
    }
    private hideTaskActions() {
        document.getElementById('removeTaskButton').style.display = 'none'
        document.getElementById('moveToTaskButton').style.display = 'none'
        document.getElementById('addLinkButton').style.display = 'none'
        document.getElementById('completeTaskButton').style.display = 'none'
        document.getElementById('reopenTaskButton').style.display = 'none'
    }

    private showTaskActions() {
        document.getElementById('removeTaskButton').style.display = 'initial'
        document.getElementById('moveToTaskButton').style.display = 'initial'
        document.getElementById('addLinkButton').style.display = 'initial'
        document.getElementById('completeTaskButton').style.display = 'initial'
        document.getElementById('reopenTaskButton').style.display = 'initial'
    }

    private undo() {
        GCMediator.undo()
    }

    private redo() {
        GCMediator.redo()
    }

    private removeTask() {
        GCMediator.dispatch({
            type: 'removeTask'
        })
    }

    private createTask() {
        GCMediator.dispatch({ type: 'createTask' })
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
            data: ''
        })
    }

    private removeLink() {
        GCMediator.dispatch({
            type: 'removeLink',
            data: ''
        })
    }

    private completeTask() {
        GCMediator.dispatch({
            type: 'completeTask',
            data: ''
        })
    }

    private reopenTask() {
        GCMediator.dispatch({
            type: 'updateScrollPosition',
            data: ''
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
                id: 'removeTaskButton',
                onClick: this.removeTask.bind(this)
            }, 'Remove task'),
            React.createElement('button', {
                className: 'toolbarButton',
                onClick: this.createTask.bind(this)
            }, 'Create task'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'moveToTaskButton',
                onClick: this.moveToTask.bind(this)
            }, 'Move to task'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'addLinkButton',
                onClick: this.addLink.bind(this)
            }, 'Add link'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'removeLinkButton',
                onClick: this.removeLink.bind(this)
            }, 'Remove link'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'completeTaskButton',
                onClick: this.completeTask.bind(this)
            }, 'Complete task'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'reopenTaskButton',
                onClick: this.reopenTask.bind(this)
            }, 'Reopen task')
        )
    }
}
