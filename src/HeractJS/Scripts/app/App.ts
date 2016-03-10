/// <reference path="../../typings/main.d.ts" />

import $ = require('jquery');
import React = require('react')
import DOM = require('react-dom')
export = Greeter;

class Greeter extends React.Component<void, void> {
    constructor() {
        super();
    }

    render() {
        var e = '<h1 id="id">' + ' selifhjaerlgf ealrkgj' + '</h1>';
        var data = $.parseJSON('{ "className": "my-list" }');
        var el = React.createElement("h1", data, 'Content');
        return el;
    }
};

var greeter = new Greeter();

DOM.render(React.createElement(Greeter, <any>{}), document.body)
