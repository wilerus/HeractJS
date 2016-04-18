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
            const change = GCMediator.getLastChange()
            if (change) {
                this.showHistoryActions()
                switch (change.type) {
                    case 'selectTask':
                        this.showTaskActions()
                        break

                    case 'removeTask':
                        this.hideTaskActions()
                        break

                    case 'deselectAllTasks':
                        this.hideTaskActions()
                        break

                    case 'removeLink':
                        document.getElementById('removeLinkButton').style.display = 'none'
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
        document.getElementById('removeLinkButton').style.display = 'none'
        document.getElementById('undoButton').style.display = 'none'
        document.getElementById('redoButton').style.display = 'none'
    }

    private showTaskActions() {
        const currentState = GCMediator.getState()
        document.getElementById('removeTaskButton').style.display = 'initial'
        document.getElementById('moveToTaskButton').style.display = 'initial'
        if (currentState.selectedTasks[0]) {
            const element = currentState.items.find((element) => { if (element.id === currentState.selectedTasks[0]) return true })
            if (element.link) {
                document.getElementById('removeLinkButton').style.display = 'initial'
            }
        }
        document.getElementById('addLinkButton').style.display = 'initial'
        document.getElementById('completeTaskButton').style.display = 'initial'
        document.getElementById('reopenTaskButton').style.display = 'initial'
    }

    private showHistoryActions() {
        document.getElementById('undoButton').style.display = 'initial'
        document.getElementById('redoButton').style.display = 'initial'
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
            type: 'reopenTask',
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
                id: 'undoButton',
                onClick: this.undo.bind(this)
            }, 'Undo'),
            React.createElement('button', {
                className: 'toolbarButton',
                id: 'redoButton',
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
