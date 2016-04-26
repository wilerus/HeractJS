import React = require('react')
import {AppMediator} from '../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TaskLink extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'setTimelineStep':
                        this.buildConnection();
                        break;
                    case 'stopDragging':
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
            const xDelta = firstElementType.type === 'milestone' ? -3 : 0
            const yDelta = firstElementType.type === 'project' ? 1 : 7
            const firstPointCoordsX = parseInt(firstPoint.getAttribute('x'));
            const firstPointCoordsY = parseInt(firstPoint.getAttribute('y'));
            const firstPointCoordsWidth = firstPoint.getBoundingClientRect().width;
            const secondPointCoordsX = parseInt(secondPoint.getAttribute('x'));
            const secondPointCoordsY = parseInt(secondPoint.getAttribute('y'));
            const secondPointCoordsWidth = secondPoint.getBoundingClientRect().width;

            //if (firstPointCoordsX < secondPointCoordsX - 10) {
            this.setState({
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth + xDelta) + ' , ' + (firstPointCoordsY + yDelta),
                secondPoint: (secondPointCoordsX + 7) + ' , ' + (firstPointCoordsY + yDelta),
                thirdPoint: (secondPointCoordsX + 7) + ' , ' + (secondPointCoordsY - 4)
                // endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            });
            //  }

            //} else if (firstPointCoordsX - 10 > secondPointCoordsX) {
            //    this.setState({
            //        firstPoint: (firstPointCoordsX) + ' , ' + (firstPointCoordsY + 7),
            //        secondPoint: (secondPointCoordsX - 30) + ' , ' + (firstPointCoordsY + 7),
            //        thirdPoint: (secondPointCoordsX - 30) + ' , ' + (secondPointCoordsY - 4)
            //        //endPoint: (secondPointCoordsX) + ' , ' + (secondPointCoordsY + 10)
            //    })
            //} else {
            //    this.setState({
            //        firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 7),
            //        secondPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 ) + ' , ' + (firstPointCoordsY + 7),
            //        thirdPoint: (secondPointCoordsX + secondPointCoordsWidth / 2 ) + ' , ' + (secondPointCoordsY - 4)
            //       // endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            //    })
            //}
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
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint, //+ ' ' + this.state.endPoint,
            strokeWidth: 1,
            stroke: 'rgb(80,80,220)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: 'url(#triangle)',
            fill: 'none'
        });
    }
}
