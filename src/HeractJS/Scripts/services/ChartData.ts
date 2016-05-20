import {AppMediator} from './ApplicationMediator'
const GCMediator: any = AppMediator.getInstance();

export class ChartData {
    public amountOfElements: number = 100000;

    public timelineWeek: Object[] = [];
    public timelineMonth: Object[] = [];
    public timelineDay: Object[] = [];
    public timelineYear: Object[] = [];

    public timelineTasks: Object[] = [];
    public timelineMilestones: Object[] = [];
    public timelineCallouts: Object[] = [];
    public timelineMonthMax: Object[] = [];

    constructor() {
        const weekData: string[] = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];
        const monthData: string[] = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const yearData: string[] = [
            '2016',
            '2017',
            '2018',
            '2019',
            '2025',
            '2021',
            '2022',
            '2023'
        ];
        let timelineWeekMin: Object[] = [];
        let timelineWeekMax: Object[] = [];
        let timelineMonthMin: Object[] = [];
        let timelineDayMin: Object[] = [];
        let timelineDayMax: Object[] = [];
        let timelineYearMin: Object[] = [];

        for (let i = 0; i <= 10; i++) {
            for (let n = 0; n < weekData.length; n++) {
                timelineWeekMin.push({
                    id: `timelineWeekM${n}${i}`,
                    text: weekData[n],
                    style: {
                        top: 20,
                        width: 72,
                        marginLeft: 508 * i + 72 * n
                    }
                });
            }
            for (let n = 0; n < weekData.length; n++) {
                timelineWeekMax.push({
                    id: `timelineWeekM${n}${i}`,
                    text: `${weekData[n]}'W${i + 1}`,
                    style: {
                        width: 87,
                        marginLeft: 609 * i + 87 * n
                    }
                });
            }
        }
        this.timelineWeek = this.timelineWeek.concat(timelineWeekMax);

        for (let i = 0; i <= 11; i++) {
            for (let n = 0; n <= 10; n++) {
                timelineMonthMin.push({
                    id: `timelineMonthM${monthData[i] + n}`,
                    text: `${n * 3}`,
                    style: {
                        top: 20,
                        width: 54,
                        marginLeft: 594 * i + 54 * n
                    }
                });
            }
            for (let n = 0; n <= 10; n++) {
                this.timelineMonthMax.push({
                    id: `timelineMonthM${monthData[i] + n}`,
                    text: `${n * 3}'${monthData[i]}'16`,
                    style: {
                        width: 85,
                        marginLeft: 935 * i + 85 * n
                    }
                });
            }
        }
        this.timelineMonth = this.timelineMonth.concat(this.timelineMonthMax);
        for (let i = 0; i < 6; i++) {
            for (let n = 0; n < 8; n++) {
                timelineDayMin.push({
                    id: `timelineDay${n}${i}`,
                    text: `H${n * 3}`,
                    style: {
                        top: 20,
                        width: 60,
                        marginLeft: 480 * i + 60 * n
                    }
                });
            }

            for (let n = 0; n < 8; n++) {
                timelineDayMax.push({
                    id: `timelineDay${n}${i}`,
                    text: `H${n * 3}'${weekData[i]}`,
                    style: {
                        width: 80,
                        marginLeft: 640 * i + 80 * n
                    }
                });
            }
        }
        this.timelineDay = this.timelineDay.concat(timelineDayMax);
        for (let i = 0; i <= 8; i++) {
            for (let n = 0; n <= 11; n++) {
                timelineYearMin.push({
                    id: `timelineYearM${n}${i}`,
                    text: monthData[n],
                    style: {
                        width: 54,
                        marginLeft: 600 * i + 54 * n
                    }
                });
            }
        }
        this.timelineYear = this.timelineYear.concat(timelineYearMin);

        GCMediator.subscribe(function () {
            const change = GCMediator.getLastChange();
            if (change) {
                switch (change.type) {
                    case 'createItem':
                        this.createItem(change.data);
                        break;
                    case 'removeItem':
                        this.removeItem(change.data);
                        break;
                    case 'editItem':
                        this.editItem(change);
                        break;
                    default:
                        break;
                }
            }
        }.bind(this));
    }

    public getChartData() {
        const ganttBars: any[] = [];
        let type: string;
        let text: string;
        let projectCount: number = 1;
        let taskCount: number = 1;
        let milestoneCount: number = 1;
        let duration: number;
        let topMargin: number;
        let leftMargin: number;
        let link: Object;
        for (let i = 0; i < this.amountOfElements; i++) {
            leftMargin = 40 * (i - projectCount + 1);
            if (i % 10 === 0) {
                type = 'project';
                text = `Project ${projectCount}`;
                duration = 360;
                if (i !== 0) {
                    ganttBars[i - 1].link = null;
                }
                projectCount++;
            } else if (i % 4 === 0) {
                type = 'milestone';
                duration = 1;
                text = `Milestone ${milestoneCount}`;
                milestoneCount++;
            } else {
                type = 'task';
                text = `Task ${taskCount}`;
                duration = 40;
                taskCount++;
            }

            link = {
                id: `link${`bar${i}`}`,
                to: type === 'project' ? `bar${i + 10}` : `bar${i + 1}`,
                type: 'finishToStart'
            };
            topMargin = 24 * i;
            ganttBars.push({
                id: `bar${i}`,
                order: undefined,
                collapsed: undefined,
                position: topMargin,
                calloutDisplay: i % 8 === 0 && type !== 'milestone' && taskCount < 100,
                timelineDisplay: false,
                link: link,
                name: text,
                type: type,
                description: `Description for ${text}`,
                assignee: undefined,
                parent: undefined,
                predecessors: undefined,
                progress: 25,
                duration: duration,
                startDate: leftMargin,
                finish: undefined,
                priority: undefined
            });

            if (taskCount % 3 === 0 && taskCount < 100) {
                if (ganttBars[i].type === 'task') {
                    ganttBars[i].timelineDisplay = true;
                } else if (ganttBars[i].type === 'milestone') {
                    ganttBars[i].timelineDisplay = true;
                }
            }
        }
        return ganttBars;
    }

    public editItem(change: any) {
        const newState = GCMediator.getState();
        const data = change.data;
        const undoData = {};
        const taskId = newState.selectedTasks[0].id;
        GCMediator.dispatch({
            type: 'completeItemEditing',
            selectedTask: taskId,
            data: data,
            isHistoryNeed: data.isHistoryNeed,
            isRedoNeed: data.isRedoNeed,
            undoType: 'editItem',
            undoData: undoData
        });
    }

    public removeItem() {
        const newState = GCMediator.getState();
        const items = newState.items;
        let elementIndex: number;
        items.find((item: any) => {
            if (item.id === newState.selectedTasks[0].id) {
                elementIndex = items.indexOf(item);
                const taskDuration = item.duration;
                items.splice(elementIndex, 1);
                for (let i = elementIndex; i < items.length; i++) {
                    items[i].position = 24 * i;
                    items[i].startDate -= taskDuration;
                }
                return true;
            }
        });
        GCMediator.dispatch({
            type: 'completeItemRemoving',
            data: {
                item: elementIndex
            }
        });
    }

    public createItem() {
        const newState = GCMediator.getState();
        const items = newState.items;
        let selectedTaskPosition: number;
        let selectedTaskStartDate: number;
        let prevElIndex: number;
        if (newState.selectedTasks && newState.selectedTasks.length > 0) {
            const prevElement = items.find((element: any, index: number) => {
                if (element.id === newState.selectedTasks[0].id) {
                    prevElIndex = index;
                    return true;
                }
            });
            selectedTaskPosition = prevElement.position + 24;
            selectedTaskStartDate = prevElement.startDate + prevElement.duration;
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
                items[i].position = 24 * i;
            }
        } else {
            selectedTaskPosition = 24 * items.length;
            selectedTaskStartDate = 50 * items.length;
        }
        GCMediator.dispatch({
            type: 'completeItemCreating'
        });
    }
}