/// <reference path='../../typings/main.d.ts' />

import React = require('react')
import DOM = require('react-dom')

import {TaskBar} from './TaskBar'
import {TaskLink} from './TaskLink'
import {InfoPopup} from './InfoPopup'
import {ModalWindow} from './ModalWindow'
import {Timeline}  from './Timeline'
import {GanttToolbar}  from './Toolbar'
import {AppMediator} from '../../scripts/services/AppMediator'

let GCMediator: any = AppMediator.getInstance()

export class ChartView extends React.Component<any, any> {

    public selectTask(index: string) {
        TaskBar.selectTask(index)
    }

    public deselectAllTasks(tasks) {
        TaskBar.deselectAllTasks(tasks)
    }

    private componentWillMount() {
        const gridCapacity = Math.round(document.documentElement.clientHeight / 32)
        const items = GCMediator.getState().items;
        const displayingElements = items.slice(0, gridCapacity+5)
        this.setState({
            timeLine: GCMediator.getState().timeLine,
            elementHeight: 32,
            displayingElements: displayingElements,
            gridCapacity: gridCapacity,
            batchSize: 5,
            endPosition: gridCapacity + 5,
            isCtrlPressed: false
        })

        document.onkeydown = function (event: MouseEvent) {
            if (event.ctrlKey) {
                this.setState({
                    isCtrlPressed: true
                })
            }
        }.bind(this)

        document.onkeyup = function () {
            this.setState({
                isCtrlPressed: false
            })
        }.bind(this)

        document.onwheel = function (event: any) {
            event.preventDefault()
            event.stopPropagation()
            if (this.state.isCtrlPressed) {
                this.updateTimeline()
            } else {
                const scrollPosition = Math.round(event.deltaY / 32) + GCMediator.getState().scrollPosition
                if (scrollPosition >= 0) {
                    GCMediator.dispatch({
                        type: 'scrollGrid',
                        data: scrollPosition
                    })
                    const bottomElement = this.state.gridCapacity + scrollPosition
                    if (bottomElement > this.state.endPosition - 3) {
                        this.buildElements()
                    }
                }
            }
        }.bind(this)

        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange()
            if (change) {
                switch (change.type) {
                    case 'removeTask':
                    case 'createTask':
                    case 'editTask':
                        this.setState({
                            ganttBars: GCMediator.getState().items
                        })
                        this.forceUpdate()
                        break

                    case 'selectTask':
                        TaskBar.selectTask(change.data)
                        break

                    case 'deselectAllTasks':
                        TaskBar.deselectAllTasks(change.data)
                        break

                    case 'scrollGrid':
                        this.scrollChart(change.data)
                        break
                    default:
                        break
                }
            }

        }.bind(this))
    }

    private componentDidMount() {
        const container = document.getElementById('ganttChartView');
        container.style.height = (document.documentElement.clientHeight + this.state.elementHeight * this.state.batchSize).toString();
    }

    private shouldComponentUpdate(nextProps: any, nextState: any) {
        if (this.state.ganttBars !== nextState.ganttBars || this.state.timeLine !== nextState.timeLine) {
            return true
        } else {
            return false
        }
    }

    private scrollChart(position: number) {
        const view: any = document.getElementById('ganttChart')
         view.scrollTop = 32 * position
    }

    public updateTimeline() {
        const currentState = GCMediator.getState()
        switch (GCMediator.getState().timelineStep) {
            case 0:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 1
                })
                break
            case 1:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 2
                })
                break
            case 2:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 3
                })
                break
            case 3:
                GCMediator.dispatch({
                    type: 'setTimelineStep',
                    data: 0
                })
                break
            default:
                this.state.timelineData = currentState.timelineDay
        }
    }
    
    public buildElements() {
    debugger
        let elements = this.state.displayingElements
        let startPosition = this.state.displayingElements.length
        let endPosition = startPosition + this.state.batchSize
        let items = GCMediator.getState().items
        for (var i = startPosition; i < endPosition; i++) {
            elements.push(items[i])
        }
        this.setState({
            displayingElements: elements,
            endComponent: endPosition
        })
        const container = document.getElementById('ganttChartView');
        container.style.height = (document.documentElement.clientHeight + this.state.elementHeight * endPosition).toString();
        this.forceUpdate();
    }

    public render() {
        const chart = this.state.displayingElements.map(function (ganttBar: any) {
            if (ganttBar.type === 'bar') {
                return React.createElement(TaskBar, {
                    key: ganttBar.id,
                    data: ganttBar,
                    gridWidth: this.state.gridWidth
                })
            } else if (ganttBar.type === 'connection') {
                return React.createElement(TaskLink, {
                    ref: ganttBar.id,
                    key: ganttBar.id,
                    data: ganttBar
                })
            }
        }.bind(this))

        const timeline = this.state.timeLine.map((timeLineItem: any) => {
            return React.createElement(Timeline, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })
        return React.createElement('div', {
            id: 'ganttChartContainer',
            className: 'ganttChartContainer'
        }, React.createElement('div', {
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
                React.createElement(ModalWindow, {
                    ref: 'modalWindow'
                }),
                React.createElement('svg', {
                    className: 'ganttChartView',
                    id: 'ganttChartView',
                    transform: 'translate(0, 0)'
                }, React.createElement('marker', {
                    id: 'triangle',
                    viewBox: '0 0 20 20',
                    refX: 0,
                    refY: 5,
                    markerUnits: 'strokeWidth',
                    markerWidth: 4,
                    markerHeight: 3,
                    orient: 'auto'
                }, React.createElement('path', {
                    d: 'M 0 0 L 20 0 L 10 20 z'
                })),
                    React.createElement('pattern', {
                        id: 'grid',
                        width: GCMediator.getState().svgGridWidth,
                        height: 32,
                        patternUnits: 'userSpaceOnUse'
                    }, React.createElement('rect', {
                        width: GCMediator.getState().svgGridWidth,
                        height: 32,
                        fill: 'url(#smallGrid)',
                        stroke: '#dfe4e8',
                        strokeWidth: '1'
                    })
                    ),
                    React.createElement('rect', {
                        id: 'gridPattern',
                        width: '100%',
                        height: '100%',
                        fill: 'url(#grid)'
                    }),
                    //React.createElement('ReactCSSTransitionGroup', {
                    //    width: '1000px',
                    //    height: '1000px',
                    //    transitionName: "example",
                    //    transitionEnterTimeout: 500,
                    //    transitionLeaveTimeout: 500
                    //}, 

                    // )
                    chart
                )

            )
        )
    }
}

export class Initializer {
    constructor() {
        const mainView = DOM.render(React.createElement(ChartView), document.getElementsByClassName('js-module-region-right')[0]) as any
        const toolbar = DOM.render(React.createElement(GanttToolbar), document.getElementsByClassName('js-module-gantt-toolbar')[0]) as any

        GCMediator.dispatch({
            type: 'setGanttChartView',
            data: mainView
        })
        GCMediator.dispatch({
            type: 'setGanttToolbar',
            data: toolbar
        })
    }
}
