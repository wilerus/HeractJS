var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var ganttChartInfoPopup = (function (_super) {
    __extends(ganttChartInfoPopup, _super);
    function ganttChartInfoPopup() {
        _super.apply(this, arguments);
    }
    ganttChartInfoPopup.prototype.componentWillMount = function () {
        this.state = {
            left: 0,
            top: 0,
            title: 'title',
            startDate: 'Placeholder',
            endDate: 'Placeholder',
            duration: 'Placeholder'
        };
    };
    ganttChartInfoPopup.prototype.hide = function () {
        var item = DOM.findDOMNode(this);
        item.style.display = 'none';
    };
    ganttChartInfoPopup.prototype.show = function () {
        var item = DOM.findDOMNode(this);
        item.style.display = 'block';
    };
    ganttChartInfoPopup.prototype.render = function () {
        return React.createElement('div', {
            id: 'infoPopup',
            className: 'infoPopup',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        }, React.createElement('div', {
            className: 'infoPopupTitle',
        }, this.state.title), React.createElement('div', {
            className: 'infoPopupText',
        }, 'Description'), React.createElement('div', {
            className: 'infoPopupText',
        }, 'Start date ' + this.state.startDate + ' hours'), React.createElement('div', {
            className: 'infoPopupText',
        }, 'Complete date ' + this.state.endDate + ' hours'), React.createElement('div', {
            className: 'infoPopupText',
        }, 'Duration ' + this.state.duration + ' hours'));
    };
    return ganttChartInfoPopup;
})(React.Component);
exports.ganttChartInfoPopup = ganttChartInfoPopup;
;
var ganttChartModalWindow = (function (_super) {
    __extends(ganttChartModalWindow, _super);
    function ganttChartModalWindow() {
        _super.apply(this, arguments);
    }
    ganttChartModalWindow.prototype.componentWillMount = function () {
        this.state = {
            title: 'title',
            startDate: 'Placeholder',
            endDate: 'Placeholder',
            duration: 'Placeholder'
        };
    };
    ganttChartModalWindow.prototype.componentDidMount = function () {
    };
    ganttChartModalWindow.prototype.hide = function () {
        var item = DOM.findDOMNode(this);
        item.style.display = 'none';
    };
    ganttChartModalWindow.prototype.show = function () {
        var item = DOM.findDOMNode(this);
        item.style.display = 'flex';
    };
    ganttChartModalWindow.prototype.render = function () {
        return React.createElement('div', {
            id: 'modalWindowWrapper',
            className: 'modalWindowWrapper',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        }, React.createElement('div', {
            id: 'modalWindow',
            className: 'modalWindow',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        }, React.createElement('div', {
            className: 'infoPopupTitle',
        }, this.state.title), React.createElement('label', {
            htmlFor: 'modalWindowInputStart',
        }, 'Task start: '), React.createElement('input', {
            id: 'modalWindowInputStart',
            type: 'datetime-local',
            className: 'modalWindowInput',
            value: this.state.startDate
        }), React.createElement('label', {
            htmlFor: 'modalWindowInputFinish',
        }, 'Task finish: '), React.createElement('input', {
            id: 'modalWindowInputFinish',
            type: 'datetime-local',
            className: 'modalWindowInput',
            value: this.state.completeDate
        }), React.createElement('label', {
            htmlFor: 'modalWindowInputDuration',
        }, 'Task duration: '), React.createElement('input', {
            id: 'modalWindowInputDuration',
            type: 'datetime-local',
            className: 'modalWindowInput',
            value: this.state.completeDate
        }), React.createElement('button', {
            onMouseDown: this.hide.bind(this),
            id: 'modalWindowButtonOk',
            type: 'datetime-local',
            className: 'modalWindowButtonOk',
        }, 'Ok'), React.createElement('button', {
            onMouseDown: this.hide.bind(this),
            id: 'modalWindowButtonCancel',
            type: 'datetime-local',
            className: 'modalWindowButtonCancel',
        }, 'Cancel')));
    };
    return ganttChartModalWindow;
})(React.Component);
exports.ganttChartModalWindow = ganttChartModalWindow;
;
