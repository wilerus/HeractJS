import { createStore } from 'redux'
import {ChartData} from './ChartData';

export class AppMediator {
    private static subscribers: Object;
    private static instance: any;
    private static store: any;

    private static timelineWeek: Object[];
    private static timelineMonth: Object[];
    private static timelineDay: Object[];
    private static timelineYear: Object[];

    private reduser(state: any, action: any) {
        let newState = state;
        let items = newState.items;
        if (!items || items.length === 0) {
            return state;
        }
        let isHistoryNeed = false;
        switch (action.type) {
            case 'reset':
                items = action.data;
                break;
            case 'createTask':
                action.data = 'item';
                let selectedTaskPosition = 0;
                let selectedTaskStartDate = 0;
                if (newState.selectedTasks) {
                    let prevElIndex = 0;
                    const prevElement = items.find((element, index) => {
                        if (element.id === newState.selectedTasks[0]) {
                            prevElIndex = index;
                            return true;
                        }
                    })
                    selectedTaskPosition = prevElement.position + 24
                    selectedTaskStartDate = prevElement.startDate + prevElement.duration
                    items.splice(prevElIndex + 1, 0, {
                        id: `bar${items.length + 1}`,
                        barClass: '',
                        progress: 25,
                        duration: 40,
                        name: `Task ${items.length + 1}`,
                        description: `Description for ${items.length + 1}`,
                        startDate: selectedTaskStartDate,
                        type: 'task',
                        position: selectedTaskPosition,
                        link: null
                    });
                    for (let i = prevElIndex + 2; i < items.length; i++) {
                        items[i].position = 24 * i
                    }

                } else {
                    selectedTaskPosition = 24 * items.length
                    selectedTaskStartDate = 50 * items.length
                }
                isHistoryNeed = true;
                break;
            case 'removeTask':
                items.find((item: any) => {
                    if (item.id === newState.selectedTasks[0]) {
                        const elementIndex = items.indexOf(item);
                        const taskDuration = item.duration;
                        action.data = elementIndex;
                        items.splice(elementIndex, 1);
                        for (let i = elementIndex; i < items.length; i++) {
                            items[i].position = 24 * i
                            items[i].startDate -= taskDuration
                        }
                        return true
                    }
                });
                isHistoryNeed = true;
                break;
            case 'editTask':
                const newData = action.data;
                for (let prop in newData) {
                    if (prop !== 'position') {
                        items[action.data.position][prop] = newData[prop]
                    }
                }
                isHistoryNeed = true;
                break;
            case 'indent':
                newState.ganttChartView.indentTask(action.data);
                isHistoryNeed = true;
                break;
            case 'outindent':
                newState.ganttChartView.outindentTask(action.data);
                isHistoryNeed = true;
                break;
            case 'autoSchedule':
                break;
            case 'startDragging':
                newState.isDragging = true;
                break;
            case 'stopDragging':
                newState.isDragging = false;
                break;
            case 'startPanning':
                newState.isPanning = true;
                break;
            case 'stopPanning':
                newState.isPanning = false;
                break;
            case 'updateTimelineStep':
                newState.timelineStep = action.data;
                isHistoryNeed = true;
                break;
            case 'setGanttChartView':
                newState.ganttChartView = action.data;
                break;
            case 'setGanttToolbar':
                newState.toolbar = action.data;
                break;
            case 'setDropTarget':
                newState.dropTarget = action.data;
                break;
            case 'setTempline':
                newState.templine = action.data;
                break;
            case 'setDraggingElement':
                newState.draggingElement = action.data;
                break;
            case 'removeTempline':
                newState.templine = null;
                break;
            case 'setTimelineStep':
                switch (newState.timelineStep) {
                    case 0:
                        newState.cellCapacity = Math.round(54 / 72);
                        newState.columnWidth = 54;
                        newState.timeLine = AppMediator.timelineMonth;
                        break;
                    case 1:
                        newState.cellCapacity = Math.round(54 / 720);
                        newState.columnWidth = 54;
                        newState.timeLine = AppMediator.timelineYear;
                        break;
                    case 2:
                        newState.cellCapacity = Math.round(60 / 3);
                        newState.columnWidth = 60;
                        newState.timeLine = AppMediator.timelineDay;
                        break;
                    case 3:
                        newState.cellCapacity = Math.round(72 / 24);
                        newState.columnWidth = 72;
                        newState.timeLine = AppMediator.timelineWeek;
                        break;
                    default:
                        newState.cellCapacity = Math.round(54 / 72);
                        newState.columnWidth = 54;
                        newState.timeLine = AppMediator.timelineWeek;
                }
                newState.timelineStep = action.data;
                isHistoryNeed = true;
                break;
            case 'selectTask':
                newState.selectedTasks.push(action.data);
                isHistoryNeed = true;
                break;
            case 'addTaskToSelected':
                if (newState.selectedTask) {
                    newState.selectedTasks.push(newState.selectedTask);
                    newState.selectedTask = null;
                }
                newState.selectedTasks.push(action.data);
                break;
            case 'deselectAllTasks':
                if (newState.selectedTasks && newState.selectedTasks.length) {
                    action.data = newState.selectedTasks;
                    newState.selectedTasks = [];
                }
                isHistoryNeed = true;
                break;
            case 'deselectTask':
                let selectedTasks = newState.selectedTasks;
                if (selectedTasks.length > 0) {
                    selectedTasks.find((element: any, index: number) => {
                        if (element.state.id === action.data.state.id) {
                            selectedTasks.splice(index, 1);
                        }
                    });
                }
                break;
            case 'completeTask':
                items.find((element: any) => {
                    if (element.id === newState.selectedTasks[0]) {
                        const elementIndex = items.indexOf(element);
                        action.data = elementIndex;
                        items[elementIndex].progress = 100;
                    }
                });
                isHistoryNeed = true;
                break;
            case 'reopenTask':
                items.find((element: any) => {
                    if (element.id === newState.selectedTasks[0]) {
                        const elementIndex = items.indexOf(element);
                        action.data = elementIndex;
                        items[elementIndex].progress = 0;
                    }
                });
                isHistoryNeed = true;
                break;
            case 'removeLink':
                items.find((element: any) => {
                    if (element.id === newState.selectedTasks[0]) {
                        const elementIndex = items.indexOf(element);
                        action.data = elementIndex;
                        items[elementIndex].link = null;
                        return true;
                    }
                });
                isHistoryNeed = true;
                break;
            case 'addLink':
                const element = action.data.element;
                const elementIndex = action.data.elementIndex
                element.link = {
                    id: `link${elementIndex}`,
                    to: element.type === 'project' ? `bar${elementIndex + 10}` : `bar${elementIndex + 1}`,
                    type: 'finishToStart'
                };
                isHistoryNeed = true;
                break;
            case 'scrollGrid':
                isHistoryNeed = true;
                newState.scrollPosition = action.data;
                break;
            case 'removeDraggingElement':
                newState.draggingElement = null;
                break;
            case 'removeDropTarget':
                newState.dropTarget = null;
                break;
            case 'taskUpdated':
                isHistoryNeed = true;
                break;
            case 'addToTaskline':
                items.find((element: any) => {
                    if (element.id === newState.selectedTasks[0]) {
                        if (element.type === 'task') {
                            newState.tasklineTasks.push(element);
                        } else if (element.type === 'milestone') {
                            newState.tasklineMilestones.push(element);
                        }
                    }
                });
                action.data = '123';
                isHistoryNeed = true;
                break;
            case 'removeFromTaskline':
                items.find((element: any) => {
                    if (element.id === newState.selectedTasks[0]) {
                        if (element.type === 'task') {
                            newState.tasklineTasks.find((task: any, index: number) => {
                                if (task.id === element.id) {
                                    newState.tasklineTasks.splice(index, 1);
                                    return true;
                                }
                            });
                        } else if (element.type === 'milestone') {
                            newState.tasklineMilestones.find((task: any, index: number) => {
                                if (task.id === element.id) {
                                    newState.tasklineMilestones.splice(index, 1);
                                    return true;
                                }
                            });
                        }
                    }
                });
                action.data = '123';
                isHistoryNeed = true;
                break;
            default:
                return state;
        }
        if (isHistoryNeed && action.data !== undefined) {
            newState.history.push({
                type: action.type,
                data: action.data
            });
        }
        newState.isCallbackNeed = isHistoryNeed;
        return newState;
    }

    constructor() {
        new ChartData();
        const initialState = {
            items: ChartData.ganttBars,
            timeLine: ChartData.timelineWeek,

            tasklineTimeItems: ChartData.timelineMonthMax,
            tasklineTasks: ChartData.tasklineTasks,
            tasklineMilestones: ChartData.tasklineMilestones,
            tasklineCallouts: ChartData.tasklineCallouts,
            tasklineCellCapacity: 85 / 72,

            isDragging: false,
            isLinking: false,
            isCurrentlySizing: false,
            toolbar: null as any,
            isLineDrawStarted: false,

            timelineStep: 0,
            scrollPosition: 0,

            columnWidth: 72,
            ganttChartView: null as any,
            cellCapacity: 72 / 24,

            dropTarget: null as any,
            draggingElement: null as any,
            selectedTasks: [],
            history: [],
            tempLine: null as any,

            isCallbackNeed: false
        };
        AppMediator.timelineWeek = ChartData.timelineWeek;
        AppMediator.timelineMonth = ChartData.timelineMonth;
        AppMediator.timelineDay = ChartData.timelineDay;
        AppMediator.timelineYear = ChartData.timelineYear;
        AppMediator.subscribers = {};
        AppMediator.store = createStore(this.reduser, initialState);
    }

    public static getInstance(): AppMediator {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new AppMediator();
        }
        return this.instance;
    }

    public unsubscribe(subscriber) {
        delete AppMediator.subscribers[subscriber];
    }

    public getState() {
        return AppMediator.store.getState();
    }

    public getLastChange() {
        const history = AppMediator.store.getState().history;
        if (history && AppMediator.store.getState().isCallbackNeed) {
            const length = history.length;
            return history[length - 1];
        }
        return null;
    }

    public dispatch(config) {
        return AppMediator.store.dispatch(config);
    }

    public subscribe(callback: Function) {
        AppMediator.store.subscribe(callback);
    }

    private static notifySubscribers(eventType: any, currentState: any, state: any) {
        for (let subscriber in this.subscribers) {
            this.subscribers[subscriber].call(this, eventType, currentState, state);
        }
    }

    public undo() {
        return AppMediator.store.subscribe();
    }

    public redo() {
        return AppMediator.store.subscribe();
    }
} 