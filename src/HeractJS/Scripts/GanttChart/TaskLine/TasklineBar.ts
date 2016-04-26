import React = require('react')
import DOM = require('react-dom')

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineBar extends React.Component<any, any> {

    constructor(props, context) {
        super(props, context);
        this.state = {
            id: props.data.id,
            order: props.data.order,
            collapsed: props.data.collapsed,
            position: props.data.position,

            name: props.data.name,
            type: props.data.type,
            description: props.data.description,
            assignee: props.data.assignee,
            parent: props.data.parent,
            predecessors: props.data.startDate,
            date: 'This will be date',

            progress: props.data.progress,
            duration: props.data.duration,
            startDate: props.data.startDate,
            finish: props.data.finish,
            priority: props.data.priority,
            columnWidth: GCMediator.getState().tasklineCellCapacity
        };
    }

    private shouldComponentUpdate(nextState: any) {
        if (this.state !== nextState) {
            return true;
        } else {
            return false;
        }
    }

    private componentWillReceiveProps() {
        this.setState({
            id: this.props.data.id,
            order: this.props.data.order,
            collapsed: this.props.data.collapsed,
            position: this.props.data.position,

            name: this.props.data.name,
            description: this.props.data.description,
            assignee: this.props.data.assignee,
            parent: this.props.data.parent,
            predecessors: this.props.data.startDate,

            progress: this.props.data.progress,
            duration: this.props.data.duration,
            startDate: this.props.data.startDate,
            finish: this.props.data.finish,
            priority: this.props.data.priority
        });
    }

    private startTaskSelection() {
        if (!GCMediator.getState().isDragging) {
            if (GCMediator.getState().selectedTasks[0]) {
                GCMediator.dispatch({ type: 'deselectAllTasks' });
            }
            const id = this.state.id
            GCMediator.dispatch({
                type: 'selectTask',
                data: id.substring(0, id.length-3)
            });
        }
    }

    private startBarRelocation(event: MouseEvent) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const eventTarget: any = event.target;
        const startY = event.clientY;
        const startX = event.clientX;
        document.onmousemove = function (event: MouseEvent) {
            if (Math.abs(event.clientX - startX) > 30) {
                const currentState = GCMediator.getState();
                const cellCapacity = currentState.cellCapacity;
                const startDate = this.state.startDate;
                const startPointStartDate = event.pageX - startDate * cellCapacity;
                document.onmousemove = function (event: MouseEvent) {
                    const newStartDate = (event.pageX - startPointStartDate) / cellCapacity;
                    this.setState({
                        startDate: newStartDate
                    });
                }.bind(this);
            }

            if (Math.abs(event.clientY - startY) > 30) {
                const templine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                templine.setAttribute('id', 'templine');
                eventTarget.parentNode.setAttribute('transform', 'translate(0, 0)');
                templine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + eventTarget.getAttribute('width') / 2).toString());
                templine.setAttribute('strokeWidth', '2');
                templine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
                templine.setAttribute('stroke', 'rgb(80,80,220)');

                const parentNode: any = DOM.findDOMNode(this).parentNode;
                const leftMargin = parentNode.getBoundingClientRect().left;
                document.onmousemove = (event: MouseEvent) => {
                    templine.setAttribute('x2', (event.clientX - leftMargin).toString());
                    templine.setAttribute('y2', (event.clientY - 100).toString());
                };
                GCMediator.dispatch({
                    type: 'setTempline',
                    data: templine
                });
                document.getElementById('ganttChartView').appendChild(templine);
            }
        }.bind(this);
    }

    private handleRectHover(event: Event) {
        const currentState = GCMediator.getState();
        if (!currentState.isPanning) {
            if (!currentState.isDragging) {
                const el = DOM.findDOMNode(this) as any;
                const hoverElement = event.target as any;
                setTimeout(function (hoverElement) {
                    if (hoverElement.parentElement.querySelector(':hover') === hoverElement &&
                        !GCMediator.getState().isCurrentlyDragging) {
                        this.showInfoPopup(hoverElement);
                    }
                }.bind(this, hoverElement), 500);

                el.style.cursor = 'move';
            } else if (this !== currentState.draggingElement && this !== currentState.dropTarget) {
                GCMediator.dispatch({
                    type: 'setDropTarget',
                    data: this
                });
            }
        }
    }

    private clearTempElements(event: Event) {
        const currentState = GCMediator.getState();
        currentState.ganttChartView.refs.infoPopup.hide();
        if (!currentState.isDragging) {
            document.onmousemove = null;
            document.onmouseup = null;

            if (currentState.templine) {
                document.getElementById('ganttChartView').removeChild(GCMediator.getState().templine);
                GCMediator.dispatch({ type: 'removeTempline' });
            }
            if (currentState.draggingElement) {
                GCMediator.dispatch({ type: 'removeDraggingElement' });
            }
            if (currentState.dropTarget) {
                GCMediator.dispatch({ type: 'removeDropTarget' });
            }
        }
    }

    private contextMenu(event: Event) {
        this.showActionPopup(event.target);
        event.preventDefault();
        event.stopPropagation();
    }

    private showInfoPopup(hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        const popup = GCMediator.getState().ganttChartView.refs.infoPopup;

        popup.setState({
            left: coords.left + coords.width / 2 - 100,
            top: coords.top - 160,
            title: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration,
            description: this.state.description
        });
        popup.show();
    }

    private showActionPopup(hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        const popup = GCMediator.getState().ganttChartView.refs.actionTasklinePopup;

        this.startTaskSelection();
        popup.setState({
            left: coords.left + coords.width / 2 - 100,
            top: coords.top + 22,
            title: this.state.name
        });
        popup.show();
    }

    public static selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId + 'TLI');
        if (selectedElement && selectedElement.tagName === 'rect') {
            selectedElement.setAttribute('class', 'tasklineBarBody tasklineBarSelected');
        }
    }

    public static deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i] + 'TLI');
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'tasklineBarBody');
            }
        }
    }

    public render() {
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.clearTempElements.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('defs', {
            }, React.createElement('clipPath', {
                id: this.props.data.id + 'clipPath'
            }, React.createElement('rect', {
                id: this.props.data.id + 'clipRect',
                x: this.state.startDate * this.state.columnWidth+1,
                height: 28,
                width: this.state.duration * this.state.columnWidth
            }))),
            React.createElement('rect', {
                className: 'tasklineBarBody',
                id: this.props.data.id,
                x: this.state.startDate * this.state.columnWidth,
                y: 1.5,
                width: this.state.duration * this.state.columnWidth
            }),
            React.createElement('text', {
                className: 'taskLineTaskTitle',
                x: this.state.startDate * this.state.columnWidth,
                width: this.state.duration * this.state.columnWidth,
                clipPath: `url(#${this.props.data.id}clipPath)`,
                y: 12
            }, `${this.props.data.name} - ${this.props.data.description}`),
            React.createElement('text', {
                className: 'taskLineTaskDate',
                x: this.state.startDate * this.state.columnWidth,
                width: this.state.duration * this.state.columnWidth,
                clipPath: `url(#${this.props.data.id}clipPath)`,
                y: 24
            }, this.state.date)
        );
    }
}
