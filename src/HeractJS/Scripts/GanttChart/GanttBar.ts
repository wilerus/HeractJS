import * as React from 'react';
import * as DOM from 'react-dom';
import {AppMediator} from '../../scripts/services/ApplicationMediator'

export class ChartBar extends React.Component<any, any> {
    public appMediator: any;
    public rect = React.createFactory('rect');
    public text = React.createFactory('text');

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
        const currentState = this.appMediator.getState();
        if (!currentState.isDragging) {
            const selectedTaskId = currentState.selectedTasks[0] && currentState.selectedTasks[0].id;
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

    public startBarRelocation(event: MouseEvent, eventTarget: HTMLElement) {
        this.appMediator.dispatch({
            type: 'setDraggingElement',
            data: this
        });
        const startY = event.clientY;
        const startX = event.clientX;
        const isTimelineBar = eventTarget.id.indexOf('TLI') !== -1;
        document.onmousemove = (event: MouseEvent) => {
            if (Math.abs(event.clientX - startX) > 30 || isTimelineBar) {
                const startDate = event.pageX;
                const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
                const parentElement: HTMLElement = eventTarget.parentNode as HTMLElement
                switch (eventTarget.classList[0]) {
                    case 'milestoneBody':
                        const connection = parentElement.getElementsByClassName('bodyConnection')[0];
                        const title = parentElement.getElementsByClassName('barTitle')[0];
                        document.onmousemove = (moveEvent: MouseEvent) => {
                            const newStartDate = startPointStartDate + (moveEvent.pageX - startDate) as any;
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate);
                                title.setAttribute('x', (newStartDate - 40) + 'px');
                                if (connection) {
                                    connection.setAttribute('x1', newStartDate + 7.5);
                                    connection.setAttribute('x2', newStartDate + 7.5);
                                }
                            }
                        };
                        break;
                    case 'tasklineBarBody':
                        const titleElement = parentElement.getElementsByClassName('taskLineTaskTitle')[0];
                        const dateElement = parentElement.getElementsByClassName('taskLineTaskDate')[0];
                        const clipPath = parentElement.getElementsByClassName('clipRect')[0];
                        document.onmousemove = (moveEvent: MouseEvent) => {
                            const newStartDate = Math.round(startPointStartDate + (moveEvent.pageX - startDate)) as any;
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate);
                                titleElement.setAttribute('x', newStartDate);
                                dateElement.setAttribute('x', newStartDate);
                                clipPath.setAttribute('x', newStartDate);
                            }
                        }
                        break;
                    case 'barChartBody':
                        const fillTarget = parentElement.getElementsByClassName('barChartFillBody')[0];
                        document.onmousemove = (moveEvent: MouseEvent) => {
                            const newStartDate = Math.round(startPointStartDate + (moveEvent.pageX - startDate)) as any;
                            if (newStartDate > 0) {
                                eventTarget.setAttribute('x', newStartDate);
                                fillTarget.setAttribute('x', newStartDate);
                            }
                        }
                        break;
                    default:
                        break;
                }
            } else if (Math.abs(event.clientY - startY) > 30) {
                this.drawHelpLink(eventTarget);
            }
        }
    }

    public drawHelpLink(eventTarget: HTMLElement) {
        const templine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        templine.setAttribute('id', 'templine');
        templine.setAttribute('x1', (parseInt(eventTarget.getAttribute('x')) + parseInt(eventTarget.getAttribute('width')) / 2).toString());
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
        const documentAny = document as any
        const clickCoordX = event.clientX;
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
                    if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                        this.startBarRelocation(event, eventTarget);
                    } else if (clickCoordX > elementRect.right - 15) {
                        this.updateСompleteDate(event, eventTarget);
                    } else if (clickCoordX < elementRect.left + 15) {
                        this.updateStartDate(event, eventTarget);
                    }
                    break;
                case 'barChartFillBody':
                    if (clickCoordX > elementRect.right - 15) {
                        this.updateComplitionState(event, eventTarget);
                    } else {
                        eventTarget = eventTarget.parentNode.getElementsByClassName('barChartBody')[0];
                        if (clickCoordX > elementRect.left + 15 && clickCoordX < elementRect.right - 15) {
                            this.startBarRelocation(event, eventTarget);
                        } else if (clickCoordX < elementRect.left + 15) {
                            this.updateStartDate(event, eventTarget);
                        }
                    }
                    break;
                default:
                    break;
            }
            this.completeBarUpdating(eventTarget)
        }
    }

    public updateСompleteDate(event: any, eventTarget: any) {
        const cellCapacity = this.state.cellCapacity;
        const duration = this.state.duration;
        const startPoint = event.pageX - duration * cellCapacity;
        let newDuration = startPoint;
        document.onmousemove = (moveEvent: MouseEvent) => {
            newDuration = Math.round(moveEvent.pageX - startPoint);
            if (newDuration > 0) {
                eventTarget.setAttribute('width', newDuration)
            }
        };
    }

    public updateStartDate(event: MouseEvent, eventTarget: any) {
        const startDate = event.pageX;
        const startPointStartDate = parseInt(eventTarget.getAttribute('x'));
        const startWidth = parseInt(eventTarget.getAttribute('width'));
        const fillTarget = eventTarget.parentNode.getElementsByClassName('barChartFillBody')[0];
        document.onmousemove = (moveEvent: MouseEvent) => {
            const newStartDate = Math.round(startPointStartDate + (moveEvent.pageX - startDate));
            const newWidth = Math.round(startWidth + (startDate - moveEvent.pageX));
            if (newStartDate > 0 && newWidth > 1) {
                eventTarget.setAttribute('x', newStartDate);
                if (fillTarget) {
                    fillTarget.setAttribute('x', newStartDate);
                }
                eventTarget.setAttribute('width', newWidth);
            }
        };
    }

    public updateComplitionState(event: MouseEvent, eventTarget: HTMLElement) {
        const clickCoordX = event.pageX;
        const parentElement: HTMLElement = eventTarget.parentNode as HTMLElement
        const maxWidth: number = parseInt(parentElement.getElementsByClassName('barChartBody')[0].getAttribute('width'));
        const width = parseInt(eventTarget.getAttribute('width'));
        document.onmousemove = (moveEvent: MouseEvent) => {
            const newComplition = Math.round(width + (moveEvent.pageX - clickCoordX)) as any;
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
                    setTimeout(function (actionElement: HTMLElement, clientX: number) {
                        const currentHoverElement: HTMLElement = actionElement.parentElement.querySelector(':hover') as HTMLElement;
                        if (currentHoverElement && currentHoverElement === actionElement && !currentState.isDragging) {
                            this.showInfoPopup(clientX, actionElement);
                            currentHoverElement.onmouseout = () => {
                                this.appMediator.dispatch({ type: 'completeEditing' });
                            }
                        }
                    }.bind(this, hoverElement, event.clientX), 500);
                    document.onmousemove = (moveEvent) => {
                        const clickCoordX = moveEvent.clientX;
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

    public showInfoPopup(clientX: number, hoverElement: HTMLElement) {
        const coords = hoverElement.getBoundingClientRect();
        let leftMargin: number;
        const topMargin: number = coords.top - 160 < 0 ? coords.top + 30 : coords.top - 160;

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
        let type: string = 'showActionChartPopup';
        let target: string = 'task';
        const topMargin: number = coords.top + 22;
        this.startTaskSelection();
        if (eventTarget.classList[0] === 'barSelectBody') {
            leftMargin = event.clientX;
        } else {
            leftMargin = coords.left + coords.width / 2 - 100;
            type = 'showActionTimelinePopup';
            switch (eventTarget.classList[0]) {
                case 'tasklineBarBody':
                    target = 'task';
                    break;
                case 'milestoneBody':
                    target = 'milestone';
                    break;
                default:
                    target = 'callouts';
                    break;
            }
        }
        this.appMediator.dispatch({
            type: type,
            data: {
                left: leftMargin,
                top: topMargin,
                title: this.state.name,
                target: target
            }
        })
        event.preventDefault();
        event.stopPropagation();
    }

    public selectTask(taskId: string) {
        const selectedElement = document.getElementById(taskId);
        const parent = selectedElement.parentNode as any;
        const selectingElement = parent.getElementsByClassName('barSelectBody')[0];
        const selectedTimelineElement = document.getElementById(taskId + 'TLI');

        selectingElement.setAttribute('class', 'barSelectBody selected');
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

    public deselectAllTasks(tasks: any = []) {
        for (let i = 0; i < tasks.length; i++) {
            const selectedChartElement = document.getElementById(tasks[i].id);
            const selectedTimelineElement = document.getElementById(tasks[i].id + 'TLI');
            const parent = selectedChartElement.parentNode as any;
            const selectingElement = parent.getElementsByClassName('barSelectBody')[0];

            selectingElement.setAttribute('class', 'barSelectBody');
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

    public completeBarUpdating(eventTarget: HTMLElement) {
        document.onmouseup = () => {
            let data: Object = [];
            const elementWidth: number = parseInt(eventTarget.getAttribute('width'));
            const cellCapacity = this.state.cellCapacity;
            const parentElement: HTMLElement = eventTarget.parentNode as HTMLElement;
            document.getElementsByClassName('ganttChartView')[0].style.transition = 'all .2s';
            document.getElementsByClassName('tasklineBars')[0].style.transition = 'all .2s';
            document.getElementsByClassName('tasklineMilestones')[0].style.transition = 'all .2s';
            switch (eventTarget.classList[0]) {
                case 'milestoneBody':
                    data = {
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / cellCapacity)
                    }
                    break;
                case 'tasklineBarBody':
                case 'barChartBody':
                    data = {
                        duration: Math.round(elementWidth / cellCapacity),
                        startDate: Math.round(parseInt(eventTarget.getAttribute('x')) / cellCapacity)
                    }
                    break;
                case 'barChartFillBody':
                    data = {
                        progress: Math.round((elementWidth + 2) / parseInt(parentElement.getElementsByClassName('barChartBody')[0].getAttribute('width')) * 100)
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
