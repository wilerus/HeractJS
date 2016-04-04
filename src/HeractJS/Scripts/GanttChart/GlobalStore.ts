import { createStore } from 'redux'
import {ChartData} from './ChartData';

export class GanttChartMediator {
    private subscribersCallback: any;
    private static instance: GanttChartMediator;
    private static store: any;

    reduser(state, action) {
        let newState = state
        switch (action.type) {
            case 'reset':
                newState.items = action.taskData
                return state
            case 'create':
                newState.items.push(action.taskData)//todo check if already exist
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
            case 'dragStart':
                newState.isDragging = true
                return newState
            case 'startSizing':
                newState.isDragging = true
                return newState
            case 'stactLinking':
                newState.isDragging = true
                return newState
            case 'dragEnd':
                newState.isDragging = false
                return newState
            case 'updateTimelineStep':
                return newState.timelineStep = action.step
            case 'setGanttChartView':
                newState.ganttChartView = action.view
                return newState
            case 'setDropTarget':
                newState.DropTarget = action.dropTarget
                return newState
            case 'setTempline':
                newState.tempLine = action.tempLine
                return newState
            case 'setDraggingTask':
                newState.draggingTask = action.draggingTask
            case 'removeTempline':
                newState.tempLine = null
                return newState
            default:
                return state
        }
    }

    initialState = {
        items: ChartData.ganttBars,
        timeline: ChartData.timelineWeek,
        isCurrentlyDragging: false,
        isDrawingConnection: false,
        isCurrentlySizing: false,

        isLineDrawStarted: false,

        timelineStep: null,

        svgGridWidth: 50,
        ganttChartView: null,
        cellCapacity: 50 / 24,

        currentDropTarget: null,
        currentDraggingElement: null,

        tempLine: null
    }

    constructor() {
        new ChartData()
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
      return  GanttChartMediator.store.getState()
    }

    public dispatch(config) {
        return GanttChartMediator.store.dispatch(config)
    }

    public subscribe(config) {
        return GanttChartMediator.store.subscribe(config)
    }
}