import * as React from 'react';
import * as DOM from 'react-dom';
import {ChartView}  from './GanttViewController'
import {GanttToolbar}  from './Toolbar/Toolbar'
import {TaskLineView}  from './Timeline/TimelineController'
import {AppMediator} from '../../scripts/services/ApplicationMediator'
import {ChartData} from '../../scripts/services/ChartData'

const GCMediator: any = AppMediator.getInstance();

export class Initializer {
    constructor() {
        const initData = new ChartData();
        GCMediator.dispatch({
            type: 'initChartViewData',
            data: {
                items: initData.getChartData(),
                timeLine: initData.timelineWeek,

                timelineTimeItems: initData.timelineMonthMax,
                timelineTasks: initData.timelineTasks,
                timelineMilestones: initData.timelineMilestones,
                timelineCallouts: initData.timelineCallouts,
                tasklineCellCapacity: 85 / 72,

                isDragging: false,
                isLinking: false,
                isCurrentlySizing: false,
                isLineDrawStarted: false,

                timelineStep: 0,
                scrollPosition: 0,

                columnWidth: 72,
                cellCapacity: 72/24,

                dropTarget: null as any,
                draggingElement: null as any,
                selectedTasks: [] as any,
                lastTaskChange: [] as any,
                undoHistory: [] as any,
                redoHistory: [] as any,
                eventsHistory: [] as any,

                isCallbackNeed: false,

                timelineWeek: initData.timelineWeek,
                timelineMonth: initData.timelineMonth,
                timelineDay: initData.timelineDay,
                timelineYear: initData.timelineYear
            }
        })
        const chartRegion = document.getElementsByClassName('js-module-region-right')[0] as any;
        const timelineRegion = document.getElementsByClassName('js-module-gantt-taskline')[0] as any;
        const toolbarRegion = document.getElementsByClassName('js-module-gantt-toolbar')[0] as any;

        DOM.render(React.createElement(ChartView), chartRegion, () => {
            chartRegion.style.opacity = 1;
            DOM.render(React.createElement(TaskLineView), timelineRegion, () => {
                timelineRegion.style.opacity = 1;
            })
            DOM.render(React.createElement(GanttToolbar), toolbarRegion, () => {
                toolbarRegion.style.opacity = 1;
            })
        });
    }
}
