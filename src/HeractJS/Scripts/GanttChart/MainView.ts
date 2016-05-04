/// <reference path='../../typings/main.d.ts' />

import * as React from 'react';
import * as DOM from 'react-dom';

import {TaskBar} from './TaskBar'
import {TaskLink} from './TaskLink'
import {InfoPopup} from './Popups/InfoPopup'
import {ActionChartPopup} from './Popups/ActionChartPopup'
import {ActionTasklinePopup} from './Popups/ActionTasklinePopup'
import {ModalWindow} from './Popups/ModalWindow'
import {Timeline}  from './Timeline'
import {GanttToolbar}  from './Toolbar'
import {TaskLineView}  from './Taskline/TaskLine'
import {AppMediator} from '../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class ChartView extends React.Component<any, any> {

    constructor() {
        super();
        const gridCapacity = Math.round(document.documentElement.clientHeight / 24);
        this.state = {
            timeLine: GCMediator.getState().timeLine,
            columnWidth: GCMediator.getState().columnWidth,
            elementHeight: 24,
            displayingElements: [],
            displayingLinks: [],
            gridCapacity: gridCapacity,
            batchSize: 30,
            startPosition: 0,
            endPosition: gridCapacity + 30,
            isCtrlPressed: false
        };
        document.onkeydown = function (event: MouseEvent) {
            if (event.ctrlKey) {
                this.setState({
                    isCtrlPressed: true
                });
            }
        }.bind(this);
        document.onkeyup = function () {
            this.setState({
                isCtrlPressed: false
            });
        }.bind(this);
        document.onwheel = function (event: any) {
            event.preventDefault();
            event.stopPropagation();
            if (this.state.isCtrlPressed) {
                this.updateTimeline();
            } else {
                const currentScroll = GCMediator.getState().scrollPosition;
                let scrollPosition = Math.round(event.deltaY / 22) + currentScroll;
                if (scrollPosition <= 0 && currentScroll !== 0) {
                    scrollPosition = 0;
                }

                if (scrollPosition >= 0) {
                    GCMediator.dispatch({
                        type: 'scrollGrid',
                        data: scrollPosition
                    });
                    this.buildElements(scrollPosition);
                }
            }
        }.bind(this);
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'removeTask':
                    case 'createTask':
                    case 'editTask':
                        this.updateElements(change.data);
                        break;
                    case 'selectTask':
                        TaskBar.selectTask(change.data);
                        break;
                    case 'deselectAllTasks':
                        if (change.data) {
                            TaskBar.deselectAllTasks(change.data);
                        }
                        break;
                    case 'scrollGrid':
                        this.scrollChart(change.data);
                        break;
                    case 'setTimelineStep':
                        this.setState({
                            timeLine: GCMediator.getState().timeLine,
                            columnWidth: GCMediator.getState().columnWidth
                        });
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    public selectTask(index: string) {
        TaskBar.selectTask(index);
    }

    public deselectAllTasks(tasks) {
        TaskBar.deselectAllTasks(tasks);
    }

    private componentDidMount() {
        this.rebuildElements();

        document.getElementById('ganttChart').onmousedown = (event: MouseEvent) => {
            const eventTarget = event.target as any;

            if (eventTarget.classList[0] === 'barSelectBody' && eventTarget.tagName !== 'BUTTON') {
                const view: any = document.getElementById('ganttChart');
                const timeline: any = document.getElementById('timelineContainer');
                const startScroll = view.scrollLeft;
                const startPoint = event.pageX;
                const currentState = GCMediator.getState();
                document.onmousemove = (event: MouseEvent) => {
                    if (!currentState.isPanning) {
                        //GCMediator.dispatch({ type: 'deselectAllTasks' })
                        GCMediator.dispatch({ type: 'startPanning' });
                        document.body.style.webkitUserSelect = 'none';
                    }
                    view.scrollLeft = startPoint - event.pageX + startScroll;
                    timeline.scrollLeft = startPoint - event.pageX + startScroll;
                };
                document.onmouseup = () => {
                    GCMediator.dispatch({ type: 'stopPanning' });
                    document.body.style.webkitUserSelect = 'inherit';
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        };

        document.onclick = (event: MouseEvent) => {
            const currentState = GCMediator.getState();
            const eventTarget = event.target as any;

            currentState.ganttChartView.refs.infoPopup.hide();
            currentState.ganttChartView.refs.modalWindow.hide();
            currentState.ganttChartView.refs.actionChartPopup.hide();
            currentState.ganttChartView.refs.actionTasklinePopup.hide();

            if (eventTarget.tagName !== 'BUTTON') {
                GanttToolbar.hideViewModeDropdown();
            }
        }
    }

    private shouldComponentUpdate(nextProps: any, nextState: any) {
        if (this.state.displayingElements !== nextState.displayingElements ||
            this.state.timeLine !== nextState.timeLine ||
            this.state.displayingLinks !== nextState.displayingLinks) {
            return true;
        } else {
            return false;
        }
    }

    private scrollChart(position: number) {
        const view: any = document.getElementById('ganttChart');
        view.scrollTop = 24 * position;
    }

    private updateTimeline() {
        const currentState = GCMediator.getState();
        switch (GCMediator.getState().timelineStep) {
            case 0:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 1
                });
                break;
            case 1:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 2
                });
                break;
            case 2:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 3
                });
                break;
            case 3:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 0
                });
                break;
            default:
                this.state.timelineData = currentState.timelineDay;
        }
    }

    private buildElements(scrollPosition: number) {
        let elements: any[];
        let startPos = this.state.startPosition;
        let endPos = this.state.endPosition;
        const batchSize = this.state.batchSize;
        const items = GCMediator.getState().items;
        if (endPos - scrollPosition < 31 + batchSize || (startPos - scrollPosition < batchSize && startPos !== 0)) {
            const newStartPos = scrollPosition - batchSize;
            startPos = newStartPos > 0 ? newStartPos : 0;
            endPos = scrollPosition + 31 + batchSize;

            elements = items.slice(startPos, endPos);

            const container = document.getElementById('ganttChartView');
            container.style.height = (document.documentElement.clientHeight + this.state.elementHeight * endPos).toString();
            const links: any[] = [];
            for (let i = 0; i < elements.length - 2; i++) {
                if (elements[i].link) {
                    elements[i].link.from = elements[i].id;
                    links.push(elements[i].link);
                }
            }
            this.setState({
                displayingElements: elements,
                startPosition: startPos,
                endPosition: endPos
            }, function () {
                this.setState({
                    displayingLinks: links
                });
            }.bind(this));
        }
    }

    private rebuildElements() {
        let timelineTasks = GCMediator.getState().timelineTasks;
        let timelineMilestones = GCMediator.getState().timelineMilestones;
        let elements = GCMediator.getState().items.slice(this.state.startPosition, this.state.endPosition);
        let timelineCallouts = GCMediator.getState().timelineCallouts;
        const links = [];
        for (let i = 0; i < elements.length - 2; i++) {
            if (elements[i].link) {
                elements[i].link.from = elements[i].id;
                links.push(elements[i].link);
            }
        }

        for (let i = 0; i < elements.length - 2; i++) {
            if (elements[i].timelineDisplay) {
                if (elements[i].type !== 'milestone') {
                    timelineTasks.push(elements[i]);
                } else {
                    timelineMilestones.push(elements[i]);
                }
            } else if (elements[i].calloutDisplay) {
                timelineCallouts.push(elements[i])
            }
        }
        this.setState({
            displayingElements: elements
        },
            function () {
                this.setState({
                    displayingLinks: links
                })
            }.bind(this))

    }

    private updateElements(newData) {
        const selectedElement = GCMediator.getState().selectedTasks[0]
        let timelineTasks = GCMediator.getState().timelineTasks;
        let timelineMilestones = GCMediator.getState().timelineMilestones;
        let elements = GCMediator.getState().items.slice(this.state.startPosition, this.state.endPosition);
        let timelineCallouts = GCMediator.getState().timelineCallouts;
        const links = [];
        for (let i = 0; i < elements.length - 2; i++) {
            if (elements[i].link) {
                elements[i].link.from = elements[i].id;
                links.push(elements[i].link);
            }
        }
        if (selectedElement) {
            elements.find((element) => {
                if (element.id === selectedElement) {
                    if (element.type !== 'milestone') {
                        const elem = timelineTasks.find((task, index) => {
                            if (task.id === selectedElement && task.timelineDisplay) {
                                for (let prop in newData) {
                                    task[prop] = newData[prop]
                                }
                                return true
                            } else if (task.id === selectedElement) {
                                timelineTasks.splice(index, 1);
                                return true
                            }
                        })
                        if (!elem) {
                            timelineTasks.push(element)
                        }
                    } else {
                        const elem = timelineMilestones.find((task, index) => {
                            if (task.id === selectedElement && task.timelineDisplay) {
                                for (let prop in newData) {
                                    task[prop] = newData[prop]
                                }
                                return true
                            } else if (task.id === selectedElement) {
                                timelineMilestones.splice(index, 1);
                                return true
                            }
                        })
                        if (!elem) {
                            timelineTasks.push(element)
                        }
                    }
                    return true
                }
            })
            GCMediator.dispatch({ type: 'updateTimeline' })
            this.setState({
                displayingElements: elements
            },
                function () {
                    this.setState({
                        displayingLinks: links
                    })
                }.bind(this))
        }
    }

    public render() {
        const bars = this.state.displayingElements.map((ganttBar: any) => {
            return React.createElement(TaskBar, {
                key: ganttBar.id,
                data: ganttBar
            });
        });
        const links = this.state.displayingLinks.map((link: any) => {
            if (link) {
                return React.createElement(TaskLink, {
                    ref: link.id,
                    key: link.id,
                    data: link
                });
            }
        });
        const timeline = this.state.timeLine.map((timeLineItem: any) => {
            return React.createElement(Timeline, {
                key: timeLineItem.id,
                data: timeLineItem
            });
        });
        return React.createElement('div', {
            id: 'ganttChartContainer',
            className: 'ganttChartContainer'
        },
            React.createElement('div', {
                id: 'timelineContainer',
                className: 'timelineContainer'
            },
                React.createElement('svg', {
                    className: 'ganttTimeline',
                    id: 'ganttTimeline'
                }, timeline)),
            React.createElement('div', {
                id: 'ganttChart',
                className: 'ganttChart'
            },
                React.createElement(InfoPopup, {
                    ref: 'infoPopup'
                }),
                React.createElement(ActionChartPopup, {
                    ref: 'actionChartPopup'
                }),
                React.createElement(ActionTasklinePopup, {
                    ref: 'actionTasklinePopup'
                }),
                React.createElement(ModalWindow, {
                    ref: 'modalWindow'
                }),
                React.createElement('svg', {
                    className: 'ganttChartView',
                    id: 'ganttChartView'
                },
                    React.createElement('marker', {
                        id: 'triangle',
                        viewBox: '0 0 40 20',
                        refX: 20,
                        refY: 0,
                        markerUnits: 'strokeWidth',
                        markerWidth: 6,
                        markerHeight: 2,
                        orient: '0'
                    },
                        React.createElement('path', {
                            d: 'M 0 0 L 40 0 L 20 20 z'
                        })),
                    bars,
                    links
                )
            )
        );
    }
}

export class Initializer {
    constructor() {
        const mainView = DOM.render(React.createElement(ChartView), document.getElementsByClassName('js-module-region-right')[0]) as any;
        const toolbar = DOM.render(React.createElement(GanttToolbar), document.getElementsByClassName('js-module-gantt-toolbar')[0]) as any;
        const timeline = DOM.render(React.createElement(TaskLineView), document.getElementsByClassName('js-module-gantt-taskline')[0]) as any;
        GCMediator.dispatch({
            type: 'initGanttView',
            data: {
                chart: mainView,
                toolbar: toolbar,
                timeline: timeline
            }
        });
    }
}
