/// <reference path='../../typings/main.d.ts' />

import React = require('react')
import DOM = require('react-dom')

import {GlobalStore} from './GlobalStore';
import {ChartData} from './ChartData';
import {TaskBar} from './TaskBar';
import {TaskLink} from './TaskLink';
import {InfoPopup} from './InfoPopup';
import {ModalWindow} from './ModalWindow';
import {Timeline}  from './Timeline';

GlobalStore.timelineStep = 0

// gannt bars wrapper
class ChartView extends React.Component<any, any> {
    constructor() {
        super()
        new ChartData()
    }

    private componentWillMount() {
        this.setState({
            ganttBars: this.props.ganttBars,
            timeLine: this.props.timeLine
        })
    }

    updateTimeline() {
        switch (GlobalStore.timelineStep) {
            case 0:
                GlobalStore.timelineStep = 1
                GlobalStore.cellCapacity = 40 / 72
                GlobalStore.ganttChartView.setState({
                    timeLine: ChartData.timelineMonth
                })
                break;
            case 1:
                GlobalStore.timelineStep = 2
                GlobalStore.cellCapacity = 50 / 720
                GlobalStore.ganttChartView.setState({
                    timeLine: ChartData.timelineYear
                })
                break;
            case 2:
                GlobalStore.timelineStep = 3
                GlobalStore.cellCapacity = 50 / 3
                GlobalStore.ganttChartView.setState({
                    timeLine: ChartData.timelineDay
                })
                break;
            case 3:
                GlobalStore.timelineStep = 0
                GlobalStore.cellCapacity = 60 / 24
                GlobalStore.ganttChartView.setState({
                    timeLine: ChartData.timelineWeek
                })
                break;
            default:
                this.state.timelineData = ChartData.timelineDay
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
                    width: GlobalStore.svgGridWidth,
                    height: 50,
                    patternUnits: 'userSpaceOnUse'
                }, React.createElement('rect', {
                    width: GlobalStore.svgGridWidth,
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

GlobalStore.ganttChartView = DOM.render(React.createElement(ChartView, {
    ganttBars: ChartData.ganttBars,
    timeLine: ChartData.timelineWeek
}), document.getElementById('gantChartView')) as any
