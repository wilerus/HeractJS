import React = require('react')
import DOM = require('react-dom')

import {AppMediator} from '../../scripts/services/ApplicationMediator'

let GCMediator: any = AppMediator.getInstance();

export class TaskBar extends React.Component<any, any> {

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
            priority: props.data.priority
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
        if (!GCMediator.getState().isDragging && !GCMediator.getState().isPanning) {
            if (GCMediator.getState().selectedTasks[0]) {
                GCMediator.dispatch({ type: 'deselectAllTasks' });
            }

            GCMediator.dispatch({
                type: 'selectTask',
                data: this.state.id
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
                        startDate: Math.round(newStartDate)
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

    private startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        if (event.button !== 2 && eventTarget.classList[0] !== 'barSelectBody') {
            let parentElement: any = null;
            let parentCoords: any = null;
            if (eventTarget.getAttribute('class') === 'barChartFillBody') {
                parentElement = eventTarget;
                eventTarget = eventTarget.parentNode.getElementsByClassName('barChartBody')[0];
                parentCoords = parentElement.getBoundingClientRect();
            }

            const elementRect = eventTarget.getBoundingClientRect();
            const clickCoordX = event.clientX;
            GCMediator.dispatch({ type: 'startDragging' });
            if (parentElement && parentCoords && clickCoordX > parentCoords.right - 15) {
                this.updateComplitionState(event);
            } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                this.startBarRelocation(event);
            } else if (clickCoordX > elementRect.right - 15) {
                this.updateСompleteDate(event);
            } else if (clickCoordX < elementRect.left + 15) {
                this.updateStartDate(event);
            }
            document.onmouseup = function (event: MouseEvent) {
                GCMediator.dispatch({
                    type: 'editTask',
                    data: {
                        duration: this.state.duration,
                        startDate: this.state.startDate,
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
                        progress: Math.round(newDuration)
                    });
                }
                this.setState({
                    duration: Math.round(newDuration)
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
                if (this.state.startDate !== newStartDate && newDuration > 1 && newStartDate > 1) {
                    // let newCompletion = this.state.progress
                    //if (newCompletion > newDuration || newCompletion === this.state.duration) {
                    //    newCompletion = newDuration
                    //}
                    this.setState({
                        startDate: Math.round(newStartDate),
                        duration: Math.round(newDuration)
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
        })
    }

    private handleRectHover(event: Event) {
        const currentState = GCMediator.getState();
        if (!currentState.isPanning) {
            const eventTarget: any = event.target;
            if (!currentState.isDragging) {
                const el = DOM.findDOMNode(this) as any;
                const elementRect = eventTarget.getBoundingClientRect();
                let hoverElement = event.target as any;
                if (hoverElement.classList[0] === 'barSelectBody') {
                    hoverElement = hoverElement.parentNode.getElementsByClassName('barChartBody')[0] ||
                        hoverElement.parentNode.getElementsByClassName('milestoneBody')[0] ||
                        hoverElement.parentNode.getElementsByClassName('projectBody')[0];
                }
                if (hoverElement) {
                    setTimeout(function (hoverElement) {
                        const currentHoverElement = hoverElement.parentElement.querySelector(':hover');
                        if (currentHoverElement && (currentHoverElement === hoverElement ||
                            currentHoverElement.classList[0] === 'barSelectBody') &&
                            !GCMediator.getState().isCurrentlyDragging) {
                            this.showInfoPopup(hoverElement);
                        }
                    }.bind(this, hoverElement), 500);
                    document.onmousemove = (event) => {
                        const clickCoordX = event.clientX;
                        if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                            el.style.cursor = 'move';
                        } else if (clickCoordX > elementRect.right - 15) {
                            el.style.cursor = 'e-resize';
                        } else if (clickCoordX < elementRect.left + 15) {
                            el.style.cursor = 'e-resize';
                        }
                    };
                }
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
        if (!currentState.isDragging && !currentState.isPanning) {
            currentState.ganttChartView.refs.infoPopup.hide();
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

    private showModalWindow() {
        const currentState = GCMediator.getState();
        const modalWindow = currentState.ganttChartView.refs.modalWindow;
        currentState.ganttChartView.refs.infoPopup.hide();
        currentState.ganttChartView.refs.actionChartPopup.hide();
        modalWindow.show();
        modalWindow.setState({
            title: this.state.name,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.startDate + this.state.duration,
            duration: this.state.duration
        });
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
        const popup = GCMediator.getState().ganttChartView.refs.actionChartPopup;
        this.startTaskSelection();
        popup.setState({
            left: coords.left + coords.width / 2 - 100,
            top: coords.top + 22,
            title: this.state.name
        });
        popup.show();
    }

    public static selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId);
        if (selectedElement && selectedElement.getAttribute('class') !== 'barSelectBody') {
            const parent = selectedElement.parentNode as any;
            const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
            selectingElement.setAttribute('class', 'barSelectBody barSelected');
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this);
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any;
        }
        selectedElement.setAttribute('class', 'barChartBody');
    }

    public static deselectAllTasks(tasks: any) {
        const currentState = GCMediator.getState();
        currentState.ganttChartView.refs.infoPopup.hide();
        currentState.ganttChartView.refs.actionChartPopup.hide();
        for (let i = 0; i < tasks.length; i++) {
            const selectedElement = document.getElementById(tasks[i]);
            if (selectedElement && selectedElement.getAttribute('class') !== 'barSelectBody') {
                const parent = selectedElement.parentNode as any;
                const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
                selectingElement.setAttribute('class', 'barSelectBody');
            }
        }
    }

    public render() {
        let element = null;
        const startDate = this.state.startDate;
        const position = this.state.position;
        const id = this.props.data.id;
        const duration = this.state.duration;
        const columnWidth = GCMediator.getState().cellCapacity;
        const configProgress = this.state.progress * duration * columnWidth / 100 - 2;
        const progress = configProgress > 0 ? configProgress : 0;
        const taskTitle = this.props.data.name;
        const taskType = this.state.type;

        switch (taskType) {
            case 'task':
                element = React.createElement('g', {
                    onMouseEnter: this.handleRectHover.bind(this),
                    onMouseOut: this.clearTempElements.bind(this),
                    onMouseDown: this.startBarUpdate.bind(this),
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this)
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position,
                        x: 0
                    }),
                    React.createElement('rect', {
                        className: 'barChartBody',
                        id: id,
                        y: position + 4,
                        x: startDate * columnWidth,
                        width: duration * columnWidth,
                        rx: 3,
                        ry: 3
                    }),
                    React.createElement('rect', {
                        className: 'barChartFillBody',
                        y: position + 5,
                        x: startDate * columnWidth + 1,
                        width: progress
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: startDate * columnWidth + duration * columnWidth,
                        y: position
                    }, taskTitle)
                );
                break;
            case 'milestone':
                element = React.createElement('g', {
                    onMouseEnter: this.handleRectHover.bind(this),
                    onMouseOut: this.clearTempElements.bind(this),
                    onMouseDown: this.startBarUpdate.bind(this),
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this),
                    y: position + 4,
                    x: startDate * columnWidth
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position,
                        x: 0
                    }),
                    React.createElement('rect', {
                        className: 'milestoneBody',
                        id: id,
                        y: position + 4,
                        x: startDate * columnWidth,
                        rx: 3,
                        ry: 3
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: startDate * columnWidth + duration * columnWidth,
                        y: position
                    }, taskTitle)
                );
                break;
            case 'project':
                element = React.createElement('g', {
                    onMouseEnter: this.handleRectHover.bind(this),
                    onMouseOut: this.clearTempElements.bind(this),
                    onMouseDown: this.startBarUpdate.bind(this),
                    onContextMenu: this.contextMenu.bind(this),
                    onDoubleClick: this.showModalWindow.bind(this),
                    onClick: this.startTaskSelection.bind(this),
                    y: position + 4,
                    x: startDate * columnWidth
                },
                    React.createElement('rect', {
                        className: 'barSelectBody',
                        y: position,
                        x: 0
                    }),
                    React.createElement('rect', {
                        className: 'projectBody',
                        id: id,
                        y: position + 10,
                        x: startDate * columnWidth,
                        width: duration * columnWidth
                    }),
                    React.createElement('text', {
                        className: 'barTitle',
                        x: startDate * columnWidth + duration * columnWidth,
                        y: position
                    }, taskTitle)
                );
                break;
            default:
                break;
        }

        return element;
    }
}
