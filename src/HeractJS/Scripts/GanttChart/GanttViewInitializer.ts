import * as React from 'react';
import * as DOM from 'react-dom';

import {ChartView}  from './ChartView'
import {GanttToolbar}  from './Toolbar'
import {TaskLineView}  from './Taskline/TaskLine'

export class Initializer {
    constructor() {
        DOM.render(React.createElement(ChartView), document.getElementsByClassName('js-module-region-right')[0]);
        DOM.render(React.createElement(TaskLineView), document.getElementsByClassName('js-module-gantt-taskline')[0]);
        DOM.render(React.createElement(GanttToolbar), document.getElementsByClassName('js-module-gantt-toolbar')[0]);
    }
}
