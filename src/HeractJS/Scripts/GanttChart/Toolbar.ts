import * as React from 'react';
import {AppMediator} from '../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();
let br = React.createFactory('br');

export class GanttToolbar extends React.Component<any, any> {

    constructor() {
        super();

        this.state = {
            grid: document.getElementsByClassName('js-module-region-left')[0] as any,
            chart: document.getElementsByClassName('js-module-region-right')[0] as any,
            timeline: document.getElementsByClassName('js-module-gantt-taskline')[0] as any,
            wrapper: document.getElementsByClassName('content-wrapper')[0] as any
        };
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                this.showHistoryActions();
                switch (change.type) {
                    case 'selectTask':
                        this.showTaskActions();
                        break;
                    case 'removeTask':
                        this.hideTaskActions();
                        break;
                    case 'deselectAllTasks':
                        this.hideTaskActions();
                        break;
                    case 'removeLink':
                        document.getElementById('removeLinkButton').style.display = 'none';
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private componentDidMount() {
        this.hideTaskActions();
        this.setState({
            chartCheckbox: document.getElementById('chartCheckbox'),
            gridCheckbox: document.getElementById('gridCheckbox')
        })
    }

    private hideTaskActions() {
        document.getElementById('removeTaskButton').style.display = 'none';
        document.getElementById('moveToTaskButton').style.display = 'none';
        document.getElementById('addLinkButton').style.display = 'none';
        document.getElementById('completeTaskButton').style.display = 'none';
        document.getElementById('reopenTaskButton').style.display = 'none';
        document.getElementById('removeLinkButton').style.display = 'none';
        document.getElementById('undoButton').style.display = 'none';
        document.getElementById('redoButton').style.display = 'none';
    }

    private showTaskActions() {
        const currentState = GCMediator.getState();
        document.getElementById('removeTaskButton').style.display = 'initial';
        document.getElementById('moveToTaskButton').style.display = 'initial';
        if (currentState.selectedTasks[0]) {
            const element = currentState.items.find((element) => { if (element.id === currentState.selectedTasks[0]) return true });
            if (element.link) {
                document.getElementById('removeLinkButton').style.display = 'initial';
            }
        }
        document.getElementById('addLinkButton').style.display = 'initial';
        document.getElementById('completeTaskButton').style.display = 'initial';
        document.getElementById('reopenTaskButton').style.display = 'initial';
    }

    private showHistoryActions() {
        document.getElementById('undoButton').style.display = 'initial';
        document.getElementById('redoButton').style.display = 'initial';
    }

    private showViewModeDropdown() {
        document.getElementById('viewModeSelector').style.opacity = '1';
        document.getElementById('viewModeSelector').style.top = '62px';
    }

    public static hideViewModeDropdown() {
        document.getElementById('viewModeSelector').style.opacity = '0';
        document.getElementById('viewModeSelector').style.top = '30px';
    }

    private setGridVisibility(event: Event) {
        const eventTarget = event.currentTarget as any
        if (eventTarget.checked) {
            if (!this.state.chartCheckbox.checked) {
                this.state.grid.style.width = '100%';
                this.state.wrapper.style.height = '100%';
                this.state.timeline.style.height = '166px';
            } else {
                this.state.grid.style.width = '40%';
                this.state.chart.style.width = '60%';
            }
        } else {
            if (!this.state.chartCheckbox.checked) {
                this.state.wrapper.style.height = 0;
                this.state.timeline.style.height = '100%';
            } else {
                this.state.grid.style.width = '0';
                this.state.chart.style.width = '100%';
                this.state.wrapper.style.height = '100%';
            }
        }
    }

    private setChartVisibility(event: Event) {
        const eventTarget = event.currentTarget as any
        if (eventTarget.checked) {
            if (!this.state.gridCheckbox.checked) {
                this.state.chart.style.width = '100%';
                this.state.timeline.style.height = '166px';
                this.state.wrapper.style.height = '100%';
            } else {
                this.state.grid.style.width = '40%';
                this.state.chart.style.width = '60%';
            }
        } else {
            if (!this.state.gridCheckbox.checked) {
                this.state.wrapper.style.height = 0;
                this.state.timeline.style.height = '100%';
            } else {
                this.state.chart.style.width = '0';
                this.state.grid.style.width = '100%';
                this.state.wrapper.style.height = '100%';
            }
        }

    }

    private setTimelineVisibility(event: Event) {
        const eventTarget = event.currentTarget as any
        if (eventTarget.checked) {
            this.state.timeline.style.height = '166px';
        } else {
            this.state.timeline.style.height = '0';
        }
    }

    private undo() {
        GCMediator.undo();
    }

    private redo() {
        GCMediator.redo();
    }

    private removeTask() {
        GCMediator.dispatch({
            type: 'removeTask'
        });
    }

    private createTask() {
        GCMediator.dispatch({ type: 'createTask' });
    }

    private moveToTask() {
        GCMediator.dispatch({
            type: 'moveToTask',
            task: ''
        });
    }

    private addLink() {
        const currentState = GCMediator.getState()
        const selectedTasks = currentState.selectedTasks;
        if (selectedTasks && selectedTasks[0]) {
            currentState.items.find((element: any) => {
                if (element.id === selectedTasks[0]) {
                    const elementIndex = currentState.items.indexOf(element);
                    if (currentState.items[elementIndex].link === null) {
                        GCMediator.dispatch({
                            type: 'editTask',
                            data: {
                                link: {
                                    id: `link${elementIndex}`,
                                    to: element.type === 'project' ? `bar${elementIndex + 10}` : `bar${elementIndex + 1}`,
                                    type: 'finishToStart'
                                }
                            }
                        });
                    }
                    return true;
                }
            });
        } else {
            GCMediator.dispatch({
                type: 'editTask',
                data: ''
            });
        }
    }

    private removeLink() {
        GCMediator.dispatch({
            type: 'editTask',
            data: {
                link: null
            }
        });
    }

    private completeTask() {
        GCMediator.dispatch({
            type: 'editTask',
            data: {
                progress: 100
            }
        });
    }

    private reopenTask() {
        GCMediator.dispatch({
            type: 'editTask',
            data: {
                progress: 0
            }
        });
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
            }, 'Reopen task'),
            React.createElement('button', {
                className: 'toolbarButtonFixed',
                id: 'viewModeOpener',
                onClick: this.showViewModeDropdown.bind(this)
            }, 'View mode'),
            React.createElement('div', {
                className: 'viewModeSelector',
                id: 'viewModeSelector'
            }, React.createElement('label', { id: 'gridLabel' }, 'Show grid:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'gridCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setGridVisibility.bind(this)
                }), br(), React.createElement('label', { id: 'chartLabel' }, 'Show chart:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'chartCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setChartVisibility.bind(this)
                }), br(), React.createElement('label', { id: 'timelineLabel' }, 'Show timeline:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'timelineCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setTimelineVisibility.bind(this)
                })
            )
        );
    }
}
