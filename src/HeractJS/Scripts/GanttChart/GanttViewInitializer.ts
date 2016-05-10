import * as React from 'react';
import * as DOM from 'react-dom';

import {ChartView}  from './ChartView'
import {GanttToolbar}  from './Toolbar'
import {TaskLineView}  from './Taskline/TaskLine'

export class Initializer {
    constructor() {
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
