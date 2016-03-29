var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var GCStore_1 = require('./GCStore');
var GCDraftData_1 = require('./GCDraftData');
var ganttChartTimeline = (function (_super) {
    __extends(ganttChartTimeline, _super);
    function ganttChartTimeline() {
        _super.call(this);
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: '',
            isCtrlPressed: false
        };
    }
    ganttChartTimeline.prototype.componentDidMount = function () {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            width: this.props.data.style.width,
            top: this.props.data.style.top,
            height: this.props.data.style.height,
            text: this.props.data.text
        });
    };
    ganttChartTimeline.prototype.componentWillMount = function () {
        document.onkeydown = function (event) {
            if (event.ctrlKey) {
                this.setState({
                    isCtrlPressed: true
                });
            }
        }.bind(this);
        document.onwheel = function (event) {
            if (this.state.isCtrlPressed) {
                event.preventDefault();
                event.stopPropagation();
                switch (GCStore_1.globalStore.timelineStep) {
                    case 0:
                        GCStore_1.globalStore.timelineStep = 1;
                        GCStore_1.globalStore.svgGridWidth = 40;
                        GCStore_1.globalStore.cellCapacity = 72;
                        GCStore_1.globalStore.cellSize = 40 / 72;
                        GCStore_1.globalStore.ganttChartView.setState({
                            timeLine: GCDraftData_1.ganttChartData.timelineMonth
                        });
                        break;
                    case 1:
                        GCStore_1.globalStore.timelineStep = 0;
                        GCStore_1.globalStore.svgGridWidth = 60;
                        GCStore_1.globalStore.cellCapacity = 24;
                        GCStore_1.globalStore.cellSize = 60 / 24;
                        GCStore_1.globalStore.ganttChartView.setState({
                            timeLine: GCDraftData_1.ganttChartData.timelineWeek
                        });
                        break;
                    default:
                        this.state.timelineData = GCDraftData_1.ganttChartData.timelineWeek;
                }
            }
        }.bind(this);
    };
    ganttChartTimeline.prototype.render = function () {
        return React.createElement('g', {
            y: this.state.top,
            x: this.state.marginLeft
        }, React.createElement('rect', {
            y: this.state.top,
            x: this.state.marginLeft,
            width: this.state.width,
            height: this.state.height,
            stroke: 'rgb(100,100,100)',
            strokeDasharray: '0, 90, 60, 90',
            strokeWidth: 0.5,
            fill: 'none'
        }), React.createElement('text', {
            className: 'timeLineText',
            x: this.state.marginLeft + this.state.width * 0.5,
            y: this.state.top + 20
        }, this.state.text));
    };
    return ganttChartTimeline;
})(React.Component);
exports.ganttChartTimeline = ganttChartTimeline;
;
