import React = require('react')
import DOM = require('react-dom')

import {AppMediator} from '../../../scripts/services/AppMediator'

let GCMediator: any = AppMediator.getInstance();

export class ActionChartPopup extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);
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
    }

    public show() {
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'block';
    }

    private addToTaskline() {
        GCMediator.dispatch({ type: 'addToTaskline' });
        this.hide();
    }

    public render() {
        return React.createElement('div', {
            id: 'actionPopup',
            className: 'actionPopup',
            style: {
                left: this.state.left,
                top: this.state.top
            }
        },
            React.createElement('div', {
                className: 'actionPopupTitle'
            }, this.state.title),
            React.createElement('button', {
                className: 'addToTasklineButton',
                onClick: this.addToTaskline.bind(this)
            }, 'Add to taskline')
        );
    }
};
