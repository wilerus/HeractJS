import { createStore } from 'redux'

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
            case 'initChartViewData':
                const data = action.data;
                const initialState = {
                    items: data.items,
                    timeLine: data.timelineWeek,

                    timelineTimeItems: data.timelineTimeItems,
                    timelineTasks: data.timelineTasks,
                    timelineMilestones: data.timelineMilestones,
                    timelineCallouts: data.timelineCallouts,

                    isDragging: false,
                    isLinking: false,
                    isCurrentlySizing: false,
                    isLineDrawStarted: false,

                    timelineStep: 0,
                    scrollPosition: 0,
                    timelineDateStep: 0,

                    cellCapacity: data.cellCapacity,
                    tasklineCellCapacity: data.tasklineCellCapacity,

                    dropTarget: null as any,
                    draggingElement: null as any,
                    selectedTasks: [] as any,
                    lastTaskChange: [] as any,
                    undoHistory: [] as any,
                    redoHistory: [] as any,
                    eventsHistory: [] as any,

                    isCallbackNeed: false
                };
                AppMediator.timelineWeek = data.timelineWeek;
                AppMediator.timelineMonth = data.timelineMonth;
                AppMediator.timelineDay = data.timelineDay;
                AppMediator.timelineYear = data.timelineYear;
                newState = initialState;
                break;
            case 'reset':
                items = action.data;
                break;
            case 'completeItemEditing':
                undoData = {};
                const newData = action.data;

                const taskId = newState.selectedTasks[0].id;
                newState.items.find((item: any) => {
                    if (item.id === taskId) {
                        for (let prop in newData) {
                            undoData[prop] = item[prop];
                            item[prop] = newData[prop];
                        }
                        return true;
                    }
                });
                newState.lastTaskChange = {
                    type: 'editItem',
                    selectedTask: action.selectedTask,
                    data: newData
                }
                isHistoryNeed = true;
                break;
            case 'autoSchedule':
                break;
            case 'startDragging':
                newState.isDragging = true;
                isHistoryNeed = true;
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
                        newState.timeLine = AppMediator.timelineMonth;
                        break;
                    case 1:
                        newState.cellCapacity = Math.round(54 / 720);
                        newState.timeLine = AppMediator.timelineYear;
                        break;
                    case 2:
                        newState.cellCapacity = Math.round(60 / 3);
                        newState.timeLine = AppMediator.timelineDay;
                        break;
                    case 3:
                        newState.cellCapacity = Math.round(72 / 24);
                        newState.timeLine = AppMediator.timelineWeek;
                        break;
                    default:
                        newState.cellCapacity = Math.round(54 / 72);
                        newState.timeLine = AppMediator.timelineWeek;
                }
                newState.timelineStep = action.data;
                isHistoryNeed = true;
                break;
            case 'setTimelineDateStep':
                switch (newState.timelineDateStep) {
                    case 0:
                        newState.tasklineCellCapacity = Math.round(54 / 72);
                        newState.timelineTimeItems = AppMediator.timelineMonth;
                        break;
                    case 1:
                        newState.tasklineCellCapacity = Math.round(54 / 720);
                        newState.timelineTimeItems = AppMediator.timelineYear;
                        break;
                    case 2:
                        newState.tasklineCellCapacity = Math.round(60 / 3);
                        newState.timelineTimeItems = AppMediator.timelineDay;
                        break;
                    case 3:
                        newState.tasklineCellCapacity = Math.round(72 / 24);
                        newState.timelineTimeItems = AppMediator.timelineWeek;
                        break;
                    default:
                        newState.tasklineCellCapacity = Math.round(54 / 72);
                        newState.timelineTimeItems = AppMediator.timelineWeek;
                }
                newState.timelineDateStep = action.data;
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
            case 'editItem':
                isHistoryNeed = true;
                action.data.isHistoryNeed = action.isHistoryNeed;
                action.data.isRedoNeed = action.isRedoNeed;
                break;
            case 'indent':
            case 'outindent':
            case 'createItem':
            case 'removeItem':
            case 'updateTimeline':
            case 'completeItemCreating':
            case 'completeItemRemoving':
            case 'taskUpdated':
            case 'showInfoPopup':
            case 'showActionChartPopup':
            case 'hideActionChartPopup':
            case 'showActionTimelinePopup':
            case 'hideModalWindow':
            case 'showModalWindow':
            case 'hideActionTimelinePopup':
            case 'hideAllPopups':
                isHistoryNeed = true;
                break;
            default:
                return state;
        }
        if (isHistoryNeed) {
            newState.eventsHistory.push({
                type: action.type,
                data: action.data
            });
        }
        if (undoData && action.isHistoryNeed !== false) {
            newState.undoHistory.push({
                type: action.undoType,
                selectedTask: action.selectedTask || newState.selectedTasks[0].id,
                data: undoData
            });
            if (action.isRedoNeed !== false) {
                newState.redoHistory = []
            }
        } else if (undoData && action.isRedoNeed !== false) {
            newState.redoHistory.push({
                type: action.undoType,
                selectedTask: action.selectedTask,
                data: undoData
            });
        }
        newState.isCallbackNeed = isHistoryNeed;
        return newState;
    }

    constructor() {
        const initialState = {
            items: Array,
            timeLine: Array,

            timelineTimeItems: Array,
            timelineTasks: Array,
            timelineMilestones: Array,
            timelineCallouts: Array,
            tasklineCellCapacity: Number,

            isDragging: false,
            isLinking: false,
            isCurrentlySizing: false,
            isLineDrawStarted: false,

            timelineStep: 0,
            timelineDateStep: 0,
            scrollPosition: 0,

            columnWidth: Number,
            cellCapacity: Number,

            dropTarget: null as any,
            draggingElement: null as any,
            selectedTasks: [] as any,
            lastTaskChange: [] as any,
            undoHistory: [] as any,
            redoHistory: [] as any,
            eventsHistory: [] as any,

            isCallbackNeed: false
        };
        AppMediator.store = createStore(this.reduser, initialState);
    }

    public static getInstance(): AppMediator {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new AppMediator();
        }
        return this.instance;
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

    public unsubscribe(subscribeFunction: Function) {
        subscribeFunction();
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