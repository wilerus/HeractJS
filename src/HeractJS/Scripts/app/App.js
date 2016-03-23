var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var globalStore = require("./globalStore");
var gunttChartClasses = require("./gunttChartClasses");
var globalStoreClass = new globalStore.globalStore();
var elementsConnection = new gunttChartClasses.elementsConnection();
var tempLine = new gunttChartClasses.tempLine();
var container = React.createFactory('div');
var amountOfElements = 100;
var ganttBars = [];
for (var i = 0; i < amountOfElements; i++) {
    var topMargin = 50 * i;
    var text = 'Task ' + i.toString();
    var leftMargin = 30 * i;
    ganttBars.push({
        id: 'id1',
        text: text,
        style: {
            top: topMargin,
            marginLeft: leftMargin
        }
    });
}
var ganttChartView = (function (_super) {
    __extends(ganttChartView, _super);
    function ganttChartView() {
        _super.call(this);
        this.globalStorePoints = globalStoreClass;
        this.state = {
            width: 100,
            marginLeft: 10,
            fillDivWidth: 10,
            connectionsIds: [],
            isRenderComplete: true
        };
    }
    ganttChartView.prototype.componentDidMount = function () {
        this.setState({ marginLeft: this.props.style.marginLeft });
    };
    ganttChartView.prototype.onDragRight = function (e) {
        var eventTarget = e.target;
        document.onmousemove = function (event) {
            if (eventTarget && eventTarget.tagName === 'rect') {
                eventTarget.setAttribute('width', event.pageX - eventTarget.getAttribute('x') - 140);
            }
        };
        if (e.pageX !== 0) {
        }
    };
    ganttChartView.prototype.onDragLeft = function (e) {
        var eventTarget = e.target;
        document.onmousemove = function (event) {
            if (eventTarget && eventTarget.tagName === 'rect') {
                debugger;
                eventTarget.setAttribute('width', eventTarget.getAttribute('width') - ((event.pageX - 140) - eventTarget.getAttribute('x')));
                eventTarget.setAttribute('x', event.pageX - 140);
            }
        };
    };
    ganttChartView.prototype.onDragFill = function (e) {
        if (e.pageX !== 0) {
            this.setState({
                fillDivWidth: e.pageX - this.state.marginLeft
            });
        }
    };
    ganttChartView.prototype.handleElementDragDrop = function (event) {
        var eventTarget = event.target;
        document.onmousemove = function (event) {
            if (eventTarget.parentNode && eventTarget.tagName === 'rect') {
                eventTarget.setAttribute('class', 'barDragging barChartBody');
                var transformeMatrix = eventTarget.parentNode.createSVGMatrix();
                transformeMatrix = transformeMatrix.translate(event.clientX - eventTarget.getAttribute('x') - 140, event.clientY - eventTarget.getAttribute('y'));
                if (eventTarget.transform.baseVal.length === 0 && eventTarget.parentNode.createSVGMatrix) {
                    eventTarget.transform.baseVal.appendItem(eventTarget.parentNode.createSVGTransformFromMatrix(transformeMatrix));
                }
                else {
                    eventTarget.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                }
            }
        };
        this.globalStorePoints.isCurrentlyDragging = true;
    };
    ganttChartView.prototype.handleRectDrop = function (event) {
        var currentElement = event.target;
        currentElement.setAttribute('class', 'barChartBody');
        document.onmousemove = null;
        if (this.globalStorePoints.currentDropTarger) {
            var moveToSateX = this.globalStorePoints.currentDropTarger.getAttribute('x');
            var moveToSateY = this.globalStorePoints.currentDropTarger.getAttribute('y');
            var exchToSateX = currentElement.getAttribute('x');
            var exchToSateY = currentElement.getAttribute('y');
            currentElement.setAttribute('x', moveToSateX);
            currentElement.setAttribute('y', moveToSateY);
            this.globalStorePoints.currentDropTarger.setAttribute('x', exchToSateX);
            this.globalStorePoints.currentDropTarger.setAttribute('y', exchToSateY);
            this.globalStorePoints.isCurrentlyDragging = false;
            var transformeMatrix = currentElement.parentNode.createSVGMatrix();
            transformeMatrix = transformeMatrix.translate(0, 0);
            if (currentElement.transform.baseVal.length === 0 && currentElement.parentNode.createSVGMatrix) {
                currentElement.transform.baseVal.appendItem(currentElement.parentNode.createSVGTransformFromMatrix(transformeMatrix));
            }
            else {
                currentElement.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                this.globalStorePoints.currentDropTarger.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                this.globalStorePoints.currentDropTarger.setAttribute('class', 'barChartBody');
            }
        }
    };
    ganttChartView.prototype.handleRectHover = function (event) {
        if (this.globalStorePoints.isCurrentlyDragging) {
            var eventTarget = event.target;
            if (eventTarget && eventTarget.parentNode && eventTarget.tagName === 'rect' && eventTarget.getAttribute('class') !== 'barDragging barChartBody') {
                this.globalStorePoints.currentDropTarger = eventTarget;
                eventTarget.setAttribute('class', 'barExchanging barChartBody');
                var transformeMatrix = eventTarget.parentNode.createSVGMatrix();
                transformeMatrix = transformeMatrix.translate(30, 30);
                if (eventTarget.transform.baseVal.length === 0 && eventTarget.parentNode.createSVGMatrix) {
                    eventTarget.transform.baseVal.appendItem(eventTarget.parentNode.createSVGTransformFromMatrix(transformeMatrix));
                }
                else {
                    eventTarget.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                }
            }
        }
        else {
            var leftCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
            var rightCircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
            this.globalStorePoints.currentDropTarger = eventTarget;
            var rect = event.target.getBoundingClientRect();
            leftCircle.setAttribute("id", "leftTempCircle");
            leftCircle.setAttribute('onclick', this.handleircleClick.bind(this));
            leftCircle.setAttribute('cy', (rect.top + 10).toString());
            leftCircle.setAttribute('strokeWidth', '1');
            leftCircle.setAttribute('cx', (rect.left - 155).toString());
            leftCircle.setAttribute('r', '8');
            leftCircle.setAttribute('fill', '#ffeeee');
            leftCircle.setAttribute('stroke', '#299cb4');
            rightCircle.setAttribute("id", "rightTempCircle");
            rightCircle.setAttribute('onclick', this.handleircleClick.bind(this));
            rightCircle.setAttribute('cy', (rect.top + 10).toString());
            rightCircle.setAttribute('strokeWidth', '1');
            rightCircle.setAttribute('cx', (rect.left + rect.width - 130).toString());
            rightCircle.setAttribute('r', '8');
            rightCircle.setAttribute('fill', '#ffeeee');
            rightCircle.setAttribute('stroke', '#299cb4');
            document.getElementById('ganttChartView').appendChild(rightCircle);
            document.getElementById('ganttChartView').appendChild(leftCircle);
        }
    };
    ganttChartView.prototype.handleRectSizing = function (event) {
        var elementRect = event.target.getBoundingClientRect();
        var clickCoordX = event.clientX;
        var clickCoordY = event.clientY;
        if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
            this.handleElementDragDrop(event);
        }
        else if (clickCoordX > elementRect.right - 15) {
            this.onDragRight(event);
        }
        else if (clickCoordX < elementRect.left + 15) {
            this.onDragLeft(event);
        }
    };
    ganttChartView.prototype.handleFillSizing = function (event) {
        debugger;
    };
    ganttChartView.prototype.handleMouseOut = function (event) {
        if (document.getElementById("leftTempCircle")) {
            document.getElementById("ganttChartView").removeChild(document.getElementById("leftTempCircle"));
            document.getElementById("ganttChartView").removeChild(document.getElementById("rightTempCircle"));
        }
    };
    ganttChartView.prototype.handleircleClick = function (e) {
        var targetCoords = e.target.getBoundingClientRect();
        if (!this.globalStorePoints.isNewConnection) {
            this.globalStorePoints.isNewConnection = true;
            this.globalStorePoints.newSvgPaletId += 1;
            var newConIds = this.state.connectionsIds;
            newConIds.push("svgPalet" + this.globalStorePoints.newSvgPaletId);
            this.setState({
                connectionsIds: newConIds
            });
            this.globalStorePoints.startPointX = targetCoords.left;
            this.globalStorePoints.startPointY = targetCoords.top;
            var firstPoint = this.globalStorePoints.startPointX + ',' + this.globalStorePoints.startPointY;
            this.globalStorePoints.tempLine = this;
        }
        else {
            debugger;
            DOM.unmountComponentAtNode(document.getElementById('svgPalet' + this.globalStorePoints.newSvgPaletId));
            this.globalStorePoints.endPointX = targetCoords.left;
            this.globalStorePoints.endPointY = targetCoords.top;
            var firstPoint = this.globalStorePoints.startPointX + ',' + this.globalStorePoints.startPointY;
            var secondPoint = this.globalStorePoints.startPointX + ',' + (this.globalStorePoints.startPointY - 20) + '';
            var thirdPoint = '' + targetCoords.left + ',' + (this.globalStorePoints.startPointY - 20) + '';
            var endPoint = "" + targetCoords.left + ',' + targetCoords.top + '';
            this.globalStorePoints.isNewConnection = false;
        }
    };
    ganttChartView.prototype.render = function () {
        return React.createElement('svg', {
            className: 'ganttChartView',
            id: 'ganttChartView'
        }, this.props.results.map(function (ganttBars) {
            return;
            React.createElement('rect', {
                onMouseOver: this.handleRectHover.bind(this),
                onMouseOut: this.handleMouseOut.bind(this),
                onMouseDown: this.handleRectSizing.bind(this),
                onMouseUp: this.handleRectDrop.bind(this),
                draggable: true,
                className: 'barChartBody',
                y: this.props.style.top,
                x: 30 + this.state.marginLeft,
                width: this.state.width
            }),
                React.createElement('text', {
                    width: this.state.width,
                    fill: 'rgb(255,255,255)',
                    x: 30,
                    y: 15,
                    height: 20
                }, this.props.text),
                container({
                    onDrag: this.onDragFill.bind(this),
                    draggable: 'true',
                    style: {
                        position: 'absolute',
                        color: 'rgba(0,0,0)',
                        fontSize: '26px',
                        marginTop: '19px',
                        width: '20px',
                        marginLeft: this.state.fillDivWidth - 10,
                        textAlign: 'center',
                        backgroundColor: 'rgba(155,100,100)',
                        zIndex: 11
                    }
                });
        }));
    };
    return ganttChartView;
})(React.Component);
;
DOM.render(React.createElement(ganttChartView, ganttBars), document.getElementById('gantChartView'));
module.exports = ganttChartView;
