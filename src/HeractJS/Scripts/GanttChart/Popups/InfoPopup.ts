import * as React from 'react';
import * as DOM from 'react-dom';

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
        };
    }

    public hide() {
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'none';
        // item.style.top = '100px'
    }

    public show() {
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'block';
        //item.style.top = 0
    }

    public render() {
        return React.createElement('div', {
            id: 'infoPopup',
            className: 'infoPopup',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        },
            React.createElement('div', {
                className: 'infoPopupTitle'
            }, this.state.title),
            React.createElement('div', {
                className: 'infoPopupText'
            }, this.state.description),
            React.createElement('div', {
                className: 'infoPopupText'
            }, `Start date ${this.state.startDate} hours`),
            React.createElement('div', {
                className: 'infoPopupText'
            }, `Complete date ${this.state.endDate} hours`),
            React.createElement('div', {
                className: 'infoPopupText'
            }, `Duration ${this.state.duration} hours`)
        );
    }
};
