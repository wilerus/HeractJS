import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';

const GCMediator: any = AppMediator.getInstance();

export class InfoPopup extends React.Component<any, any> {
    private componentWillMount() {
        this.state = {
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

    private show(data: any) {
        this.setState({
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            duration: data.duration,
            description: data.description
        });
        const item = DOM.findDOMNode(this) as any;
        item.style.left = data.left + 'px';
        item.style.top = data.top + 50 + 'px';
        item.style.display = 'block';
        setTimeout(() => {
            item.style.top = data.top + 'px';
        }, 10)
    }

    public render() {
        return React.createElement('div', {
            id: 'infoPopup',
            className: 'infoPopup'
        } as React.DOMAttributes,
            React.createElement('div', {
                className: 'infoPopupTitle'
            } as React.DOMAttributes, this.state.title),
            React.createElement('div', {
                className: 'infoPopupText'
            } as React.DOMAttributes, this.state.description),
            React.createElement('div', {
                className: 'infoPopupText'
            } as React.DOMAttributes, `Start date ${this.state.startDate} hours`),
            React.createElement('div', {
                className: 'infoPopupText'
            } as React.DOMAttributes, `Complete date ${this.state.endDate} hours`),
            React.createElement('div', {
                className: 'infoPopupText'
            } as React.DOMAttributes, `Duration ${this.state.duration} hours`)
        );
    }
};
