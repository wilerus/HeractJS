import React = require('react')
import DOM = require('react-dom')

import {globalStore} from './GCStore';
import {ganttChartData} from './GCDraftData';

export class ganttChartTimeline extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: '',
            isCtrlPressed: false
        }
    }

    private componentDidMount() {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            width: this.props.data.style.width,
            top: this.props.data.style.top,
            height: this.props.data.style.height,
            text: this.props.data.text
        })
    }

    private componentWillMount() {
        document.onkeydown = function (event) {
            if (event.ctrlKey) {
                this.setState({
                    isCtrlPressed: true
                })
            }
        }.bind(this)

        document.onwheel = function (event) {
            if (this.state.isCtrlPressed) {
                event.preventDefault();
                event.stopPropagation();
                switch (globalStore.timelineStep) {
                    case 0:
                        globalStore.timelineStep = 1
                        globalStore.cellCapacity = 40 / 72
                        globalStore.ganttChartView.setState({
                            timeLine: ganttChartData.timelineMonth
                        })
                        break;
                    case 1:
                        globalStore.timelineStep = 2
                        globalStore.cellCapacity = 50 / 720 
                        globalStore.ganttChartView.setState({
                            timeLine: ganttChartData.timelineYear
                        })
                        break;
                    case 2:
                        globalStore.timelineStep = 3
                        globalStore.cellCapacity = 50 / 3
                        globalStore.ganttChartView.setState({
                            timeLine: ganttChartData.timelineDay
                        })
                        break;
                    case 3:
                        globalStore.timelineStep = 0
                        globalStore.cellCapacity = 60 / 24
                        globalStore.ganttChartView.setState({
                            timeLine: ganttChartData.timelineWeek
                        })
                        break;
                    default:
                        this.state.timelineData = ganttChartData.timelineDay
                }
            }           
        }.bind(this)
    }

    render() {
        return React.createElement('g', {       
            y: this.state.top,
            x: this.state.marginLeft
        },
            React.createElement('rect', {
                y: this.state.top,
                x: this.state.marginLeft,
                width: this.state.width,
                height: this.state.height,
                stroke: 'rgb(100,100,100)',
                //strokeDasharray: '0, 90, 60, 90',
                strokeWidth: 0.5,
                fill: 'none'
            }),
            React.createElement('text', {
                className: 'timeLineText',
                fontSize:12,
                x: this.state.marginLeft + this.state.width * 0.5,
                y: this.state.top + 20
            }, this.state.text)
        )
    }
};
