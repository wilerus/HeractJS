import React = require('react')

import {AppMediator} from '../../scripts/services/AppMediator'
let GCMediator: any = AppMediator.getInstance()

export class TaskLineView extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            marginLeft: '',
            width: '',
            top: '',
            height: '',
            text: ''
        }
    }

    private componentDidMount() {
        //this.setState({
        //    marginLeft: this.props.data.style.marginLeft,
        //    width: this.props.data.style.width,
        //    top: this.props.data.style.top,
        //    height: this.props.data.style.height,
        //    text: this.props.data.text
        //})
    }

    public render() {
        const items = GCMediator.getState().taskline.map((link: any) => {
            if (link) {
                //return React.createElement(TaskLineItem, {
                //    ref: link.id,
                //    key: link.id,
                //    data: link
                //})
               return React.createElement('div', {
                    //id: 'tasklineContainer',
                   // className: 'tasklineContainer'
                })
            }
        })

        return React.createElement('div', {
            id: 'tasklineContainer',
            className: 'tasklineContainer'
        },
            React.createElement('svg', {
                className: 'ganttTaskLine',
                id: 'ganttTaskLine'
            }, items ))
    }
};
