/// <reference path='../../typings/index.d.ts' />
import * as React from 'react';
import * as DOM from 'react-dom';
import {TaskBar} from './Chart/ChartBar'
import {TaskLink} from './Chart/ChartLink'
import {InfoPopup} from './Popups/InfoPopup'
import {ActionChartPopup} from './Popups/ActionChartPopup'
import {ActionTasklinePopup} from './Popups/ActionTasklinePopup'
import {ModalWindow} from './Popups/ModalWindow'
import {DateLine}  from './Chart/ChartDateline'
import {GanttToolbar}  from './Toolbar/Toolbar'
import {AppMediator} from '../../scripts/services/ApplicationMediator'

const GCMediator: any = AppMediator.getInstance();

export class ChartView extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            timeLine: GCMediator.getState().timeLine,
            elementHeight: 24,
            displayingElements: [],
            displayingLinks: [],
            batchSize: 30,
            startPosition: 0,
            endPosition: Math.round(document.documentElement.clientHeight / 24) + 30
        };
        GCMediator.subscribe(function () {
            const change: any = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'completeItemCreating':
                    case 'completeItemRemoving':
                        this.rebuildElements();
                        break;
                    case 'completeItemEditing':
                        this.updateElements(change.data);
                        break;
                    case 'scrollGrid':
                        this.scrollChart(change.data);
                        break;
                    case 'setTimelineStep':
                        this.setState({
                            timeLine: GCMediator.getState().timeLine
                        });
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private componentDidMount() {
        this.rebuildElements();
    }

    private shouldComponentUpdate(nextProps: any, nextState: any) {
        //if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
        //    return true;
        //} else {
        return true;
        //}
    }

    private scrollChart(position: number) {
        const view: any = document.getElementById('ganttChart');

        const difference = 24 * position - view.scrollTop;
        const perTick = difference / 30;
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
        const interval = setInterval(() => {
            view.scrollTop = view.scrollTop + perTick;
            if ((view.scrollTop >= 24 * position && perTick > 0) || (view.scrollTop <= 24 * position && perTick < 0)) {
                view.scrollTop = 24 * position;
                clearInterval(this.state.interval);
                this.state.interval = null;
            }
        }, 2)
        this.setState({
            interval: interval
        })
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
        const state = this.state;
        let startPos: number = state.startPosition;
        let endPos: number = state.endPosition;
        const batchSize: number = state.batchSize;
        let elements: any;
        if (endPos - scrollPosition < 31 + batchSize || (startPos - scrollPosition < batchSize && startPos !== 0)) {
            const newStartPos: number = scrollPosition - batchSize;
            startPos = newStartPos > 0 ? newStartPos : 0;
            endPos = scrollPosition + 31 + batchSize;
            elements = new GCMediator.getState().items.slice(startPos, endPos);
            document
                .getElementById('ganttChartView')
                .style.height = (document.documentElement.clientHeight + state.elementHeight * endPos).toString();

            this.setState({
                displayingElements: elements,
                startPosition: startPos,
                endPosition: endPos
            },
                function () {
                    const links: any[] = [];
                    for (let i = 0; i < elements.length - 2; i++) {
                        if (elements[i].link) {
                            elements[i].link.from = elements[i].id;
                            links.push(elements[i].link);
                        }
                    }
                    this.setState({
                        displayingLinks: links
                    });
                    GCMediator.dispatch({
                        type: 'scrollGrid',
                        data: scrollPosition
                    });
                }.bind(this));
        } else {
            GCMediator.dispatch({
                type: 'scrollGrid',
                data: scrollPosition
            });
        }
    }

    private rebuildElements() {
        const timelineTasks = GCMediator.getState().timelineTasks;
        const timelineMilestones = GCMediator.getState().timelineMilestones;
        const elements = GCMediator.getState().items.slice(this.state.startPosition, this.state.endPosition);
        const timelineCallouts = GCMediator.getState().timelineCallouts;
        const links: any[] = [];
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

    private startPanning(event: MouseEvent) {
        const eventTarget = event.target as any;

        if (eventTarget.classList[0] === 'barSelectBody' && eventTarget.tagName !== 'BUTTON') {
            const view: any = document.getElementById('ganttChart');
            const timeline: any = document.getElementById('timelineContainer');
            const startScroll: number = view.scrollLeft;
            const startPoint: number = event.pageX;
            const currentState: any = GCMediator.getState();
            document.onmousemove = (moveEvent: MouseEvent) => {
                if (!currentState.isPanning) {
                    GCMediator.dispatch({ type: 'startPanning' });
                    document.body.style.webkitUserSelect = 'none';
                }
                view.scrollLeft = startPoint - moveEvent.pageX + startScroll;
                timeline.scrollLeft = startPoint - moveEvent.pageX + startScroll;
            };
            document.onmouseup = () => {
                GCMediator.dispatch({ type: 'stopPanning' });
                document.body.style.webkitUserSelect = 'inherit';
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }

    private startScrolling(event: any) {
        if (event.ctrlKey) {
            this.updateTimeline();
        } else {
            const currentScroll: number = GCMediator.getState().scrollPosition;
            let scrollPosition: number = Math.round(event.deltaY / 24) + currentScroll;
            if (scrollPosition <= 0 && currentScroll !== 0) {
                scrollPosition = 0;
            }

            if (scrollPosition >= 0) {
                this.buildElements(scrollPosition);
            }
        }
        event.preventDefault();
        event.stopPropagation();
    }

    private updateElements(newData: any) {
        const state = this.state;
        const currentState = GCMediator.getState();
        const selectedElementId = (newData && newData.selectedTask) || currentState.selectedTasks[0].id;
        let startPos: number = state.startPosition;
        let endPos: number = state.endPosition;
        const elements = GCMediator.getState().items.slice(startPos, endPos);
        if (selectedElementId) {
            this.setState({
                displayingElements: elements
            },
                function () {
                    const links: any[] = [];
                    for (let i = 0; i < elements.length - 2; i++) {
                        if (elements[i].link) {
                            elements[i].link.from = elements[i].id;
                            links.push(elements[i].link);
                        }
                    }
                    this.setState({
                        displayingLinks: links
                    })
                }.bind(this))
        }
    }

    public render() {
        const bars: Array<TaskBar> = this.state.displayingElements.map((ganttBar: any) => {
            return React.createElement(TaskBar, {
                key: ganttBar.id,
                data: ganttBar
            });
        });
        const links: Array<TaskLink> = this.state.displayingLinks.map((link: any) => {
            if (link) {
                return React.createElement(TaskLink, {
                    ref: link.id,
                    key: link.id,
                    data: link
                });
            }
        });
        const timeline: Array<DateLine> = this.state.timeLine.map((timeLineItem: any) => {
            return React.createElement(DateLine, {
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
                className: 'ganttChart',
                onMouseDown: this.startPanning.bind(this),
                onWheel: this.startScrolling.bind(this)
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
                    React.createElement('defs', {
                    },
                        React.createElement('filter', {
                            id: 'shadowFilter',
                            x: 0,
                            y: 0,
                            width: '200%',
                            height: '200%'
                        },
                            React.createElement('feOffset', {
                                dx: '1',
                                dy: '1'
                            }),
                            React.createElement('feGaussianBlur', {
                                in: 'SourceAlpha',
                                stdDeviation: '2'
                            }),
                            React.createElement('feComponentTransfer', {
                            }, React.createElement('feFuncA', {
                                type: 'linear',
                                slope: '0.6'
                            })),
                            React.createElement('feBlend', {
                                in: 'SourceGraphic',
                                in2: 'blurOut',
                                mode: 'normal'
                            })
                        )
                    ),
                    React.createElement('defs', {
                    },
                        React.createElement('filter', {
                            id: 'shadowFilterHover',
                            x: 0,
                            y: 0,
                            width: '200%',
                            height: '200%'
                        },
                            React.createElement('feOffset', {
                                dx: '2',
                                dy: '2'
                            }),
                            React.createElement('feGaussianBlur', {
                                in: 'SourceAlpha',
                                stdDeviation: '3'
                            }),
                            React.createElement('feComponentTransfer', {
                            }, React.createElement('feFuncA', {
                                type: 'linear',
                                slope: '0.6'
                            })),
                            React.createElement('feBlend', {
                                in: 'SourceGraphic',
                                in2: 'blurOut',
                                mode: 'normal'
                            })
                        )
                    ),

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
