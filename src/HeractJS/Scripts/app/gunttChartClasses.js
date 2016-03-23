var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var globalStore = require("./globalStore");
var globalStoreClass = new globalStore.globalStore();
var container = React.createFactory('div');
var elementsConnection = (function (_super) {
    __extends(elementsConnection, _super);
    function elementsConnection() {
        _super.call(this);
        this.state = {
            firstPoint: '',
            secondPoint: '',
            thirdPoint: '',
            endPoint: '',
        };
    }
    elementsConnection.prototype.componentDidMount = function () {
        this.setState({
            firstPoint: this.props.firstPoint,
            secondPoint: this.props.secondPoint,
            thirdPoint: this.props.thirdPoint,
            endPoint: this.props.endPoint
        });
    };
    elementsConnection.prototype.render = function () {
        var el = React.createElement('polyline', {
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' + this.state.endPoint,
            strokeWidth: "3",
            stroke: "#888888",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none"
        });
        return el;
    };
    return elementsConnection;
})(React.Component);
exports.elementsConnection = elementsConnection;
var tempLine = (function (_super) {
    __extends(tempLine, _super);
    function tempLine() {
        _super.call(this);
        this.globalStorePoints = globalStoreClass;
        this.state = {
            endPointX: 0,
            endPointY: 0,
            listenerFunction: ''
        };
    }
    tempLine.prototype.componentDidMount = function () {
        var _this = this;
        var move = function (event) {
            _this.setState({
                firstPoint: _this.props.firstPoint,
                endPointX: _this.props.endPointX,
                endPointY: _this.props.endPointY
            });
            DOM.render(React.createElement(tempLine, {
                firstPoint: _this.props.firstPoint,
                endPointX: event.clientX,
                endPointY: event.clientY
            }), document.getElementById('svgPalet' + _this.globalStorePoints.newSvgPaletId));
        };
        this.globalStorePoints.tempFunc = move;
        document.onmousemove = move.bind(this);
    };
    tempLine.prototype.componentWillUnmount = function () {
        document.onmousemove = undefined;
    };
    tempLine.prototype.render = function () {
        var el = React.createElement('polyline', {
            points: this.state.firstPoint + ' ' + this.state.endPointX + ',' + this.state.endPointY,
            strokeWidth: "3",
            stroke: "#888888",
            strokeLinecap: "round",
            strokeDasharray: "10,10",
            strokeLinejoin: "round",
            fill: "none"
        });
        return el;
    };
    return tempLine;
})(React.Component);
exports.tempLine = tempLine;
