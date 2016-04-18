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
        let newState = state
        let isHistoryNeed = false
        switch (action.type) {
            case 'reset':
                newState.items = action.data
                break

            case 'createTask':
                action.data = 'item'
                let selectedTaskPosition = 0
                let selectedTaskStartDate = 0

                if (newState.selectedTasks) {
                    let prevElIndex = 0
                    const prevElement = newState.items.find((element, index) => {
                        if (element.id === newState.selectedTasks[0]) {
                            prevElIndex = index
                            return true
                        }
                    })
                    selectedTaskPosition = prevElement.position + 22
                    selectedTaskStartDate = prevElement.startDate + prevElement.duration
                    newState.items.splice(prevElIndex + 1, 0, {
                        id: `bar${newState.items.length + 1}`,
                        barClass: '',
                        type: 'bar',
                        progress: 25,
                        duration: 80,
                        name: `Task ${newState.items.length + 1}`,
                        description: `Description for ${newState.items.length + 1}`,
                        startDate: selectedTaskStartDate,
                        position: selectedTaskPosition,
                        link: null
                    })

                    for (let i = prevElIndex + 2; i < newState.items.length; i++) {
                        newState.items[i].position = 22 * i
                    }
                } else {
                    selectedTaskPosition = 22 * newState.items.length
                    selectedTaskStartDate = 50 * newState.items.length
                }
                isHistoryNeed = true
                break

            case 'removeTask':
                let element: any
                let elementIndex: number
                if (newState.items.length > 0) {
                    element = newState.items.find((element: any, index: number) => {
                        if (element.id === newState.selectedTasks[0]) {
                            return index
                        }
                    })
                    elementIndex = newState.items.indexOf(element)
                    const taskDuration = element.duration
                    if (element) {
                        action.data = elementIndex
                        newState.items.splice(elementIndex, 1);
                        newState.items[elementIndex - 1].link = null
                        for (let i = elementIndex; i < newState.items.length; i++) {
                            newState.items[i].position = 22 * i
                            newState.items[i].startDate -= taskDuration
                        }
                    }
                }
                isHistoryNeed = true
                break

            case 'editTask':
                const newData = action.data
                // const newDataLength = newData.length
                for (let prop in newData) {
                    newState.items[action.data.position / 22][prop] = newData[prop]
                }
                isHistoryNeed = true
                break

            case 'indent':
                newState.ganttChartView.indentTask(action.data)
                isHistoryNeed = true
                break

            case 'outindent':
                newState.ganttChartView.outindentTask(action.data)
                isHistoryNeed = true
                break

            case 'autoSchedule':
                break

            case 'startDragging':
                newState.isDragging = true
                break

            case 'stopDragging':
                newState.isDragging = false
                break

            case 'startPanning':
                newState.isPanning = true
                break

            case 'stopPanning':
                newState.isPanning = false
                break

            case 'updateTimelineStep':
                newState.timelineStep = action.data
                isHistoryNeed = true
                break
            case 'setGanttChartView':
                newState.ganttChartView = action.data
                break

            case 'setDropTarget':
                newState.dropTarget = action.data
                break

            case 'setTempline':
                newState.templine = action.data
                break

            case 'setDraggingElement':
                newState.draggingElement = action.data
                break

            case 'removeTempline':
                newState.templine = null
                break

            case 'setTimelineStep':
                switch (newState.timelineStep) {
                    case 0:
                        newState.cellCapacity = Math.round(54 / 72)
                        newState.timeLine = AppMediator.timelineMonth
                        break;
                    case 1:
                        newState.cellCapacity = Math.round(54 / 720)
                        newState.timeLine = AppMediator.timelineYear
                        break;
                    case 2:
                        newState.cellCapacity = Math.round(60 / 3)
                        newState.timeLine = AppMediator.timelineDay
                        break;
                    case 3:
                        newState.cellCapacity = Math.round(72 / 24)
                        newState.timeLine = AppMediator.timelineWeek
                        break;
                    default:
                        newState.cellCapacity = Math.round(54 / 72)
                        newState.timeLine = AppMediator.timelineWeek
                }
                newState.timelineStep = action.data
                isHistoryNeed = true
                break

            case 'selectTask':
                newState.selectedTasks.push(action.data)
                isHistoryNeed = true
                break

            case 'addTaskToSelected':
                if (newState.selectedTask) {
                    newState.selectedTasks.push(newState.selectedTask)
                    newState.selectedTask = null
                }
                newState.selectedTasks.push(action.data)//todo check if exist
                break

            case 'deselectAllTasks':
                if (newState.selectedTasks && newState.selectedTasks.length) {
                    action.data = newState.selectedTasks
                    newState.selectedTasks = []
                }
                break

            case 'deselectTask':
                let selectedTasks = newState.selectedTasks
                if (selectedTasks.length > 0) {
                    let elementIndex = selectedTasks.find((element: any, index: number) => {
                        if (element.state.id === action.data.state.id) {
                            return index
                        }
                    })
                    if (elementIndex) {
                        newState.selectedTasks.splice(elementIndex, 1);
                    }
                } else {
                    newState.selectedTask = null
                }
                break

            case 'completeTask':
                element = null
                elementIndex = 0
                if (newState.items.length > 0) {
                    element = newState.items.find((element: any, index: number) => {
                        if (element.id === newState.selectedTasks[0]) {
                            return index
                        }
                    })
                    elementIndex = newState.items.indexOf(element)
                    if (element) {
                        action.data = elementIndex
                        newState.items[elementIndex].progress = 100
                    }
                }
                isHistoryNeed = true
                break

            case 'reopenTask':
                element = null
                elementIndex = 0
                if (newState.items.length > 0) {
                    element = newState.items.find((element: any, index: number) => {
                        if (element.id === newState.selectedTasks[0]) {
                            return index
                        }
                    })
                    elementIndex = newState.items.indexOf(element)
                    if (element) {
                        action.data = elementIndex
                        newState.items[elementIndex].progress = 0
                    }
                }
                isHistoryNeed = true
                break

            case 'removeLink':
                element = null
                elementIndex = 0
                if (newState.items.length > 0) {
                    element = newState.items.find((element: any, index: number) => {
                        if (element.id === newState.selectedTasks[0]) {
                            return index
                        }
                    })
                    elementIndex = newState.items.indexOf(element)
                    if (element) {
                        action.data = elementIndex
                        newState.items[elementIndex].link = null
                    }
                }
                isHistoryNeed = true
                break

            case 'scrollGrid':
                newState.scrollPosition = action.data
                break

            case 'removeDraggingElement':
                newState.draggingElement = null
                break

            case 'removeDropTarget':
                newState.dropTarget = null
                break

            case 'taskUpdated':
                isHistoryNeed = true
                break

            default:
                return state
        }
        if (isHistoryNeed) {
            newState.history.push({
                type: action.type,
                data: action.data
            })
        }

        return newState
    }

    private initialState = {
        items: ChartData.ganttBars,
        timeLine: ChartData.timelineWeek,
        taskline: ChartData.taskline,

        isDragging: false,
        isLinking: false,
        isCurrentlySizing: false,

        isLineDrawStarted: false,

        timelineStep: 0,
        scrollPosition: 0,

        svgGridWidth: 50,
        ganttChartView: null,
        cellCapacity: 54 / 24,

        dropTarget: null,
        draggingElement: null,
        selectedTasks: [],
        history: [],
        tempLine: null
    }

    constructor() {
        new ChartData()
        AppMediator.timelineWeek = ChartData.timelineWeek
        AppMediator.timelineMonth = ChartData.timelineMonth
        AppMediator.timelineDay = ChartData.timelineDay
        AppMediator.timelineYear = ChartData.timelineYear
        AppMediator.subscribers = {}
        AppMediator.store = createStore(this.reduser, this.initialState)
    }

    reset() {
        AppMediator.subscribers = {};
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
        return AppMediator.store.getState()
    }

    public getLastChange() {
        let history = AppMediator.store.getState().history
        if (history) {
            let length = history.length
            return history[length - 1]
        }
        return null
    }

    public dispatch(config) {
        return AppMediator.store.dispatch(config)
    }

    public subscribe(callback: Function) {
        AppMediator.store.subscribe(callback)//.subscribers[subscriber] = callback;
    }

    private static notifySubscribers(eventType: any, currentState: any, state: any) {
        for (let subscriber in this.subscribers) {
            this.subscribers[subscriber].call(this, eventType, currentState, state);
        }
    }

    public undo() {
        return AppMediator.store.subscribe()
    }

    public redo() {
        return AppMediator.store.subscribe()
    }
}