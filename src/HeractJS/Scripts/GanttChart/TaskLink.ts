import React = require('react')
import DOM = require('react-dom')

export class TaskLink extends React.Component<any, any> {
    public buildConnection() {
        let firstPoint = DOM.findDOMNode(this.props.data.firstP) as any;
        let firstPointCoordsX = parseInt(firstPoint.getAttribute('x'))
        let firstPointCoordsY = parseInt(firstPoint.getAttribute('y'))
        let firstPointCoordsWidth = firstPoint.getBoundingClientRect().width

        let secondPoint = DOM.findDOMNode(this.props.data.endP) as any;
        let secondPointCoordsX = parseInt(secondPoint.getAttribute('x'))
        let secondPointCoordsY = parseInt(secondPoint.getAttribute('y'))
        let secondPointCoordsWidth = secondPoint.getBoundingClientRect().width

        if (firstPointCoordsX < secondPointCoordsX - 10) {
            this.setState({
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            })
        } else if (firstPointCoordsX - 10 > secondPointCoordsX) {
            this.setState({
                firstPoint: (firstPointCoordsX) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX - 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX - 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX) + ' , ' + (secondPointCoordsY + 10)
            })
        } else {
            this.setState({
                firstPoint: (firstPointCoordsX + firstPointCoordsWidth) + ' , ' + (firstPointCoordsY + 10),
                secondPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (firstPointCoordsY + 10),
                thirdPoint: (secondPointCoordsX + secondPointCoordsWidth + 30) + ' , ' + (secondPointCoordsY + 10),
                endPoint: (secondPointCoordsX + secondPointCoordsWidth) + ' , ' + (secondPointCoordsY + 10)
            })
        }
    }

    private componentWillMount() {
        this.buildConnection()
    }

    render() {
        return React.createElement('polyline', {
            points: this.state.firstPoint + ' ' + this.state.secondPoint + ' ' + this.state.thirdPoint + ' ' + this.state.endPoint,
            strokeWidth: 2,
            stroke: 'rgb(80,80,220)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            markerEnd: 'url(#triangle)',
            fill: 'none'
        })
    }
};
