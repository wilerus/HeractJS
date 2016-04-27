import React = require('react')
import DOM = require('react-dom')

import {AppMediator} from '../../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TasklineMilestone extends React.Component<any, any> {

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
            const id = this.state.id;
            GCMediator.dispatch({
                type: 'selectTask',
                data: id.substring(0, id.length - 3)
            });
        }
    }

    private startBarRelocation(event: MouseEvent, eventTarget) {
        GCMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const currentState = GCMediator.getState();
        const startDate = event.pageX;
        const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
        document.onmousemove = (event: MouseEvent) => {
            const newStartDate = startPointStartDate + (event.pageX - startDate);
            if (newStartDate > 0) {
                eventTarget.setAttribute('x', newStartDate)
            }
        };
    }

    private startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        if (event.button !== 2) {
            const elementRect = eventTarget.getBoundingClientRect();
            const clickCoordX = event.clientX;
            GCMediator.dispatch({ type: 'startDragging' });
            this.startBarRelocation(event, eventTarget);
            document.onmouseup = function (event: MouseEvent) {
                GCMediator.dispatch({
                    type: 'editTask',
                    data: {
                        duration: eventTarget.getAttribute('width') / GCMediator.getState().tasklineCellCapacity,
                        startDate: parseInt(event.target.getAttribute('x')) / GCMediator.getState().tasklineCellCapacity,
                        position: this.state.position / 24
                    }
                })
                GCMediator.dispatch({ type: 'stopDragging' })
                this.clearTempElements(event)
            }.bind(this)
        }
    }

    private updateСompleteDate(event: MouseEvent) {
        const cellCapacity = GCMediator.getState().cellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        let newCompletion = this.state.progress / cellCapacity;
        document.onmousemove = function (event) {
            newDuration = (event.pageX - startPoint) / cellCapacity;
            if (newDuration) {
                newCompletion = this.state.progress / cellCapacity;
                if (newCompletion > newDuration || newCompletion === duration) {
                    this.setState({
                        progress: newDuration
                    });
                }
                this.setState({
                    duration: newDuration
                });
            }
        }.bind(this);
    }

    private updateStartDate(event: MouseEvent) {
        if (!document.onmousemove) {
            const currentState = GCMediator.getState();
            const cellCapacity = currentState.cellCapacity;
            const startDate = this.state.startDate;
            const startPointStartDate = event.pageX - startDate * cellCapacity;
            document.onmousemove = function (event: MouseEvent) {
                const newStartDate = (event.pageX - startPointStartDate) / cellCapacity;
                const newDuration = this.state.duration - (newStartDate - this.state.startDate);
                if (this.state.startDate !== newStartDate && newDuration) {
                    // let newCompletion = this.state.progress
                    //if (newCompletion > newDuration || newCompletion === this.state.duration) {
                    //    newCompletion = newDuration
                    //}
                    this.setState({
                        startDate: newStartDate,
                        duration: newDuration
                        // progress: newCompletion
                    });
                }
            }.bind(this);
        }
    }

    private updateComplitionState(event: MouseEvent) {
        const eventTarget: any = event.target;
        const elementRect = eventTarget.getBoundingClientRect();
        const clickCoordX = event.clientX;
        if (clickCoordX > elementRect.right - 15) {
            document.onmousemove = function (event) {
                const parentNode: any = DOM.findDOMNode(this).parentNode;
                const leftMargin = parentNode.getBoundingClientRect().left;
                let newComplition = event.pageX - event.target.getAttribute('x') - leftMargin;
                newComplition = newComplition / GCMediator.getState().cellCapacity;
                if (newComplition <= 0) {
                    newComplition = 0;
                } else if (this.state.duration < newComplition) {
                    newComplition = this.state.duration;
                }
                this.setState({
                    progress: newComplition
                });
            }.bind(this);
            document.onmouseup = function (event) {
                this.clearTempElements(event);
                document.onmousemove = null;
                document.onmouseup = null;
            }.bind(this);
        }
    }

    private addNewConnection(event: MouseEvent) {
        const currentState = GCMediator.getState();
        const currentItems = currentState.items;
        GCMediator.dispatch({
            type: 'create',
            item: {
                id: `connection ${currentItems.length + 1}`,
                firstP: currentState.draggingElement,
                endP: currentState.dropTarget,
                type: 'connection'
            }
        });
        document.onmousemove = null;
        this.clearTempElements(event);
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

    private showModalWindow() {
        const currentState = GCMediator.getState();
        const modalWindow = currentState.ganttChartView.refs.modalWindow;
        currentState.ganttChartView.refs.infoPopup.hide();
        modalWindow.show();
        modalWindow.setState({
            title: this.state.name,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration
        });
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
            selectedElement.setAttribute('class', 'milestoneBody milestoneSelected');
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this);
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any;
        }
        selectedElement.setAttribute('class', 'milestoneBody');
    }

    public static deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i] + 'TLI');
            if (selectedElement && selectedElement.tagName === 'rect') {
                selectedElement.setAttribute('class', 'milestoneBody');
            }
        }
    }

    public render() {
        const startDate = this.state.startDate;
        const columnWidth = this.state.columnWidth;
        return React.createElement('g', {
            onMouseEnter: this.handleRectHover.bind(this),
            onMouseOut: this.clearTempElements.bind(this),
            onMouseDown: this.startBarUpdate.bind(this),
            onContextMenu: this.contextMenu.bind(this),
            onDoubleClick: this.showModalWindow.bind(this),
            onClick: this.startTaskSelection.bind(this)
        },
            React.createElement('rect', {
                className: 'milestoneBody',
                id: this.props.data.id,
                x: startDate * columnWidth,
                y: 3,
                rx: 3,
                ry: 3
            }),
            React.createElement('line', {
                x1: startDate * columnWidth + 7.5,
                y1: 20,
                x2: startDate * columnWidth + 7.5,
                y2: 30,
                strokeWidth: 1,
                stroke: 'rgb(120,120,120)'
            }),
            React.createElement('text', {
                className: 'barTitle',
                x: startDate * columnWidth - 40,
                y: 40
            }, 'This will be date')
        );
    }
}
