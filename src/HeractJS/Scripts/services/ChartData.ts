// simulating server data
// initial set up

export class ChartData {
    public amountOfElements: number = 100000
    public counter: number = 0;

    public static timelineWeek: Object[] = []
    public static timelineMonth: Object[] = []
    public static timelineDay: Object[] = []
    public static timelineYear: Object[] = []

    public static timelineWeekMin: Object[] = []
    public static timelineMonthMin: Object[] = []
    public static timelineDayMin: Object[] = []
    public static timelineYearMin: Object[] = []

    public static ganttBars: any[] = []
    public static tasklineTasks: Object[] = []

    public weekData: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    public monthData: string[] = [
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
    ]
    public yearData: string[] = [
        '2016',
        '2017',
        '2018',
        '2019',
        '2025',
        '2021',
        '2022',
        '2023'
    ]

    constructor() {
        let type: string = ''
        let text: string = ''
        let projectCount: number = 1
        let taskCount: number = 1
        let milestoneCount: number = 1
        let duration = 40
        let topMargin: number = 0
        let leftMargin: number = 0
        let link: Object = null
        for (let i = 0; i < this.amountOfElements; i++) {
            leftMargin = 40 * (i - projectCount + 1)

            if (i % 10 === 0) {
                type = 'project'
                text = `Project ${projectCount}`
                duration = 360
                if (i !== 0) {
                    ChartData.ganttBars[i - 1].link = null
                }
                projectCount++
            } else if (i % 4 === 0) {
                type = 'milestone'
                duration = 20
                text = `Milestone ${milestoneCount}`
                milestoneCount++
            } else {
                type = 'task'
                text = `Task ${taskCount}`
                duration = 40
                taskCount++
            }

            link = {
                id: `link${i}`,
                to: type === 'project' ? `bar${i + 10}` : `bar${i + 1}`,
                type: 'finichToStart'
            }

            topMargin = 24 * i

            ChartData.ganttBars.push({
                id: `bar${i}`,
                progress: 25,
                duration: duration,
                name: text,
                description: `Description for ${text}`,
                startDate: leftMargin,
                finishDate: leftMargin,
                position: topMargin,
                type: type,
                link: link
            });

            if (taskCount % 3 === 0 && taskCount < 100) {
                ChartData.tasklineTasks.push(ChartData.ganttBars[i])
            }
        }//gantt bar config

        for (let i = 0; i <= 10; i++) {
            ChartData.timelineWeek.push({
                id: `timelineWeek${i}`,
                text: `Week${i}`,
                style: {
                    top: 0,
                    width: 508,
                    marginLeft: 508 * i
                }
            });

            for (let n = 0; n < this.weekData.length; n++) {
                ChartData.timelineWeekMin.push({
                    id: `timelineWeekM${n}${i}`,
                    text: this.weekData[n],
                    style: {
                        top: 20,
                        width: 72,
                        marginLeft: 508 * i + 72 * n
                    }
                });
            }
        }//timelineWeek
        ChartData.timelineWeek = ChartData.timelineWeek.concat(ChartData.timelineWeekMin)

        for (let i = 0; i <= 11; i++) {
            ChartData.timelineMonth.push({
                id: `timelineMonth${i}`,
                text: this.monthData[i],
                style: {
                    top: 0,
                    width: 594,
                    marginLeft: 594 * i
                }
            });

            for (let n = 0; n <= 10; n++) {
                ChartData.timelineMonthMin.push({
                    id: `timelineMonthM${this.monthData[i] + n}`,
                    text: (n * 3).toString(),
                    style: {
                        top: 20,
                        width: 54,
                        marginLeft: 594 * i + 54 * n
                    }
                });
            }
        }//timelineMonth
        ChartData.timelineMonth = ChartData.timelineMonth.concat(ChartData.timelineMonthMin)

        for (let i = 0; i < 6; i++) {
            ChartData.timelineDay.push({
                id: `timelineDay${i}`,
                text: this.weekData[i],
                style: {
                    top: 0,
                    width: 480,
                    marginLeft: 480 * i
                }
            });

            for (let n = 0; n < 8; n++) {
                ChartData.timelineDayMin.push({
                    id: `timelineDay${n}${i}`,
                    text: `H${n * 3}`,
                    style: {
                        top: 20,
                        width: 60,
                        marginLeft: 480 * i + 60 * n
                    }
                });
            }
        }//timelineDay

        ChartData.timelineDay = ChartData.timelineDay.concat(ChartData.timelineDayMin)

        for (let i = 0; i <= 8; i++) {
            ChartData.timelineYear.push({
                id: `timelineYear${i}`,
                text: this.yearData[i],
                style: {
                    top: 0,
                    width: 648,
                    marginLeft: 648 * i
                }
            });

            for (let n = 0; n <= 11; n++) {
                ChartData.timelineYearMin.push({
                    id: `timelineYearM${n}${i}`,
                    text: this.monthData[n],
                    style: {
                        top: 20,
                        width: 54,
                        marginLeft: 600 * i + 54 * n
                    }
                });
            }
        }//timelineYear

        ChartData.timelineYear = ChartData.timelineYear.concat(ChartData.timelineYearMin)
    }
}