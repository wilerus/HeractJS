import * as React from 'react';
import {AppMediator} from '../../../scripts/services/ApplicationMediator';

const GCMediator: any = AppMediator.getInstance();

export class TaskLink extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'completeItemEditing':
                        this.buildConnection();
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
        this.state = {
            firstPoint: '',
            secondPoint: '',
            thirdPoint: '',
            endPoint: ''
        };
    }

    public buildConnection() {
        const firstPoint = document.getElementById(this.props.data.from);
        const secondPoint = document.getElementById(this.props.data.to);

        if (firstPoint && secondPoint) {
            const currentState = GCMediator.getState().items
            const firstElementType = currentState.find((element) => {
                if (element.id === firstPoint.id) {
                    return true
                }
            })
            if (firstElementType) {
                const xDelta = firstElementType.type === 'milestone' ? -4 : 0
                const yDelta = firstElementType.type === 'project' ? 1 : 7
                let firstPointCoordsX: number;
                let firstPointCoordsY: number;
                let secondPointCoordsX: number;
                let secondPointCoordsY: number;

                if (firstElementType.type === 'project') {
                    firstPointCoordsX = parseInt(firstPoint.getAttribute('d').split(' ')[0].split('M')[1]);
                    firstPointCoordsY = parseInt(firstPoint.getAttribute('d').split(' ')[1]);
                    secondPointCoordsX = parseInt(secondPoint.getAttribute('d').split(' ')[0].split('M')[1]);
                    secondPointCoordsY = parseInt(secondPoint.getAttribute('d').split(' ')[1]);
                } else {
                    firstPointCoordsX = parseInt(firstPoint.getAttribute('x'));
                    firstPointCoordsY = parseInt(firstPoint.getAttribute('y'));
                    secondPointCoordsX = parseInt(secondPoint.getAttribute('x'));
                    secondPointCoordsY = parseInt(secondPoint.getAttribute('y'));
                }
                const firstPointCoordsWidth = firstPoint.getBoundingClientRect().width;

                this.setState({
                    firstPoint: (firstPointCoordsX + firstPointCoordsWidth + xDelta) + ' , ' + (firstPointCoordsY + yDelta),
                    secondPoint: (secondPointCoordsX + 7) + ' , ' + (firstPointCoordsY + yDelta),
                    thirdPoint: (secondPointCoordsX + 7) + ' , ' + (secondPointCoordsY - 4)
                });
            }
        }
    }

    public componentDidMount() {
        this.buildConnection();
    }

    private shouldComponentUpdate(nextProps: any, nextState: any) {
        if (this.state.firstPoint !== nextState.firstPoint ||
            this.state.secondPoint !== nextState.secondPoint ||
            this.state.thirdPoint !== nextState.thirdPoint ||
            this.state.endPoint !== nextState.endPoint) {
            return true
        } else {
            return false
        }
    }

    private componentWillReceiveProps() {
        this.buildConnection();
    }

    public render() {
        return React.createElement('polyline', {
            className: 'taskLink',
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint
        } as React.DOMAttributes);
    }
}
