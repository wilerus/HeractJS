import * as React from 'react';
import * as DOM from 'react-dom';

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

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

        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'showActionChartPopup':
                        this.show(change.data);
                        break;
                    case 'hideActionChartPopup':
                    case 'hideAllPopups':
                        this.hide();
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    public hide() {
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'none';
    }

    public show(data: any) {
        this.setState({
            left: data.left,
            top: data.top,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            duration: data.duration,
            description: data.description
        });
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'block';
    }

    private addToTaskline() {
        GCMediator.dispatch({
            type: 'editItem',
            data: {
                timelineDisplay: true
            }
        });
        this.hide();
    }

    private removeFromTaskline() {
        GCMediator.dispatch({
            type: 'editItem',
            data: {
                timelineDisplay: false
            }
        });
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
            }, 'Add to taskline'),
            React.createElement('button', {
                className: 'removeFromTasklineButton',
                onClick: this.removeFromTaskline.bind(this)
            }, 'Remove from taskline')
        );
    }
};
