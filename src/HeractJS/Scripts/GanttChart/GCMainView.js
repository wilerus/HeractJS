var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var GCStore_1 = require('./GCStore');
var GCDraftData_1 = require('./GCDraftData');
var GCBars_1 = require('./GCBars');
var GCBars_2 = require('./GCBars');
var GCAdditions_1 = require('./GCAdditions');
var GCAdditions_2 = require('./GCAdditions');
var GCTimeline_1 = require('./GCTimeline');
GCStore_1.globalStore.timelineStep = 0;
var ganttChartView = (function (_super) {
    __extends(ganttChartView, _super);
    function ganttChartView() {
        _super.call(this);
        new GCDraftData_1.ganttChartData();
    }
    ganttChartView.prototype.componentWillMount = function () {
        this.setState({
            ganttBars: this.props.ganttBars,
            timeLine: this.props.timeLine,
            gridWidth: GCStore_1.globalStore.svgGridWidth
        });
    };
    ganttChartView.prototype.render = function () {
        return React.createElement('div', {
            style: {
                width: '100%',
                height: '100%'
            }
        }, React.createElement(GCAdditions_1.ganttChartInfoPopup, {
            ref: 'infoPopup'
        }), React.createElement(GCAdditions_2.ganttChartModalWindow, {
            ref: 'modalWindow'
        }), React.createElement('svg', {
            className: 'ganttChartTimeline',
            id: 'ganttChartTimeline',
            style: {
                width: '100%',
                height: '100px'
            }
        }, this.state.timeLine.map(function (timeLineItem) {
            return React.createElement(GCTimeline_1.ganttChartTimeline, {
                key: timeLineItem.id,
                data: timeLineItem
            });
        }.bind(this))), React.createElement('svg', {
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
        })), React.createElement('pattern', {
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
        })), React.createElement('rect', {
            id: 'gridPattern',
            width: '100%',
            height: '100%',
            fill: 'url(#grid)'
        }), this.state.ganttBars.map(function (ganttBar) {
            if (ganttBar.type === 'bar') {
                return React.createElement(GCBars_1.ganttChartBar, {
                    key: ganttBar.id,
                    data: ganttBar,
                    gridWidth: this.state.gridWidth
                });
            }
            else if (ganttBar.type === 'connection') {
                return React.createElement(GCBars_2.ganttChartConnection, {
                    ref: ganttBar.id,
                    key: ganttBar.id,
                    data: ganttBar
                });
            }
        }.bind(this))));
    };
    return ganttChartView;
})(React.Component);
;
GCStore_1.globalStore.ganttChartView = DOM.render(React.createElement(ganttChartView, {
    ganttBars: GCDraftData_1.ganttChartData.ganttBars,
    timeLine: GCDraftData_1.ganttChartData.timelineWeek
}), document.getElementById('gantChartView'));
GCStore_1.globalStore.cellCapacity = 24;
