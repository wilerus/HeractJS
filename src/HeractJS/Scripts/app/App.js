var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('jquery');
var React = require('react');
var DOM = require('react-dom');
var InputEl = (function (_super) {
    __extends(InputEl, _super);
    function InputEl() {
        _super.call(this);
    }
    InputEl.prototype.update = function (e) {
        this.setState({ txt: e.target.value });
        console.log(e.target.value);
    };
    InputEl.prototype.render = function () {
        var el = React.createElement("input", { id: 'inputEl', type: "text" });
        return el;
    };
    return InputEl;
})(React.Component);
;
var Greeter = (function (_super) {
    __extends(Greeter, _super);
    function Greeter() {
        _super.call(this);
        this.state = {
            width: 100,
            marginLeft: 10,
            fillDivWidth: 10
        };
    }
    Greeter.prototype.update = function (e) {
        this.setState({ txt: e.target.value });
    };
    Greeter.prototype.onDragRight = function (e) {
        var newWidth = e.pageX;
        if (newWidth !== 0) {
            this.setState({
                width: e.pageX
            });
        }
    };
    Greeter.prototype.onDragLeft = function (e) {
        var newMarginLeft = e.pageX;
        if (newMarginLeft !== 0) {
            this.setState({
                marginLeft: e.pageX
            });
        }
    };
    Greeter.prototype.onDragFill = function (e) {
        debugger;
        var newFillDivWidth = e.pageX - this.state.marginLeft;
        if (newFillDivWidth !== 0 && e.pageX !== 0) {
            this.setState({
                fillDivWidth: newFillDivWidth
            });
        }
    };
    Greeter.prototype.onDragOver = function (e) {
        e.preventDefault();
    };
    Greeter.prototype.onDrop = function (e) {
        e.preventDefault();
    };
    Greeter.prototype.render = function () {
        var el = React.createElement("div", {
            style: {
                marginTop: '20px',
                marginBottom: '20px',
            }
        }, React.createElement("div", {
            type: 'text',
            onDragOver: this.onDragOver.bind(this),
            onDrop: this.onDrop.bind(this),
            style: {
                position: 'absolute',
                borderRadius: '2px',
                width: this.state.width - this.state.marginLeft,
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
        }), React.createElement('div', {
            onDrag: this.onDragRight.bind(this),
            draggable: 'true',
            style: {
                position: 'absolute',
                color: 'rgb(255,255,255)',
                textShadow: '2px 2px rgb(0,0,0)',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                width: '10px',
                marginLeft: this.state.width - 10,
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
                fontSize: '20px',
                marginTop: '19px',
                width: '20px',
                marginLeft: this.state.marginLeft + this.state.fillDivWidth - 10,
                textAlign: 'center',
                backgroundColor: 'rgba(155,100,100)'
            }
        }, '^'));
        return el;
    };
    return Greeter;
})(React.Component);
;
var Draggable = (function (_super) {
    __extends(Draggable, _super);
    function Draggable() {
        _super.call(this);
        this.state = {
            txt: '213'
        };
    }
    Draggable.prototype.update = function (e) {
        this.setState({ txt: this.props.txt });
    };
    Draggable.prototype.render = function () {
        var data = $.parseJSON('{ "className": "ondragstart" }');
        var el = React.createElement("div", {
            id: 'ondragstart',
            draggable: "false",
            width: "336",
            height: "69",
            bacgroundColor: 'red'
        }, 'dragMe');
        return el;
    };
    return Draggable;
})(React.Component);
;
DOM.render(React.createElement(Greeter, null, 'Content'), document.getElementById('content'));
module.exports = Greeter;
