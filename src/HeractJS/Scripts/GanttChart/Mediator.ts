import React = require('react')

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
                break
            case 'create':
                newState.items.push(action.item)//todo check if already exist
                newState.ganttChartView.forceUpdate()
                break
            case 'delete':
                // newState.items
                newState.ganttChartView.deleteTask(action.taskId)//todo check if exist
                break
            case 'edit':
                newState.ganttChartView.editTask(action.taskId)//todo check if exist
                break
            case 'indent':
                newState.ganttChartView.indentTask(action.taskId)
                break
            case 'link':
                newState.ganttChartView.linkTask(action.tasksIds)
                break
            case 'outindent':
                newState.ganttChartView.outindentTask(action.taskId)
                break
            case 'unlink':
                newState.ganttChartView.unlinkTask(action.taskId)
                break
            case 'autoSchedule':
                break
            case 'startDrag':
                newState.isDragging = true
                break
            case 'startSizing':
                newState.isResizing = true
                break
            case 'stopSizing':
                newState.isResizing = false
                break
            case 'startLinking':
                newState.isLinking = true
                break
            case 'stopLinking':
                newState.isLinking = false
                break
            case 'stopDrag':
                newState.isDragging = false
                break
            case 'updateTimelineStep':
                return newState.timelineStep = action.step
            case 'setGanttChartView':
                newState.ganttChartView = action.view
                break
            case 'setDropTarget':
                newState.dropTarget = action.dropTarget
                break
            case 'setTempline':
                newState.templine = action.templine
                break
            case 'setDraggingElement':
                newState.draggingElement = action.draggingElement
                break
            case 'removeTempline':
                newState.templine = null
                break
            case 'updateScrollPosition':
                newState.scrollPosition = action.scrollPosition
                break
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
                break
            case 'selectTask':
                newState.history.push({
                    type: action.task,
                    data: newState.selectedTask
                })
                newState.selectedTask = action.task
                //newState.ganttChartView.selectedTask()
                break
            case 'addTaskToSelected':
                if (newState.selectedTask) {
                    newState.selectedTasks.push(newState.selectedTask)
                    newState.selectedTask = null
                }
                newState.selectedTasks.push(action.task)//todo check if exist
                break
            case 'deselectAllTasks':
                newState.selectedTasks = []
                break
            case 'deselectTask':
                let selectedTasks = newState.selectedTasks
                if (selectedTasks.length > 0) {
                    let elementIndex = selectedTasks.find((element: any, index: number) => {
                        if (element.state.id === action.task.state.id) {
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
            default:
                return state
        }
        return newState
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
        selectedTask: null,
        selectedTasks: [],
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

    public undo() {
        return GanttChartMediator.store.subscribe()
    }

    public redo() {
        return GanttChartMediator.store.subscribe()
    }
}