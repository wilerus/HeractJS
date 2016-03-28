var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DOM = require('react-dom');
var GCStore_1 = require('./GCStore');
var ganttChartBar = (function (_super) {
    __extends(ganttChartBar, _super);
    function ganttChartBar() {
        _super.call(this);
        this.state = {
            width: GCStore_1.globalStore.svgGridWidth,
            marginLeft: 10,
            top: 10,
            fillWidth: 10,
            connectionsIds: [],
            connections: []
        };
    }
    ganttChartBar.prototype.componentWillMount = function () {
        this.setState({
            marginLeft: this.props.data.style.marginLeft,
            top: this.props.data.style.top,
            title: this.props.data.text,
            complition: this.props.data.complition,
            duration: (this.props.data.duration / GCStore_1.globalStore.cellCapacity) * GCStore_1.globalStore.svgGridWidth,
            gridWidth: GCStore_1.globalStore.svgGridWidth
        });
    };
    ganttChartBar.prototype.changeСompleteDate = function (e) {
        var eventTarget = e.target;
        var startWidth = eventTarget.getBoundingClientRect().width;
        document.onmousemove = function (event) {
            var newWidth = event.pageX - eventTarget.getAttribute('x');
            var correctWidth = (Math.floor(Math.floor((newWidth)) / GCStore_1.globalStore.svgGridWidth)) * GCStore_1.globalStore.svgGridWidth;
            if (eventTarget && correctWidth.toString() !== eventTarget.getAttribute('width') && correctWidth >= GCStore_1.globalStore.svgGridWidth) {
                eventTarget.setAttribute('width', correctWidth);
                correctWidth = (correctWidth / GCStore_1.globalStore.cellCapacity) * GCStore_1.globalStore.svgGridWidth;
                this.setState({ duration: correctWidth });
            }
        }.bind(this);
    };
    ganttChartBar.prototype.changeStartDate = function (e) {
        if (!document.onmousemove) {
            document.onmousemove = function (event) {
                var newMargin = event.pageX;
                var correctMargin = (Math.floor(newMargin / GCStore_1.globalStore.svgGridWidth)) * GCStore_1.globalStore.svgGridWidth;
                var newWidth = this.state.duration + this.state.marginLeft - correctMargin;
                if (this.state.marginLeft !== correctMargin && newWidth >= GCStore_1.globalStore.svgGridWidth) {
                    this.setState({
                        marginLeft: correctMargin,
                        duration: newWidth
                    });
                }
            }.bind(this);
        }
    };
    ganttChartBar.prototype.addNewConnection = function () {
        var targetElement = DOM.findDOMNode(GCStore_1.globalStore.currentDropTarget);
        var targetCoords = targetElement.getBoundingClientRect();
        GCStore_1.globalStore.endPointX = targetCoords.left;
        GCStore_1.globalStore.endPointY = targetCoords.top;
        var firstPoint = GCStore_1.globalStore.startPointX + ',' + (GCStore_1.globalStore.startPointY - 100);
        var secondPoint = GCStore_1.globalStore.startPointX + ',' + (GCStore_1.globalStore.startPointY - 20);
        var thirdPoint = targetCoords.left + ',' + (GCStore_1.globalStore.startPointY - 20);
        var endPoint = targetCoords.left + ',' + (targetCoords.top - 100);
        GCStore_1.globalStore.isNewConnection = false;
        var currentItems = GCStore_1.globalStore.ganttChartView.state.ganttBars;
        var topMargin = 50 * 1;
        var text = 'Task ' + 1;
        var leftMargin = 60 * 1;
        var barClass = 'group1';
        var newId = 'id' + (currentItems.length + 1);
        currentItems.push({
            id: newId,
            text: text,
            barClass: 'group1',
            firstP: GCStore_1.globalStore.currentDraggingElement,
            endP: GCStore_1.globalStore.currentDropTarget,
            firstPoint: firstPoint,
            secondPoint: secondPoint,
            thirdPoint: thirdPoint,
            endPoint: endPoint,
            type: 'connection',
            style: {
                top: topMargin,
                marginLeft: leftMargin
            }
        });
        GCStore_1.globalStore.ganttChartView.setState({ ganttBars: currentItems });
        var newConnections = GCStore_1.globalStore.connectionFirstPoint.state.connections;
        newConnections.push(GCStore_1.globalStore.ganttChartView.refs[newId]);
        GCStore_1.globalStore.connectionFirstPoint.setState({
            connections: newConnections
        });
        var newConnections2 = this.state.connections;
        newConnections2.push(GCStore_1.globalStore.ganttChartView.refs[newId]);
        this.setState({
            connections: newConnections2
        });
        document.onmousemove = null;
        GCStore_1.globalStore.connectionFirstPoint = null;
        document.getElementById('ganttChartView').removeChild(GCStore_1.globalStore.tempLine);
        GCStore_1.globalStore.tempLine = null;
        GCStore_1.globalStore.isCurrentlyDragging = false;
        GCStore_1.globalStore.isCurrentlySizing = false;
        GCStore_1.globalStore.isDrawingConnection = false;
        GCStore_1.globalStore.currentDropTarget = null;
        GCStore_1.globalStore.currentDraggingElement = null;
    };
    ganttChartBar.prototype.barRelocation = function (event) {
        var eventTarget = event.target;
        GCStore_1.globalStore.currentDraggingElement = this;
        var dropTarget = eventTarget;
        if (eventTarget.tagName === 'rect') {
            dropTarget = dropTarget.parentNode;
        }
        var e = event.target;
        var dim = e.getBoundingClientRect();
        var startY = event.clientY;
        var startX = event.clientX;
        var x = startX - dim.left;
        var y = startY - dim.top;
        document.onmousemove = function (event) {
            var transform = dropTarget.parentNode.createSVGMatrix();
            if (Math.abs(event.clientX - startX) > 30 && !GCStore_1.globalStore.isDrawingConnection) {
                dropTarget.transform.baseVal.getItem(0).setMatrix(transform.translate(event.clientX - eventTarget.parentNode.getAttribute('x') - 8 - x, 0));
                GCStore_1.globalStore.isCurrentlyDragging = true;
            }
            if (Math.abs(event.clientY - startY) > 30 && !GCStore_1.globalStore.isCurrentlyDragging) {
                GCStore_1.globalStore.isDrawingConnection = true;
                GCStore_1.globalStore.startPointX = eventTarget.getBoundingClientRect().left;
                GCStore_1.globalStore.startPointY = eventTarget.getBoundingClientRect().top;
                var firstPoint = GCStore_1.globalStore.startPointX + ',' + GCStore_1.globalStore.startPointY;
                var tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                var rect = eventTarget.getBoundingClientRect();
                tempLine.setAttribute('id', 'tempLine');
                eventTarget.parentNode.setAttribute('transform', 'translate(0, 0)');
                tempLine.setAttribute('x1', (eventTarget.getAttribute('x')).toString());
                tempLine.setAttribute('strokeWidth', '1');
                tempLine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
                tempLine.setAttribute('stroke', '#299cb4');
                document.onmousemove = function (event) {
                    var eventTarget = event.target;
                    tempLine.setAttribute('x2', (event.clientX - 10).toString());
                    tempLine.setAttribute('y2', (event.clientY - 110).toString());
                };
                GCStore_1.globalStore.tempLine = tempLine;
                document.getElementById('ganttChartView').appendChild(tempLine);
                if (!GCStore_1.globalStore.connectionFirstPoint) {
                    GCStore_1.globalStore.connectionFirstPoint = this;
                }
                document.onmouseup = function (event) {
                    if (GCStore_1.globalStore.isDrawingConnection) {
                        document.onmouseup = null;
                        this.addNewConnection();
                    }
                    this.clearTempLine();
                }.bind(this);
            }
        }.bind(this);
    };
    ganttChartBar.prototype.finishBarRelocation = function (event) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (GCStore_1.globalStore.currentDraggingElement) {
            var transform = event.target.parentNode.createSVGMatrix ? event.target.parentNode.createSVGMatrix() : event.target.parentNode.parentNode.createSVGMatrix();
            var currentDraggingElement = DOM.findDOMNode(GCStore_1.globalStore.currentDraggingElement);
            if (GCStore_1.globalStore.currentDropTarget && GCStore_1.globalStore.isCurrentlyDragging) {
                var moveToSateX = GCStore_1.globalStore.currentDropTarget.state.marginLeft;
                var moveToSateY = GCStore_1.globalStore.currentDropTarget.state.top;
                var exchToSateX = GCStore_1.globalStore.currentDraggingElement.state.marginLeft;
                var exchToSateY = GCStore_1.globalStore.currentDraggingElement.state.top;
                GCStore_1.globalStore.currentDraggingElement.setState({ marginLeft: moveToSateX });
                GCStore_1.globalStore.currentDraggingElement.setState({ top: moveToSateY });
                var currentDropTarget = DOM.findDOMNode(GCStore_1.globalStore.currentDropTarget);
                GCStore_1.globalStore.currentDropTarget.setState({ marginLeft: exchToSateX });
                GCStore_1.globalStore.currentDropTarget.setState({ top: exchToSateY });
                currentDropTarget.setAttribute('transform', 'translate(0, 0)');
                currentDraggingElement.setAttribute('transform', 'translate(0, 0)');
            }
            else {
                var currentMargin = GCStore_1.globalStore.currentDraggingElement.state.marginLeft;
                var delta = currentDraggingElement.transform.baseVal[0].matrix.e;
                GCStore_1.globalStore.currentDraggingElement.setState({ marginLeft: currentMargin + delta });
                currentDraggingElement.setAttribute('transform', 'translate(0, 0)');
            }
        }
        var connections = this.state.connections;
        if (connections) {
            var length_1 = connections.length;
            for (var i = 0; i < length_1; i++) {
                connections[i].update();
            }
        }
        GCStore_1.globalStore.isCurrentlyDragging = false;
        GCStore_1.globalStore.isCurrentlySizing = false;
        GCStore_1.globalStore.isDrawingConnection = false;
        GCStore_1.globalStore.currentDropTarget = null;
        GCStore_1.globalStore.currentDraggingElement = null;
    };
    ganttChartBar.prototype.handleRectHover = function (event) {
        this.clearTempElements();
        var eventTarget = event.target;
        if ((GCStore_1.globalStore.isCurrentlyDragging || GCStore_1.globalStore.isDrawingConnection) && this !== GCStore_1.globalStore.currentDraggingElement) {
            var currentDropTarget = DOM.findDOMNode(this);
            GCStore_1.globalStore.currentDropTarget = this;
        }
        else {
            if (!GCStore_1.globalStore.isCurrentlyDragging && !GCStore_1.globalStore.isCurrentlySizing && eventTarget.classList[0] === 'barChartBody') {
                var leftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                var rightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                var node = DOM.findDOMNode(this);
                var rect = event.target.getBoundingClientRect();
                leftCircle.setAttribute('id', 'leftTempCircle');
                leftCircle.setAttribute('cy', (parseInt(node.getAttribute('y')) + 10).toString());
                leftCircle.setAttribute('strokeWidth', '1');
                leftCircle.setAttribute('cx', (parseInt(node.getAttribute('x')) - 10).toString());
                leftCircle.setAttribute('r', '8');
                leftCircle.setAttribute('fill', '#ffeeee');
                leftCircle.setAttribute('stroke', '#299cb4');
                rightCircle.setAttribute('id', 'rightTempCircle');
                rightCircle.setAttribute('cy', (parseInt(node.getAttribute('y')) + 10).toString());
                rightCircle.setAttribute('strokeWidth', '1');
                rightCircle.setAttribute('cx', (parseInt(node.getAttribute('x')) + rect.width + 10).toString());
                rightCircle.setAttribute('r', '8');
                rightCircle.setAttribute('fill', '#ffeeee');
                rightCircle.setAttribute('stroke', '#299cb4');
                document.getElementById('ganttChartView').appendChild(rightCircle);
                document.getElementById('ganttChartView').appendChild(leftCircle);
                var self_1 = this;
                leftCircle.addEventListener('mousedown', function (event) {
                    self_1.handleircleClick(event, this);
                });
                rightCircle.addEventListener('mousedown', function (event) {
                    self_1.handleircleClick(event, this);
                });
                leftCircle.addEventListener('mouseup', function (event) {
                    self_1.handleircleClick(event, this);
                });
                rightCircle.addEventListener('mouseup', function (event) {
                    self_1.handleircleClick(event, this);
                });
                var coords = eventTarget.getBoundingClientRect();
                var hoverElement = event.target;
                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !GCStore_1.globalStore.isCurrentlyDragging) {
                        GCStore_1.globalStore.ganttChartView.refs.infoPopup.setState({
                            left: parseInt(node.getAttribute('x')) - coords.width / 2,
                            top: parseInt(node.getAttribute('y')) - 55,
                            title: this.state.title,
                            startDate: 'Placeholder',
                            endDate: 'Placeholder',
                            duration: 'Placeholder'
                        });
                        GCStore_1.globalStore.ganttChartView.refs.infoPopup.show();
                    }
                }.bind(this, hoverElement), 500);
                var elementRect = event.target.getBoundingClientRect();
                var clickCoordX = event.clientX;
                var clickCoordY = event.clientY;
                var el = DOM.findDOMNode(this);
                this.clearTempElements();
                if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                    el.style.cursor = 'move';
                }
                else if (clickCoordX > elementRect.right - 15) {
                    el.style.cursor = 'e-resize';
                }
                else if (clickCoordX < elementRect.left + 15) {
                    el.style.cursor = 'e-resize';
                }
            }
        }
    };
    ganttChartBar.prototype.handleRectSizing = function (event) {
        if (event.button !== 2) {
            var eventTarget;
            var isFillTouched = false;
            if (event.target.getAttribute('class') === 'barChartFillBody') {
                eventTarget = event.target.parentElement;
                isFillTouched = true;
            }
            else {
                eventTarget = event.target;
            }
            var elementRect = eventTarget.getBoundingClientRect();
            var clickCoordX = event.clientX;
            var clickCoordY = event.clientY;
            this.clearTempElements();
            if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.barRelocation(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event);
                }.bind(this);
            }
            else if (clickCoordX > elementRect.right - 15 && !isFillTouched) {
                this.changeСompleteDate(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event);
                }.bind(this);
                GCStore_1.globalStore.isCurrentlySizing = true;
            }
            else if (clickCoordX < elementRect.left + 15) {
                this.changeStartDate(event);
                document.onmouseup = function (event) {
                    this.finishBarRelocation(event);
                }.bind(this);
                GCStore_1.globalStore.isCurrentlySizing = true;
            }
        }
    };
    ganttChartBar.prototype.updateComplitionState = function (event) {
        document.onmousemove = function (event) {
            var newWidth = event.pageX - event.target.getAttribute('x');
            if (newWidth >= 0 && (this.state.duration / GCStore_1.globalStore.cellCapacity) * GCStore_1.globalStore.svgGridWidth >= ((this.state.duration / GCStore_1.globalStore.cellCapacity) * GCStore_1.globalStore.svgGridWidth) * newWidth / 100) {
                this.setState({
                    complition: newWidth
                });
            }
        }.bind(this);
        document.onmouseup = function (event) {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
    ganttChartBar.prototype.handleMouseOut = function (event) {
        var eventTarget = event.target;
        if (event.relatedTarget.id === 'gridPattern') {
            if (eventTarget.classList[0] === 'barExchanging') {
                setTimeout(function () {
                    if (eventTarget.classList[0] === 'barExchanging') {
                        eventTarget.setAttribute('class', 'barChartBody ' + eventTarget.classList[2]);
                        var transformeMatrix = eventTarget.parentNode.createSVGMatrix();
                        transformeMatrix = transformeMatrix.translate(0, 0);
                        if (eventTarget.transform.baseVal.length === 0 && eventTarget.parentNode.createSVGMatrix) {
                            eventTarget.transform.baseVal.appendItem(eventTarget.parentNode.createSVGTransformFromMatrix(transformeMatrix));
                        }
                        else {
                            eventTarget.transform.baseVal.getItem(0).setMatrix(transformeMatrix);
                        }
                    }
                }.bind(this), 1000);
            }
            this.clearTempElements();
        }
    };
    ganttChartBar.prototype.handleircleClick = function (e, parentElement) {
        var targetCoords = e.target.getBoundingClientRect();
        GCStore_1.globalStore.isLineDrawStarted = true;
        var eventTarget = e.target;
        if (!GCStore_1.globalStore.isNewConnection) {
            GCStore_1.globalStore.isNewConnection = true;
            GCStore_1.globalStore.startPointX = targetCoords.left;
            GCStore_1.globalStore.startPointY = targetCoords.top;
            var firstPoint = GCStore_1.globalStore.startPointX + ',' + GCStore_1.globalStore.startPointY;
            var tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            var rect = eventTarget.getBoundingClientRect();
            tempLine.setAttribute('id', 'tempLine');
            tempLine.setAttribute('x1', (eventTarget.getAttribute('cx')).toString());
            tempLine.setAttribute('strokeWidth', '1');
            tempLine.setAttribute('y1', (eventTarget.getAttribute('cy')).toString());
            tempLine.setAttribute('stroke', '#299cb4');
            document.onmousemove = function (event) {
                var eventTarget = event.target;
                tempLine.setAttribute('x2', (event.clientX - 135).toString());
                tempLine.setAttribute('y2', event.clientY.toString());
            };
            GCStore_1.globalStore.tempLine = tempLine;
            document.getElementById('ganttChartView').appendChild(tempLine);
            if (!GCStore_1.globalStore.connectionFirstPoint) {
                GCStore_1.globalStore.connectionFirstPoint = this;
            }
            document.onmouseup = function (event) {
                this.clearTempLine();
            }.bind(this);
        }
        else {
        }
    };
    ganttChartBar.prototype.clearTempElements = function () {
        if (document.getElementById('leftTempCircle')) {
            document.getElementById('ganttChartView').removeChild(document.getElementById('leftTempCircle'));
            document.getElementById('ganttChartView').removeChild(document.getElementById('rightTempCircle'));
        }
        GCStore_1.globalStore.ganttChartView.refs.infoPopup.hide();
    };
    ganttChartBar.prototype.clearTempLine = function () {
        if (GCStore_1.globalStore.tempLine) {
            document.getElementById('ganttChartView').removeChild(GCStore_1.globalStore.tempLine);
            GCStore_1.globalStore.tempLine = null;
        }
    };
    ganttChartBar.prototype.contextMenu = function (event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
    };
    ganttChartBar.prototype.showModalWindow = function () {
        GCStore_1.globalStore.ganttChartView.refs.modalWindow.show();
    };
    ganttChartBar.prototype.render = function () {
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.handleMouseOut.bind(this),
            onMouseDown: this.handleRectSizing.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            y: this.state.top,
            x: this.state.marginLeft,
            transform: 'translate(0, 0)'
        }, React.createElement('rect', {
            className: 'barChartBody ',
            group: this.props.data.barClass,
            id: this.props.data.id,
            y: this.state.top,
            x: this.state.marginLeft,
            width: this.state.duration
        }), React.createElement('rect', {
            onMouseDown: this.updateComplitionState.bind(this),
            className: 'barChartFillBody',
            group: this.props.data.barClass,
            y: this.state.top,
            x: this.state.marginLeft,
            width: ((this.state.duration / GCStore_1.globalStore.cellCapacity) * GCStore_1.globalStore.svgGridWidth) * this.state.complition / 100
        }), React.createElement('text', {
            className: 'barTitle',
            x: this.state.marginLeft + this.state.width * 0.5,
            y: this.state.top + 15
        }, this.state.title));
    };
    return ganttChartBar;
})(React.Component);
exports.ganttChartBar = ganttChartBar;
;
var ganttChartConnection = (function (_super) {
    __extends(ganttChartConnection, _super);
    function ganttChartConnection() {
        _super.apply(this, arguments);
    }
    ganttChartConnection.prototype.componentWillMount = function () {
        var firstPoint = DOM.findDOMNode(this.props.data.firstP);
        var firstPointCoordsX = parseInt(firstPoint.getAttribute('x'));
        var firstPointCoordsY = parseInt(firstPoint.getAttribute('y'));
        var firstPointCoordsWidth = firstPoint.getBoundingClientRect().width;
        var secondPoint = DOM.findDOMNode(this.props.data.endP);
        var secondPointCoordsX = parseInt(secondPoint.getAttribute('x'));
        var secondPointCoordsY = parseInt(secondPoint.getAttribute('y'));
        var secondPointCoordsWidth = secondPoint.getBoundingClientRect().width;

        if (firstPointCoordsX < secondPointCoordsX - 10) {
            this.state = {
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + secondPointCoordsY,
                endPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + secondPointCoordsY
            };
        }
        else if (firstPointCoordsX - 10 > secondPointCoordsX) {
            this.state = {
                firstPoint: (firstPointCoordsX) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (secondPointCoordsY + 20),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth / 2) + ' , ' + (secondPointCoordsY + 20)
            };
        }
        else {
            this.state = {
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            };
        }
    };
    ganttChartConnection.prototype.update = function (event) {
        var firstPoint = DOM.findDOMNode(this.props.data.firstP);
        var firstPointCoordsX = parseInt(firstPoint.getAttribute('x'));
        var firstPointCoordsY = parseInt(firstPoint.getAttribute('y'));
        var firstPointCoordsWidth = firstPoint.getBoundingClientRect().width;
        var secondPoint = DOM.findDOMNode(this.props.data.endP);
        var secondPointCoordsX = parseInt(secondPoint.getAttribute('x'));
        var secondPointCoordsY = parseInt(secondPoint.getAttribute('y'));
        var secondPointCoordsWidth = secondPoint.getBoundingClientRect().width;
        this.state = {
            firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
            secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + (firstPointCoordsY + 10),
            endPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 + 10) + ' , ' + secondPointCoordsY
        };
    };
    ganttChartConnection.prototype.render = function () {
        return React.createElement('polyline', {
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' + this.state.endPoint,
            strokeWidth: 2,
            stroke: '#888888',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: 'url(#triangle)',
            fill: 'none'
        });
    };
    return ganttChartConnection;
})(React.Component);
exports.ganttChartConnection = ganttChartConnection;
;
