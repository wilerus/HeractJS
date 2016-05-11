import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';

let GCMediator: any = AppMediator.getInstance();

export class ActionTasklinePopup extends React.Component<any, any> {
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
                    case 'showActionTimelinePopup':
                        this.show(change.data);
                        break;
                    case 'hideActionTimelinePopup':
                    case 'hideAllPopups':
                        this.hide();
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    private hide() {
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'none';
    }

    private show(data) {
        this.setState({
            left: data.left,
            top: data.top,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            duration: data.duration,
            description: data.description,
            type: data.target
        })
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'block';
        if (data.target === 'task') {
            document.getElementById('addToCalloutsButton').style.display = 'inherit';
        } else {
            document.getElementById('addToCalloutsButton').style.display = 'none';
        }
    }

    private removeFromTaskline() {
        let data;
        const state = this.state;
        if (state.type === 'callout') {
            data = {
                calloutDisplay: false
            }
        } else {
            data = {
                timelineDisplay: false
            }
        }
        GCMediator.dispatch({
            type: 'editTask',
            data: data
        });
        this.hide();
    }

    private addToCallouts() {
        let data;
        const state = this.state;

        GCMediator.dispatch({
            type: 'editTask',
            data: {
                calloutDisplay: true
            }
        });
        this.hide();
    }
    public render() {
        return React.createElement('div', {
            id: 'actionTimelinePopup',
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
                className: 'removeFromTasklineButton',
                onClick: this.removeFromTaskline.bind(this)
            }, 'Remove from taskline'),
            React.createElement('button', {
                className: 'addToCalloutsButton',
                id: 'addToCalloutsButton',
                onClick: this.addToCallouts.bind(this)
            }, 'Display as callout')
        );
    }
};
