import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../scripts/services/ApplicationMediator'

export class ChartBar extends React.Component<any, any> {
    appMediator: any;
    constructor(props: any, context: any) {
        super(props, context);
        this.appMediator = AppMediator.getInstance();
        this.appMediator.subscribe(function () {
            const change = this.appMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'deselectAllTasks':
                        this.deselectAllTasks(change.data.tasks);
                        break;
                    case 'selectTask':
                        this.selectTask(change.data.id);
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    public shouldComponentUpdate(nextState: any) {
        if (JSON.stringify(this.state) !== JSON.stringify(nextState.data)) {
            return true;
        } else {
            return false;
        }
    }

    public startTaskSelection() {
        if (!this.appMediator.getState().isDragging) {
            const selectedTaskId = this.appMediator.getState().selectedTasks[0] && this.appMediator.getState().selectedTasks[0].id;
            const id = this.state.id.replace('TLI', '');
            if (selectedTaskId !== id) {
                if (selectedTaskId) {
                    this.appMediator.dispatch({ type: 'deselectAllTasks' });
                }
                this.appMediator.dispatch({
                    type: 'selectTask',
                    data: {
                        id: id,
                        type: this.state.type
                    }
                });
            }
        }
    }

    public startBarRelocation(event: MouseEvent, eventTarget) {
        this.appMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const startY = event.clientY;
        const startX = event.clientX;
        const isTimelineBar = eventTarget.id.indexOf('TLI') !== -1;

        document.onmousemove = function (event: MouseEvent) {
            if (Math.abs(event.clientX - startX) > 30 || isTimelineBar) {
                const startDate = event.pageX;
                const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
                switch (eventTarget.classList[0]) {
                    case 'milestoneBody':
                        const connection = eventTarget.parentNode.getElementsByClassName('bodyConnection')[0];
                        const title = eventTarget.parentNode.getElementsByClassName('barTitle')[0];
                        document.onmousemove = (event: MouseEvent) => {
                            const newStartDate = startPointStartDate + (event.pageX - startDate);
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate)
                                connection.setAttribute('x1', newStartDate + 7.5)
                                connection.setAttribute('x2', newStartDate + 7.5)
                                title.setAttribute('x', newStartDate - 40)
                            }
                        };
                        break;
                    case 'tasklineBarBody':
                        const titleElement = eventTarget.parentNode.getElementsByClassName('taskLineTaskTitle')[0];
                        const dateElement = eventTarget.parentNode.getElementsByClassName('taskLineTaskDate')[0];
                        const clipPath = eventTarget.parentNode.getElementsByClassName('clipRect')[0];
                        document.onmousemove = (event: MouseEvent) => {
                            const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate)
                                titleElement.setAttribute('x', newStartDate)
                                dateElement.setAttribute('x', newStartDate)
                                clipPath.setAttribute('x', newStartDate)
                            }
                        }
                        break;
                    case 'barChartBody':
                        const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
                        document.onmousemove = (event: MouseEvent) => {
                            const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate)
                                fillTarget.setAttribute('x', newStartDate)
                            }
                        }
                        break;
                    default:
                        break;
                }
            } else if (Math.abs(event.clientY - startY) > 30) {
                this.drawHelpLink(eventTarget)
            }
        }.bind(this);
    }

    public drawHelpLink(eventTarget) {
        const templine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        templine.setAttribute('id', 'templine');
        templine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + eventTarget.getAttribute('width') / 2).toString());
        templine.setAttribute('strokeWidth', '2');
        templine.setAttribute('y1', (eventTarget.getAttribute('y')).toString());
        templine.setAttribute('stroke', 'rgb(80,80,220)');

        const parentNode: any = DOM.findDOMNode(this).parentNode;
        const leftMargin = parentNode.getBoundingClientRect().left;
        const topMargin = parentNode.getBoundingClientRect().top;
        document.onmousemove = (event: MouseEvent) => {
            templine.setAttribute('x2', (event.clientX - leftMargin).toString());
            templine.setAttribute('y2', (event.clientY - topMargin).toString());
        };

        document.onmouseup = () => {
            const currentState = this.appMediator.getState();
            const selectedTaskState = currentState.dropTarget.state;
            if (!currentState.draggingElement.state.link) {
                this.appMediator.dispatch({
                    type: 'editItem',
                    data: {
                        link: {
                            id: `link${currentState.draggingElement.state.position / 24}`,
                            to: selectedTaskState.type === 'project' ? `bar${selectedTaskState.position / 24 + 10}` : `bar${selectedTaskState.position / 24 + 1}`,
                            type: 'finishToStart'
                        }
                    }
                });
            }
            document.getElementById('ganttChartView').removeChild(templine);
        }
        document.getElementById('ganttChartView').appendChild(templine);
    }

    public startBarUpdate(event: MouseEvent) {
        let eventTarget: any = event.target;
        let documentAny = document as any
        let clickCoordX = event.clientX;
        if (documentAny.selection) {
            documentAny.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        const elementRect = eventTarget.getBoundingClientRect() as any;
        if (event.button !== 2 && eventTarget.classList[0] !== 'barSelectBody') {
            this.startTaskSelection();
            this.appMediator.dispatch({ type: 'startDragging' });
            switch (eventTarget.classList[0]) {
                case 'milestoneBody':
                    this.startBarRelocation(event, eventTarget);
                    break;
                case 'tasklineBarBody':
                    if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                        this.startBarRelocation(event, eventTarget);
                    } else if (clickCoordX > elementRect.right - 15) {
                        this.updateСompleteDate(event, eventTarget);
                    } else if (clickCoordX < elementRect.left + 15) {
                        this.updateStartDate(event, eventTarget);
                    }
                    break;
                case 'barChartBody':
                    let focusTarget = eventTarget;
                    if (eventTarget.getAttribute('class') === 'barChartFillBody') {
                        focusTarget = eventTarget.parentNode.getElementsByClassName('barChartBody')[0];
                    }
                    let parentCoords = eventTarget.getBoundingClientRect();

                    if (parentCoords && clickCoordX > parentCoords.right - 15) {
                        this.updateComplitionState(event, eventTarget);
                    } else if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                        this.startBarRelocation(event, focusTarget);
                    } else if (clickCoordX > elementRect.right - 15) {
                        this.updateСompleteDate(event, focusTarget);
                    } else if (clickCoordX < elementRect.left + 15) {
                        this.updateStartDate(event, focusTarget);
                    }
                    break;
                default:
                    break;
            }
            this.completeBarUpdating(eventTarget)
        }
    }

    public updateСompleteDate(event: any, eventTarget: any) {
        const cellCapacity = this.appMediator.getState().cellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        document.onmousemove = (event) => {
            newDuration = Math.round(event.pageX - startPoint);
            if (newDuration > 0) {
                eventTarget.setAttribute('width', newDuration)
            }
        };
    }

    public updateStartDate(event: MouseEvent, eventTarget: any) {
        if (!document.onmousemove) {
            const startDate = event.pageX;
            const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
            const startWidth = parseInt(eventTarget.getAttribute('width'));
            const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
            document.onmousemove = (event: MouseEvent) => {
                const newStartDate = Math.round(startPointStartDate + (event.pageX - startDate));
                const newWidth = Math.round(startWidth + (startDate - event.pageX));
                if (newStartDate > 0 && newWidth > 1) {
                    eventTarget.setAttribute('x', newStartDate)
                    fillTarget.setAttribute('x', newStartDate)
                    eventTarget.setAttribute('width', newWidth)
                }
            };
        }
    }

    public updateComplitionState(event: MouseEvent, eventTarget) {
        const clickCoordX = event.pageX;
        const maxWidth = eventTarget.parentNode.getElementsByClassName('barChartBody')[0].getAttribute('width');
        const width = parseInt(eventTarget.getAttribute('width'));
        document.onmousemove = (event) => {
            const newComplition = Math.round(width + (event.pageX - clickCoordX));
            if (newComplition > 0 && newComplition < maxWidth) {
                eventTarget.setAttribute('width', newComplition);
            }
        }
    }

    public addNewConnection(event: MouseEvent) {
        const currentState = this.appMediator.getState();
        const currentItems = currentState.items;
        this.appMediator.dispatch({
            type: 'create',
            item: {
                id: `connection ${currentItems.length + 1}`,
                firstP: currentState.draggingElement,
                endP: currentState.dropTarget,
                type: 'connection'
            }
        })
    }

    public handleRectHover(event: MouseEvent) {
        const currentState = this.appMediator.getState();
        if (!currentState.isPanning) {
            const eventTarget: any = event.target;
            if (!currentState.isDragging) {
                const el = DOM.findDOMNode(this) as any;
                const elementRect = eventTarget.getBoundingClientRect();
                let hoverElement = event.target as any;
                switch (hoverElement.parentNode.classList[0]) {
                    case 'barSelectBody':
                        hoverElement = hoverElement.parentNode.getElementsByClassName('barSelectBody')[0]
                        break;
                    default:
                        break;
                }
                if (hoverElement) {
                    setTimeout(function (hoverElement, clientX: number) {
                        let currentHoverElement = hoverElement.parentElement.querySelector(':hover');
                        if (currentHoverElement && currentHoverElement === hoverElement && !currentState.isDragging) {
                            this.showInfoPopup(clientX, hoverElement);
                            currentHoverElement.onmouseout = () => {
                                this.appMediator.dispatch({ type: 'completeEditing' });
                            }
                        }
                    }.bind(this, hoverElement, event.clientX), 500);
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
                this.appMediator.dispatch({
                    type: 'setDropTarget',
                    data: this
                });
            }
        }
    }

    public showInfoPopup(clientX, hoverElement) {
        const coords = hoverElement.getBoundingClientRect();
        let leftMargin: number;
        let topMargin: number = coords.top - 160 < 0 ? coords.top + 30 : coords.top - 160;

        if (hoverElement.getAttribute('class') === 'barSelectBody') {
            leftMargin = clientX;
        } else {
            leftMargin = coords.left + coords.width / 2 - 100;
        }
        this.appMediator.dispatch({
            type: 'showInfoPopup',
            data: {
                left: leftMargin,
                top: topMargin,
                title: this.state.name,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration,
                description: this.state.description
            }
        })
    }

    public showActionPopup(event: MouseEvent) {
        const eventTarget = event.target as any;
        const coords = eventTarget.getBoundingClientRect();
        let leftMargin: number;
        let topMargin: number = coords.top + 22;
        this.startTaskSelection();
        if (eventTarget.getAttribute('class') === 'barSelectBody barSelected') {
            leftMargin = event.clientX;
        } else {
            leftMargin = coords.left + coords.width / 2 - 100;
        }
        this.appMediator.dispatch({
            type: 'showActionChartPopup',
            data: {
                left: leftMargin,
                top: topMargin,
                title: this.state.name
            }
        })
        event.preventDefault();
        event.stopPropagation();
    }

    public selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId);
        if (selectedElement) {
            const parent = selectedElement.parentNode as any;
            const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
            if (selectingElement) {
                selectingElement.setAttribute('class', 'barSelectBody selected');
            }
        }

        const selectedTimelineElement = document.getElementById(taskId + 'TLI');
        if (selectedTimelineElement) {
            selectedTimelineElement.setAttribute('class', selectedTimelineElement.classList[0] + ' selected');
        }
    }

    public deselectTask() {
        let selectedElement = DOM.findDOMNode(this);
        if (selectedElement.tagName === 'g') {
            selectedElement = selectedElement.childNodes[0] as any;
        }
        selectedElement.setAttribute('class', 'barChartBody');
    }

    public deselectAllTasks(tasks: any) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedChartElement = document.getElementById(tasks[i].id);
            if (selectedChartElement) {
                const parent = selectedChartElement.parentNode as any;
                const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
                if (selectingElement) {
                    selectingElement.setAttribute('class', 'barSelectBody');
                }
            }

            const selectedTimelineElement = document.getElementById(tasks[i].id + 'TLI');
            if (selectedTimelineElement) {
                selectedTimelineElement.setAttribute('class', selectedTimelineElement.classList[0]);
            }
        }
    }

    public showModalWindow() {
        this.appMediator.dispatch({ type: 'hideAllPopups' })
        this.appMediator.dispatch({
            type: 'showModalWindow',
            data: {
                title: this.state.name,
                description: this.state.description,
                startDate: this.state.startDate,
                endDate: this.state.startDate + this.state.duration,
                duration: this.state.duration
            }
        })
    }

    public completeBarUpdating(eventTarget) {
        document.onmouseup = () => {
            let data: Object
            switch (eventTarget.classList[0]) {
                case 'milestoneBody':
                    data = {
                        duration: Math.round(eventTarget.getAttribute('width') / this.appMediator.getState().tasklineCellCapacity),
                    }
                    break;
                case 'tasklineBarBody':
                    data = {
                        duration: Math.round(eventTarget.getAttribute('width') / this.appMediator.getState().tasklineCellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / this.appMediator.getState().tasklineCellCapacity)
                    }
                    break;
                case 'barChartBody':
                    data = {
                        duration: Math.round(eventTarget.getAttribute('width') / this.appMediator.getState().cellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / this.appMediator.getState().cellCapacity)
                    }
                case 'barChartFillBody':
                    data = {
                        progress: Math.round((parseInt(eventTarget.getAttribute('width')) + 2) / parseInt(eventTarget.parentNode.getElementsByClassName('barChartBody')[0].getAttribute('width')) * 100)
                    }
                    break;
                default:
                    break;
            }
            this.appMediator.dispatch({
                type: 'editItem',
                data: data
            })
            this.appMediator.dispatch({ type: 'stopDragging' })
            this.appMediator.dispatch({ type: 'completeEditing' });
        }
    }
}
