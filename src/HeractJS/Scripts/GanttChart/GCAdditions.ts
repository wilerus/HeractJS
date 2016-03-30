import React = require('react')
import DOM = require('react-dom')

import {globalStore} from './GCStore';
import {ganttChartBar} from './GCBars';
import {ganttChartConnection} from './GCBars';
import {ganttChartTimeline}  from './GCTimeline';

export class ganttChartInfoPopup extends React.Component<any, any> {
    componentWillMount() {
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

    hide() {
        let item = DOM.findDOMNode(this) as any
        item.style.display = 'none';
    }

    show() {
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

export class ganttChartModalWindow extends React.Component<any, any> {
    componentWillMount() {
        this.state = {
            title: 'title',
            startDate: 'Placeholder',
            endDate: 'Placeholder',
            duration: 'Placeholder',
            description: 'description'
        }
    }

    hide() {
        let item = DOM.findDOMNode(this) as any
        item.style.display = 'none';
    }

    show() {
        let item = DOM.findDOMNode(this) as any
        item.style.display = 'flex';
    }

    render() {
        return React.createElement('div', {
            id: 'modalWindowWrapper',
            className: 'modalWindowWrapper'
        },
            React.createElement('div', {
                id: 'modalWindow',
                className: 'modalWindow'
            },
                React.createElement('input', {
                    type:'text',
                    className: 'infoPopupTitle',
                    value: this.state.title
                }),
                React.createElement('input', {
                    type: 'text',
                    className: 'infoPopupDescription',
                    value: this.state.description
                }),
                React.createElement('span', {
                    className: 'GCInputLabel'
                }, 'Task start: '),
                React.createElement('input', {
                    id: 'modalWindowInputStart',
                    type: 'datetime-local',
                    className: 'modalWindowInput',
                    defaultValue: this.state.startDate
                }),
                React.createElement('span', {
                    className: 'GCInputLabel'
                }, 'Task finish: '),
                React.createElement('input', {
                    id: 'modalWindowInputFinish',
                    type: 'datetime-local',
                    className: 'modalWindowInput',
                    defaultValue: this.state.completeDate
                }),
                React.createElement('span', {
                    className: 'GCInputLabel'
                }, 'Task duration: '),
                React.createElement('input', {
                    id: 'modalWindowInputDuration',
                    type: 'datetime-local',
                    className: 'modalWindowInput',
                    defaultValue: this.state.completeDate
                }),
                React.createElement('button', {
                    onMouseDown: this.hide.bind(this),
                    id: 'modalWindowButtonOk',
                    type: 'datetime-local',
                    className: 'modalWindowButtonOk'
                }, 'Ok'),
                React.createElement('button', {
                    onMouseDown: this.hide.bind(this),
                    id: 'modalWindowButtonCancel',
                    type: 'datetime-local',
                    className: 'modalWindowButtonCancel'
                }, 'Cancel')
            )
        )
    }
};
