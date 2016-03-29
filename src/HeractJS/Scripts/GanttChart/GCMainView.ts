/// <reference path='../../typings/main.d.ts' />

import React = require('react')
import DOM = require('react-dom')
import {globalStore} from './GCStore';
import {ganttChartData} from './GCDraftData';
import {ganttChartBar} from './GCBars';
import {ganttChartConnection} from './GCBars';
import {ganttChartInfoPopup} from './GCAdditions';
import {ganttChartModalWindow} from './GCAdditions';
import {ganttChartTimeline}  from './GCTimeline';

globalStore.timelineStep = 0

// gannt bars wrapper
class ganttChartView extends React.Component<any, any> {
    constructor() {
        super()
        new ganttChartData()
    }

    componentWillMount() {
        this.setState({
            ganttBars: this.props.ganttBars,
            timeLine: this.props.timeLine,
            gridWidth: globalStore.svgGridWidth
        })
    }

    render() {
        return React.createElement('div', {
            style: {
                width: '100%',
                height: '100%'
            }
        },
            React.createElement(ganttChartInfoPopup, {
                ref: 'infoPopup'
            }),
            React.createElement(ganttChartModalWindow, {
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
                    return React.createElement(ganttChartTimeline, {
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
                    width: this.state.gridWidth,
                    height: 50,
                    patternUnits: 'userSpaceOnUse'
                }, React.createElement('rect', {
                    width: this.state.gridWidth,
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
                this.state.ganttBars.map(function (ganttBar) {
                    if (ganttBar.type === 'bar') {
                        return React.createElement(ganttChartBar, {
                            key: ganttBar.id,
                            data: ganttBar,
                            gridWidth: this.state.gridWidth
                        })
                    } else if (ganttBar.type === 'connection') {
                        return React.createElement(ganttChartConnection, {
                            ref: ganttBar.id,
                            key: ganttBar.id,
                            data: ganttBar
                        })
                    }
                }.bind(this))
            )
        )
    }
};

globalStore.ganttChartView = DOM.render(React.createElement(ganttChartView, {
    ganttBars: ganttChartData.ganttBars,
    timeLine: ganttChartData.timelineWeek
}), document.getElementById('gantChartView')) as any
globalStore.cellCapacity = 24
