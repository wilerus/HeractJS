/// <reference path='../../typings/main.d.ts' />

import React = require('react')
import DOM = require('react-dom')

import {TaskBar} from './TaskBar';
import {TaskLink} from './TaskLink';
import {InfoPopup} from './InfoPopup';
import {ModalWindow} from './ModalWindow';
import {Timeline}  from './Timeline';
import {GanttChartMediator} from './GlobalStore';
import {ScrollBarMediator} from '../../scripts/services/ScrollBarMediator';

let GCMediator = GanttChartMediator.getInstance();
let SBMediator = ScrollBarMediator.getInstance();

GCMediator.dispatch({
    type: 'setTimelineStep',
    step: 0
})

// gannt bars wrapper
export class ChartView extends React.Component<any, any> {
    constructor() {
        super()

        SBMediator.onChanged('ganttChart', function (oldPosition, position) {
            this.updateScrollPosition(oldPosition, position)
            }.bind(this))
    }

    private componentWillMount() {
        this.updateGanttChart()
    }

    public updateGanttChart() {
        this.setState({
            ganttBars: GCMediator.getState().items,
            timeLine: GCMediator.getState().timeline
        })
    }

    private updateScrollPosition(oldPosition, position) {
        
    }

    updateTimeline() {
        let currentState = GCMediator.getState()
        switch (GCMediator.getState().timelineStep) {
            case 0:
                GCMediator.dispatch({
                    type: 'setTimeline',
                    step: 1
                })
                GCMediator.getState().cellCapacity = 40 / 72
                GCMediator.getState().ganttChartView.setState({
                    timeLine: currentState.timelineMonth
                })
                break;
            case 1:
                GCMediator.getState().timelineStep = 2
                GCMediator.getState().cellCapacity = 50 / 720
                GCMediator.getState().ganttChartView.setState({
                    timeLine: currentState.timelineYear
                })
                break;
            case 2:
                GCMediator.getState().timelineStep = 3
                GCMediator.getState().cellCapacity = 50 / 3
                GCMediator.getState().ganttChartView.setState({
                    timeLine: currentState.timelineDay
                })
                break;
            case 3:
                GCMediator.getState().timelineStep = 0
                GCMediator.getState().cellCapacity = 60 / 24
                GCMediator.getState().ganttChartView.setState({
                    timeLine: currentState.timelineWeek
                })
                break;
            default:
                this.state.timelineData = currentState.timelineDay
        }
    }

    render() {
        let items = this.state.ganttBars.map(function (ganttBar) {
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

        return React.createElement('div', {
            style: {
                width: '100%',
                height: '100%'
            }
        },
            React.createElement(InfoPopup, {
                ref: 'infoPopup'
            }),
            React.createElement(ModalWindow, {
                ref: 'modalWindow'
            }),
            React.createElement('svg', {
                className: 'ganttChartTimeline',
                id: 'ganttChartTimeline',
                style: {
                    width: '100%',
                    height: '100px'
                }
            },
                this.state.timeLine.map(function (timeLineItem) { // creating multiple elements from data
                    return React.createElement(Timeline, {
                        key: timeLineItem.id,
                        data: timeLineItem
                    })
                }.bind(this))
            ),
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
                    height: 50,
                    patternUnits: 'userSpaceOnUse'
                }, React.createElement('rect', {
                    width: GCMediator.getState().svgGridWidth,
                    height: 20,
                    fill: 'url(#smallGrid)',
                    stroke: '#aaaaaa',
                    strokeWidth: '0.5'
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
                items
                // )
            )
        )
    }
};

export class Initializer {
    constructor() {
        let mainView = DOM.render(React.createElement(ChartView), document.getElementsByClassName('js-module-region-right')[0]) as any

        GCMediator.dispatch({
            type: 'setGanttChartView',
            view: mainView
        })

        GCMediator.subscribe(() => {
            mainView.updateGanttChart();
        })
    }
};

