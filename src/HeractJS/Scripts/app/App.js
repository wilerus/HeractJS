var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var ganttBar = (function (_super) {
    __extends(ganttBar, _super);
    function ganttBar() {
        _super.call(this);
        this.state = {
            width: 100,
            marginLeft: 10,
            fillDivWidth: 10,
            elementText: 'Task 10'
        };
    }
    ganttBar.prototype.componentDidMount = function () {
        this.setState({ marginLeft: this.props.style.marginLeft });
    };
    ganttBar.prototype.onDragRight = function (e) {
        var newWidth = e.pageX - this.state.marginLeft;
        if (newWidth !== 0 && e.pageX !== 0) {
            this.setState({
                width: newWidth
            });
        }
    };
    ganttBar.prototype.onDragLeft = function (e) {
        var newMarginLeft = e.pageX;
        var newWidth = this.state.width - (e.pageX - this.state.marginLeft);
        if (newMarginLeft !== 0 && e.pageX !== 0) {
            this.setState({
                marginLeft: newMarginLeft,
                width: newWidth
            });
        }
    };
    ganttBar.prototype.onDragFill = function (e) {
        var newFillDivWidth = e.pageX - this.state.marginLeft;
        if (newFillDivWidth !== 0 && e.pageX !== 0) {
            this.setState({
                fillDivWidth: newFillDivWidth
            });
        }
    };
    ganttBar.prototype.render = function () {
        var el = React.createElement("div", {
            style: {
                position: 'relative',
                marginTop: '20px',
                marginBottom: '20px',
                top: this.props.style.top
            }
        }, React.createElement("div", {
            style: {
                position: 'absolute',
                borderRadius: '2px',
                width: this.state.width,
                marginLeft: this.state.marginLeft,
                height: '20px',
                backgroundColor: '#3db9d3',
                boxShadow: '0 0 5px #299cb4',
                border: '1px solid #2898b0'
            }
        }), React.createElement('div', {
            style: {
                position: 'absolute',
                color: 'rgb(255,255,255)',
                textShadow: '2px 2px rgb(0,0,0)',
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
                width: this.state.fillDivWidth,
                marginLeft: this.state.marginLeft,
                height: '21px',
                textAlign: 'center',
                backgroundColor: '#299cb4'
            }
        }), React.createElement("div", {
            style: {
                position: 'absolute',
                color: 'rgb(255,255,255)',
                width: this.state.width,
                marginLeft: this.state.marginLeft,
                marginTop: '2px',
                height: '20px',
                backgroundColor: 'transparent',
                textAlign: 'center'
            }
        }, this.props.text), React.createElement('div', {
            onDrag: this.onDragRight.bind(this),
            draggable: 'true',
            style: {
                position: 'absolute',
                color: 'rgb(255,255,255)',
                textShadow: '2px 2px rgb(0,0,0)',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                width: '10px',
                marginLeft: this.state.width + this.state.marginLeft - 10,
                textAlign: 'center',
                backgroundColor: 'rgba(155,100,100,0)'
            }
        }, '||'), React.createElement('div', {
            onDrag: this.onDragLeft.bind(this),
            draggable: 'true',
            style: {
                position: 'absolute',
                color: 'rgb(255,255,255)',
                textShadow: '2px 2px rgb(0,0,0)',
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
                width: '10px',
                marginLeft: this.state.marginLeft,
                textAlign: 'center',
                backgroundColor: 'rgba(155,100,100,0)'
            }
        }, '||'), React.createElement('div', {
            onDrag: this.onDragFill.bind(this),
            draggable: 'true',
            style: {
                position: 'absolute',
                color: 'rgba(0,0,0)',
                fontSize: '26px',
                marginTop: '19px',
                width: '20px',
                marginLeft: this.state.marginLeft + this.state.fillDivWidth - 10,
                textAlign: 'center',
                backgroundColor: 'rgba(155,100,100)'
            }
        }, '^'));
        return el;
    };
    return ganttBar;
})(React.Component);
;
var ganttChartBar = React.createFactory(ganttBar);
var ganttBars = [];
for (var i = 0; i < 10; i++) {
    var topMargin = 50 * i;
    var text = 'Task ' + i.toString();
    var leftMargin = 30 * i;
    ganttBars.push(ganttChartBar({
        id: 'id1',
        text: text,
        style: {
            top: topMargin,
            marginLeft: leftMargin
        }
    }));
}
var ganttChartView = (function (_super) {
    __extends(ganttChartView, _super);
    function ganttChartView() {
        _super.apply(this, arguments);
    }
    ganttChartView.prototype.render = function () {
        return React.createElement('div', {
            id: 'wrap'
        }, ganttBars);
    };
    return ganttChartView;
})(React.Component);
;
DOM.render(React.createElement(ganttChartView), document.getElementById('content'));
module.exports = ganttBar;
