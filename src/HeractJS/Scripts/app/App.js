var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('jquery');
var React = require('react');
var DOM = require('react-dom');
var Greeter = (function (_super) {
    __extends(Greeter, _super);
    function Greeter() {
        _super.call(this);
    }
    Greeter.prototype.render = function () {
        var e = '<h1 id="id">' + ' selifhjaerlgf ealrkgj' + '</h1>';
        var data = $.parseJSON('{ "className": "my-list" }');
        var el = React.createElement("h1", data, 'Content');
        return el;
    };
    return Greeter;
})(React.Component);
;
var greeter = new Greeter();
DOM.render(React.createElement(Greeter, {}), document.body);
module.exports = Greeter;
