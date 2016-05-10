import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';

let GCMediator: any = AppMediator.getInstance();
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
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'showInfoPopup':
                        this.show(change.data);
                        break;
                    case 'completeEditing':
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
            description: data.description
        });
        const item = DOM.findDOMNode(this) as any;
        item.style.display = 'block';
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
