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
        let undoData: any;
        switch (action.type) {
            case 'reset':
                items = action.data;
                break;
            case 'updateTimeline':
                action.data = 'updateTimeline'
                isHistoryNeed = true;
                break;
            case 'createTask':
                action.data = 'item';
                let selectedTaskPosition = 0;
                let selectedTaskStartDate = 0;
                if (newState.selectedTasks) {
                    let prevElIndex = 0;
                    const prevElement = items.find((element, index) => {
                        if (element.id === newState.selectedTasks[0].id) {
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
                    if (item.id === newState.selectedTasks[0].id) {
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
                undoData = {};
                const taskId = action.selectedTask || newState.selectedTasks[0].id;
                action.data.selectedTask = action.selectedTask;
                items.find((item: any) => {
                    if (item.id === taskId) {
                        for (let prop in newData) {
                            undoData[prop] = item[prop];
                            item[prop] = newData[prop]
                        }
                        return true
                    }
                });
                newState.lastTaskChange = {
                    type: 'editTask',
                    selectedTask: taskId,
                    data: action.data
                }
                isHistoryNeed = true;
                break;
            case 'indent':
                //newState.ganttChartView.indentTask(action.data);
                isHistoryNeed = true;
                break;
            case 'outindent':
                // newState.ganttChartView.outindentTask(action.data);
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
            case 'setDropTarget':
                newState.dropTarget = action.data;
                break;
            case 'setDraggingElement':
                newState.draggingElement = action.data;
                break;
            case 'completeEditing':
                action.data = 'completeEditing'
                if (!newState.isDragging) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    newState.draggingElement = null;
                    newState.dropTarget = null;
                }
                isHistoryNeed = true;
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
                    action.data = {
                        tasks: newState.selectedTasks,
                        type: newState.selectedTasks[0].type
                    }
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
            case 'scrollGrid':
                isHistoryNeed = true;
                newState.scrollPosition = action.data;
                break;
            case 'taskUpdated':
                isHistoryNeed = true;
                break;
            case 'showInfoPopup':
                isHistoryNeed = true;
                break;
            case 'showActionChartPopup':
                isHistoryNeed = true;
                break;
            case 'hideActionChartPopup':
                isHistoryNeed = true;
                action.data = true;
            case 'showActionTimelinePopup':
                isHistoryNeed = true;
                break;
            case 'hideModalWindow':
                isHistoryNeed = true;
                action.data = true;
            case 'showModalWindow':
                isHistoryNeed = true;
                break;
            case 'hideActionTimelinePopup':
                isHistoryNeed = true;
                action.data = true;
                break;
            case 'hideAllPopups':
                isHistoryNeed = true;
                action.data = true;
                break;
            default:
                return state;
        }

        if (isHistoryNeed && action.data !== undefined) {
            newState.eventsHistory.push({
                type: action.type,
                data: action.data
            });
        }
        if (undoData && action.isHistoryNeed !== false) {
            newState.undoHistory.push({
                type: action.type,
                selectedTask: action.selectedTask || newState.selectedTasks[0].id,
                data: undoData
            });
            if (action.isRedoNeed !== false) {
                newState.redoHistory = []
            }
        } else if (undoData && action.isRedoNeed !== false) {
            newState.redoHistory.push({
                type: action.type,
                selectedTask: action.selectedTask,
                data: undoData
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

            timelineTimeItems: ChartData.timelineMonthMax,
            timelineTasks: ChartData.timelineTasks,
            timelineMilestones: ChartData.timelineMilestones,
            timelineCallouts: ChartData.timelineCallouts,
            tasklineCellCapacity: 85 / 72,

            isDragging: false,
            isLinking: false,
            isCurrentlySizing: false,
            isLineDrawStarted: false,

            timelineStep: 0,
            scrollPosition: 0,

            columnWidth: 72,
            cellCapacity: 72 / 24,

            dropTarget: null as any,
            draggingElement: null as any,
            selectedTasks: [] as any,
            lastTaskChange: [] as any,
            undoHistory: [] as any,
            redoHistory: [] as any,
            eventsHistory: [] as any,

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
        const history = AppMediator.store.getState().eventsHistory;
        if (history && AppMediator.store.getState().isCallbackNeed) {
            const length = history.length;
            return history[length - 1];
        }
        return null;
    }

    public dispatch(config: Object) {
        return AppMediator.store.dispatch(config);
    }

    public subscribe(callback: Function) {
        AppMediator.store.subscribe(callback);
    }

    public undo() {
        const mediatorState = AppMediator.instance.getState();
        const change = mediatorState.undoHistory;
        const lastChange = change[change.length - 1];
        if (lastChange) {
            mediatorState.undoHistory.splice(change.length - 1, 1)
            AppMediator.instance.dispatch({
                type: lastChange.type,
                isHistoryNeed: false,
                selectedTask: lastChange.selectedTask,
                data: lastChange.data
            })
        }
    }

    public redo() {
        const mediatorState = AppMediator.instance.getState();
        const change = mediatorState.redoHistory;
        const lastChange = change[change.length - 1];
        if (lastChange) {
            mediatorState.redoHistory.splice(change.length - 1, 1)
            AppMediator.instance.dispatch({
                type: lastChange.type,
                isRedoNeed: false,
                selectedTask: lastChange.selectedTask,
                data: lastChange.data
            })
        }
    }
} 