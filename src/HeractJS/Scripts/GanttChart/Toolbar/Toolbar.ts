import * as React from 'react';
import {AppMediator} from '../../../scripts/services/ApplicationMediator'

const GCMediator: any = AppMediator.getInstance();
const br = React.createFactory('br');
const button = React.createFactory('button');

export class GanttToolbar extends React.Component<any, any> {
    constructor() {
        super();

        this.state = {
            grid: document.getElementsByClassName('js-module-region-left')[0] as any,
            chart: document.getElementsByClassName('js-module-region-right')[0] as any,
            timeline: document.getElementsByClassName('js-module-gantt-taskline')[0] as any,
            wrapper: document.getElementsByClassName('content-wrapper')[0] as any,
            removeTaskButton: null,
            moveToTaskButton: null,
            addLinkButton: null,
            completeTaskButton: null,
            reopenTaskButton: null,
            removeLinkButton: null,
            redoButton: null,
            undoButton: null,
            createTaskButton: null
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
                    case 'hideAllPopups':
                        this.hideViewModeDropdown();
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private componentDidMount() {
        this.setState({
            chartCheckbox: document.getElementById('chartCheckbox'),
            gridCheckbox: document.getElementById('gridCheckbox'),
            removeTaskButton: document.getElementById('removeTaskButton'),
            moveToTaskButton: document.getElementById('moveToTaskButton'),
            addLinkButton: document.getElementById('addLinkButton'),
            completeTaskButton: document.getElementById('completeTaskButton'),
            reopenTaskButton: document.getElementById('reopenTaskButton'),
            removeLinkButton: document.getElementById('removeLinkButton'),
            redoButton: document.getElementById('redoButton'),
            undoButton: document.getElementById('undoButton'),
            createTaskButton: document.getElementById('createTaskButton'),
            viewModeSelector: document.getElementById('viewModeSelector')
        },function() {
            this.hideTaskActions();
        }.bind(this))
    }

    private hideTaskActions() {
        this.state.removeTaskButton.style.display = 'none';
        this.state.moveToTaskButton.style.display = 'none';
        this.state.addLinkButton.style.display = 'none';
        this.state.completeTaskButton.style.display = 'none';
        this.state.reopenTaskButton.style.display = 'none';
        this.state.removeLinkButton.style.display = 'none';
        this.state.redoButton.style.display = 'none';
        this.state.undoButton.style.display = 'none';
        this.state.createTaskButton.style.display = 'none';
    }

    private showTaskActions() {
        const currentState = GCMediator.getState();
        this.state.removeTaskButton.style.display = 'initial';
        this.state.moveToTaskButton.style.display = 'initial';
        if (currentState.selectedTasks[0] && currentState.selectedTasks.length > 0) {
            currentState.items.find((element) => {
                if (element.id === currentState.selectedTasks[0].id) {
                    if (element.link) {
                        document.getElementById('removeLinkButton').style.display = 'initial';
                    }
                    return true;
                }
            });

        }
        this.state.addLinkButton.style.display = 'initial';
        this.state.completeTaskButton.style.display = 'initial';
        this.state.reopenTaskButton.style.display = 'initial';
        this.state.createTaskButton.style.display = 'initial';
    }

    private showHistoryActions() {
        this.state.undoButton.style.display = 'initial';
        this.state.redoButton.style.display = 'initial';
    }

    private showViewModeDropdown() {
        this.state.viewModeSelector.style.display = 'initial';
        setTimeout(function() {
            this.state.viewModeSelector.style.opacity = '1';
            this.state.viewModeSelector.style.top = '62px';
        }.bind(this),10)
    }

    private hideViewModeDropdown() {
        this.state.viewModeSelector.style.opacity = '0';
        this.state.viewModeSelector.style.top = '30px';
        setTimeout(function () {
            this.state.viewModeSelector.style.display = 'none';
        }.bind(this),200)
    }

    private setGridVisibility(event: Event) {
        const eventTarget = event.currentTarget as any
        const chartCheckbox = this.state.chartCheckbox.checked;
        const chart = this.state.chart.style;
        const timeline = this.state.timeline.style;
        const wrapper = this.state.wrapper.style;
        const grid = this.state.grid.style;

        if (eventTarget.checked) {
            if (!chartCheckbox) {
                grid.width = '100%';
                wrapper.height = '100%';
                timeline.height = '166px';
            } else {
                grid.width = '40%';
                chart.width = '60%';
            }
        } else {
            if (!chartCheckbox) {
                wrapper.height = 0;
                timeline.height = '100%';
            } else {
                grid.width = '0';
                chart.width = '100%';
                wrapper.height = '100%';
            }
        }
    }

    private setChartVisibility(event: Event) {
        const eventTarget = event.currentTarget as any
        const gridCheckbox = this.state.gridCheckbox.checked;
        const chart = this.state.chart.style;
        const timeline = this.state.timeline.style;
        const wrapper = this.state.wrapper.style;
        const grid = this.state.grid.style;

        if (eventTarget.checked) {
            if (!gridCheckbox) {
                chart.width = '100%';
                timeline.height = '166px';
                wrapper.height = '100%';
            } else {
                grid.width = '40%';
                chart.width = '60%';
            }
        } else {
            if (!gridCheckbox) {
                wrapper.height = 0;
                timeline.height = '100%';
            } else {
                chart.width = '0';
                grid.width = '100%';
                wrapper.height = '100%';
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
            type: 'removeItem'
        });
    }

    private createTask() {
        GCMediator.dispatch({ type: 'createItem' });
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
        if (selectedTasks && selectedTasks.length) {
            currentState.items.find((element: any) => {
                if (element.id === selectedTasks[0].id) {
                    const elementIndex = currentState.items.indexOf(element);
                    if (currentState.items[elementIndex].link === null) {
                        GCMediator.dispatch({
                            type: 'editItem',
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
                type: 'editItem',
                data: ''
            });
        }
    }

    private removeLink() {
        GCMediator.dispatch({
            type: 'editItem',
            data: {
                link: null
            }
        });
        document.getElementById('removeLinkButton').style.display = 'none';
    }

    private completeTask() {
        GCMediator.dispatch({
            type: 'editItem',
            data: {
                progress: 100
            }
        });
    }

    private reopenTask() {
        GCMediator.dispatch({
            type: 'editItem',
            data: {
                progress: 0
            }
        });
    }

    public render() {
        return React.createElement('div', {
            id: 'toolbarContainer',
            className: 'toolbarContainer'
        } as React.DOMAttributes,
            button({
                className: 'toolbarButton',
                id: 'undoButton',
                onClick: this.undo.bind(this)
            } as React.DOMAttributes, 'Undo'),
            button({
                className: 'toolbarButton',
                id: 'redoButton',
                onClick: this.redo.bind(this)
            } as React.DOMAttributes, 'Redo'),
            button({
                className: 'toolbarButton',
                id: 'removeTaskButton',
                onClick: this.removeTask.bind(this)
            } as React.DOMAttributes, 'Remove task'),
            button({
                className: 'toolbarButton',
                id: 'createTaskButton',
                onClick: this.createTask.bind(this)
            } as React.DOMAttributes, 'Create task'),
            button({
                className: 'toolbarButton',
                id: 'moveToTaskButton',
                onClick: this.moveToTask.bind(this)
            } as React.DOMAttributes, 'Move to task'),
            button({
                className: 'toolbarButton',
                id: 'addLinkButton',
                onClick: this.addLink.bind(this)
            } as React.DOMAttributes, 'Add link'),
            button({
                className: 'toolbarButton',
                id: 'removeLinkButton',
                onClick: this.removeLink.bind(this)
            } as React.DOMAttributes, 'Remove link'),
            button({
                className: 'toolbarButton',
                id: 'completeTaskButton',
                onClick: this.completeTask.bind(this)
            } as React.DOMAttributes, 'Complete task'),
            button({
                className: 'toolbarButton',
                id: 'reopenTaskButton',
                onClick: this.reopenTask.bind(this)
            } as React.DOMAttributes, 'Reopen task'),
            button({
                className: 'toolbarButtonFixed',
                id: 'viewModeOpener',
                onClick: this.showViewModeDropdown.bind(this)
            } as React.DOMAttributes, 'View mode'),
            React.createElement('div', {
                className: 'viewModeSelector',
                id: 'viewModeSelector'
            } as React.DOMAttributes, React.createElement('label',{
                     id: 'gridLabel'
                } as React.DOMAttributes, 'Show grid:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'gridCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setGridVisibility.bind(this)
                } as React.DOMAttributes), br(), React.createElement('label',{
                     id: 'chartLabel'
                } as React.DOMAttributes, 'Show chart:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'chartCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setChartVisibility.bind(this)
                } as React.DOMAttributes), br(), React.createElement('label',{
                     id: 'timelineLabel'
                } as React.DOMAttributes, 'Show timeline:'),
                React.createElement('input', {
                    className: 'toolbarCheckbox',
                    id: 'timelineCheckbox',
                    type: 'checkbox',
                    defaultChecked: true,
                    onChange: this.setTimelineVisibility.bind(this)
                } as React.DOMAttributes)
            )
        );
    }
}
