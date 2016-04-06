import { createStore } from 'redux'
import {ChartData} from './ChartData';

export class GanttChartMediator {
    private subscribersCallback: any;
    private static instance: GanttChartMediator;
    private static store: any;

    private static timelineWeek: Object[];
    private static timelineMonth: Object[];
    private static timelineDay: Object[];
    private static timelineYear: Object[];

    private reduser(state: any, action: any) {
        let newState = state
        switch (action.type) {
            case 'reset':
                newState.items = action.items
                return newState
            case 'create':
                newState.items.push(action.item)//todo check if already exist
                newState.ganttChartView.forceUpdate()
                return newState
            case 'delete':
                // newState.items
                newState.ganttChartView.deleteTask(action.taskId)//todo check if exist
                return newState
            case 'edit':
                newState.ganttChartView.editTask(action.taskId)//todo check if exist
                return newState
            case 'indent':
                newState.ganttChartView.indentTask(action.taskId)
                return newState
            case 'link':
                newState.ganttChartView.linkTask(action.tasksIds)
                return newState
            case 'outindent':
                newState.ganttChartView.outindentTask(action.taskId)
                return newState
            case 'unlink':
                newState.ganttChartView.unlinkTask(action.taskId)
                return newState
            case 'autoSchedule':
                return newState
            case 'startDrag':
                newState.isDragging = true
                return newState
            case 'startSizing':
                newState.isResizing = true
                return newState
            case 'stopSizing':
                newState.isResizing = false
                return newState
            case 'startLinking':
                newState.isLinking = true
                return newState
            case 'stopLinking':
                newState.isLinking = false
                return newState
            case 'stopDrag':
                newState.isDragging = false
                return newState
            case 'updateTimelineStep':
                return newState.timelineStep = action.step
            case 'setGanttChartView':
                newState.ganttChartView = action.view
                return newState
            case 'setDropTarget':
                newState.dropTarget = action.dropTarget
                return newState
            case 'setTempline':
                newState.templine = action.templine
                return newState
            case 'setDraggingElement':
                newState.draggingElement = action.draggingElement
                return newState
            case 'removeTempline':
                newState.templine = null
                return newState
            case 'updateScrollPosition':
                newState.scrollPosition = action.scrollPosition
                return newState
            case 'setTimelineStep':
                switch (newState.timelineStep) {
                    case 0:
                        newState.cellCapacity = 40 / 72
                        newState.timeLine = GanttChartMediator.timelineMonth
                        break;
                    case 1:
                        newState.cellCapacity = 50 / 720
                        newState.timeLine = GanttChartMediator.timelineYear
                        break;
                    case 2:
                        newState.cellCapacity = 50 / 3
                        newState.timeLine = GanttChartMediator.timelineDay
                        break;
                    case 3:
                        newState.cellCapacity = 60 / 24
                        newState.timeLine = GanttChartMediator.timelineWeek
                        break;
                    default:
                        newState.cellCapacity = 40 / 72
                        newState.timeLine = GanttChartMediator.timelineWeek
                }
                newState.timelineStep = action.step
                newState.ganttChartView.forceUpdate()
                return newState
            default:
                return state
        }
    }

    private initialState = {
        items: ChartData.ganttBars,
        timeLine: ChartData.timelineWeek,

        isDragging: false,
        isLinking: false,
        isCurrentlySizing: false,

        isLineDrawStarted: false,

        timelineStep: 0,
        scrollPosition: 0,

        svgGridWidth: 50,
        ganttChartView: null,
        cellCapacity: 50 / 24,

        dropTarget: null,
        draggingElement: null,

        tempLine: null
    }

    constructor() {
        new ChartData()
        GanttChartMediator.timelineWeek = ChartData.timelineWeek;
        GanttChartMediator.timelineMonth = ChartData.timelineMonth;
        GanttChartMediator.timelineDay = ChartData.timelineDay;
        GanttChartMediator.timelineYear = ChartData.timelineYear;
        GanttChartMediator.store = createStore(this.reduser, this.initialState)
    }

    reset() {
        this.subscribersCallback = {};
    }

    public static getInstance(): GanttChartMediator {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GanttChartMediator();
        }
        return this.instance;
    }

    public unsubscribe(subscriber) {
        delete this.subscribersCallback[subscriber];
    }

    public getState() {
        return GanttChartMediator.store.getState()
    }

    public dispatch(config) {
        return GanttChartMediator.store.dispatch(config)
    }

    public subscribe(config) {
        return GanttChartMediator.store.subscribe(config)
    }
}