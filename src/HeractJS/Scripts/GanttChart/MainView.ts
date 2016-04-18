/// <reference path='../../typings/main.d.ts' />

import React = require('react')
import DOM = require('react-dom')

import {TaskBar} from './TaskBar'
import {TaskLink} from './TaskLink'
import {InfoPopup} from './InfoPopup'
import {ModalWindow} from './ModalWindow'
import {Timeline}  from './Timeline'
import {GanttToolbar}  from './Toolbar'
import {TaskLineView}  from './TaskLine'
import {AppMediator} from '../../scripts/services/AppMediator'

let GCMediator: any = AppMediator.getInstance()

export class ChartView extends React.Component<any, any> {

    constructor() {
        super()
        const gridCapacity = Math.round(document.documentElement.clientHeight / 22)
        const items = GCMediator.getState().items;
        const displayingElements = items.slice(0, gridCapacity + 30)

        this.state = {
            timeLine: GCMediator.getState().timeLine,
            elementHeight: 22,
            displayingElements: displayingElements,
            displayingLinks: [],
            gridCapacity: gridCapacity,
            batchSize: 30,
            startPosition: 0,
            endPosition: gridCapacity + 30,
            isCtrlPressed: false
        }

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
                const currentScroll = GCMediator.getState().scrollPosition
                let scrollPosition = Math.round(event.deltaY / 22) + currentScroll

                if (scrollPosition < 0 && currentScroll !== 0) {
                    scrollPosition = 0
                }

                if (scrollPosition >= 0) {
                    GCMediator.dispatch({
                        type: 'scrollGrid',
                        data: scrollPosition
                    })

                    this.buildElements(scrollPosition)
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
                    case 'removeLink':
                    case 'completeTask':
                    case 'reopenTask':
                        this.rebuildElements()
                        break

                    case 'selectTask':
                        TaskBar.selectTask(change.data)
                        break

                    case 'deselectAllTasks':
                        if (change.data) {
                            TaskBar.deselectAllTasks(change.data)
                        }
                        break

                    case 'scrollGrid':
                        this.scrollChart(change.data)
                        break
                    case 'setTimelineStep':
                        this.setState({
                            timeLine: GCMediator.getState().timeLine
                        })
                        break

                    default:
                        break
                }
            }
        }.bind(this))
    }

    public selectTask(index: string) {
        TaskBar.selectTask(index)
    }

    public deselectAllTasks(tasks) {
        TaskBar.deselectAllTasks(tasks)
    }

    private componentDidMount() {
        const container = document.getElementById('ganttChartView');
        container.style.height = (document.documentElement.clientHeight + this.state.elementHeight * this.state.batchSize).toString();
        const displayingElements = this.state.displayingElements
        const displayingLinks = []
        for (let i = 0; i < displayingElements.length - 1; i++) {
            if (displayingElements[i].link) {
                displayingElements[i].link.from = displayingElements[i].id
                displayingLinks.push(displayingElements[i].link)
            }
        }
        this.setState({
            displayingLinks: displayingLinks
        })
        document.getElementById('ganttChart').onmousedown = (event: MouseEvent) => {
            const eventTarget = event.target as any
            if (eventTarget.id === 'gridPattern') {
                const view: any = document.getElementById('ganttChart')
                const timeline: any = document.getElementById('timelineContainer')
                const startScroll = view.scrollLeft
                const startPoint = event.pageX

                GCMediator.dispatch({ type: 'deselectAllTasks' })
                GCMediator.dispatch({ type: 'startPanning' })
                document.body.style.webkitUserSelect = 'none'

                document.onmousemove = (event: MouseEvent) => {
                    view.scrollLeft = startPoint - event.pageX + startScroll
                    timeline.scrollLeft = startPoint - event.pageX + startScroll
                }

                document.onmouseup = () => {
                    GCMediator.dispatch({ type: 'stopPanning' })
                    document.body.style.webkitUserSelect = 'inherit'
                    document.onmousemove = null
                }
            }
        }
    }

    private shouldComponentUpdate(nextProps: any, nextState: any) {
        if (this.state.displayingElements !== nextState.displayingElements ||
            this.state.timeLine !== nextState.timeLine ||
            this.state.displayingLinks !== nextState.displayingLinks) {
            return true
        } else {
            return false
        }
    }

    private scrollChart(position: number) {
        const view: any = document.getElementById('ganttChart')
        view.scrollTop = 22 * position
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

    public buildElements(scrollPosition: number) {
        let elements = [] //
        const displayElements = this.state.displayingElements
        let startPos = this.state.startPosition
        let endPos = this.state.endPosition
        const items = GCMediator.getState().items
        if (scrollPosition - 15 <= startPos && startPos !== 0) {
            const startIndex = startPos - 10 > 0 ? startPos - 10 : 0
            const itemsToAdd = items.slice(startIndex, startIndex + 10)
            endPos -= (startPos - startIndex)
            startPos = startIndex

            elements = elements.concat(itemsToAdd, displayElements.slice(0, displayElements.length - 10))
        } else if (scrollPosition - 25 >= startPos) {
            const itemsToAdd = items.slice(endPos, endPos + 10)
            startPos += 10
            endPos += 10
            elements = elements.concat(displayElements.slice(10, displayElements.length), itemsToAdd)
        }
        if (elements.length) {
            const container = document.getElementById('ganttChartView')
            container.style.height = (document.documentElement.clientHeight + this.state.elementHeight * endPos).toString()
            const links = []
            for (let i = 0; i < elements.length - 1; i++) {
                if (elements[i].link) {
                    elements[i].link.from = elements[i].id
                    links.push(elements[i].link)
                }
            }
            this.setState({
                displayingElements: elements,
                startPosition: startPos,
                endPosition: endPos
            }, function () {
                this.setState({
                    displayingLinks: links
                })
            }.bind(this))
        }
    }

    public rebuildElements() {
        let elements = []
        const startPos = this.state.startPosition
        const endPos = this.state.endPosition
        const items = GCMediator.getState().items

        elements = items.slice(startPos, endPos)

        const links = []
        for (let i = 0; i < elements.length - 2; i++) {
            if (elements[i].link) {
                elements[i].link.from = elements[i].id
                links.push(elements[i].link)
            }
        }
        this.setState({
            displayingElements: elements
        }, function () {
            this.setState({
                displayingLinks: links
            }, function () {
                this.forceUpdate()
            }.bind(this))
        }.bind(this))
    }

    public render() {
        const bars = this.state.displayingElements.map((ganttBar: any) => {
            return React.createElement(TaskBar, {
                key: ganttBar.id,
                data: ganttBar
            })
        })

        const links = this.state.displayingLinks.map((link: any) => {
            if (link) {
                return React.createElement(TaskLink, {
                    ref: link.id,
                    key: link.id,
                    data: link
                })
            }
        })

        const timeline = this.state.timeLine.map((timeLineItem: any) => {
            return React.createElement(Timeline, {
                key: timeLineItem.id,
                data: timeLineItem
            })
        })
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
                React.createElement(ModalWindow, {
                    ref: 'modalWindow'
                }),
                React.createElement('svg', {
                    className: 'ganttChartView',
                    id: 'ganttChartView',
                    transform: 'translate(0, 0)'
                },
                    React.createElement('marker', {
                        id: 'triangle',
                        viewBox: '0 0 40 20',
                        refX: 20,
                        refY: 0,
                        markerUnits: 'strokeWidth',
                        markerWidth: 12,
                        markerHeight: 4,
                        orient: '0'
                    },
                        React.createElement('path', {
                            d: 'M 0 0 L 40 0 L 20 20 z'
                        })),
                    React.createElement('pattern', {
                        id: 'grid',
                        width: GCMediator.getState().svgGridWidth,
                        height: 22,
                        patternUnits: 'userSpaceOnUse'
                    },
                        React.createElement('rect', {
                            width: GCMediator.getState().svgGridWidth,
                            height: 22,
                            fill: 'url(#smallGrid)',
                            stroke: '#dfe4e8',
                            strokeWidth: '1'
                        })),
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
                    bars,
                    links
                )
            )
        )
    }
}

export class Initializer {
    constructor() {
        const mainView = DOM.render(React.createElement(ChartView), document.getElementsByClassName('js-module-region-right')[0]) as any
        const toolbar = DOM.render(React.createElement(GanttToolbar), document.getElementsByClassName('js-module-gantt-toolbar')[0]) as any
        const taskLine = DOM.render(React.createElement(TaskLineView), document.getElementsByClassName('js-module-gantt-taskline')[0]) as any
        GCMediator.dispatch({
            type: 'setGanttChartView',
            data: mainView
        })
        GCMediator.dispatch({
            type: 'setGanttToolbar',
            data: toolbar
        })
        //GCMediator.dispatch({
        //    type: 'setGantttTaskLine',
        //    data: taskLine
        //})
    }
}
