import React = require('react')
import DOM = require('react-dom')

import {GlobalStore} from './GlobalStore';

export class InfoPopup extends React.Component<any, any> {
    private componentWillMount() {
        this.state = {
            left: 0,
            top: 0,
            title: 'title',
            startDate: 'Placeholder',
            endDate: 'Placeholder',
            duration: 'Placeholder',
            description: 'description'
        }
    }

    public hide() {
        let item = DOM.findDOMNode(this) as any
        item.style.display = 'none';
    }

    public show() {
        let item = DOM.findDOMNode(this) as any
        item.style.display = 'block';
    }

    render() {
        return React.createElement('div', {
            id: 'infoPopup',
            className: 'infoPopup',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        },
            React.createElement('div', {
                className: 'infoPopupTitle',
            }, this.state.title),
            React.createElement('div', {
                className: 'infoPopupText',
            }, this.state.description),
            React.createElement('div', {
                className: 'infoPopupText',
            }, 'Start date ' + this.state.startDate + ' hours'),
            React.createElement('div', {
                className: 'infoPopupText',
            }, 'Complete date ' + this.state.endDate + ' hours'),
            React.createElement('div', {
                className: 'infoPopupText',
            }, 'Duration ' + this.state.duration + ' hours')
        )
    }
};
