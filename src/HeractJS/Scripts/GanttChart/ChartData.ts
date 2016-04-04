// simulating server data
// initial set up

export class ChartData {
    amountOfElements: number = 100
    counter: number = 0;

    static timelineWeek = []
    static timelineMonth = []
    static timelineDay = []
    static timelineYear = []

    static ganttBars = []

    weekData = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    monthData = [
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
    yearData = [
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023'
    ]

    constructor() {
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }

            let topMargin = 50 * i
            let text = 'Task ' + i.toString()
            let leftMargin = 50 * this.counter
            let barClass = 'group1'

            ChartData.ganttBars.push({
                id: 'bar' + i,
                barClass: barClass,
                type: 'bar',
                progress: 20,
                duration: 80 + this.counter + i,
                name: text,
                description: 'Description for ' + text,
                startDate: leftMargin,
                position: topMargin
            });
        }//ganttBars

        for (let i = 0; i <= 10; i++) {
            ChartData.timelineWeek.push({
                id: 'timelineWeek' + i,
                text: 'Week ' + i,
                style: {
                    top: 0,
                    height: 30,
                    width: 420,
                    marginLeft: 420 * i
                }
            });
            for (let n = 0; n < this.weekData.length; n++) {
                ChartData.timelineWeek.push({
                    id: 'timelineWeekM' + n + i,
                    text: this.weekData[n],
                    style: {
                        top: 30,
                        height: 30,
                        width: 60,
                        marginLeft: 420 * i + 60 * n
                    }
                });
            }
        }//timelineWeek

        for (let i = 0; i <= 11; i++) {
            ChartData.timelineMonth.push({
                id: 'timelineMonth' + i,
                text: this.monthData[i],
                style: {
                    top: 0,
                    height: 30,
                    width: 400,
                    marginLeft: 400 * i
                }
            });

            for (let n = 0; n <= 9; n++) {
                ChartData.timelineMonth.push({
                    id: 'timelineMonthM' + this.monthData[i] + n,
                    text: (n * 3).toString(),
                    style: {
                        top: 30,
                        height: 30,
                        width: 40,
                        marginLeft: 400 * i + 40 * n
                    }
                });
            }
        }//timelineMonth

        for (let i = 0; i < 6; i++) {
            ChartData.timelineDay.push({
                id: 'timelineDay' + i,
                text: this.weekData[i],
                style: {
                    top: 0,
                    height: 30,
                    width: 400,
                    marginLeft: 400 * i
                }
            });

            for (let n = 0; n < 8; n++) {
                ChartData.timelineDay.push({
                    id: 'timelineDay' + n + i,
                    text: 'H' + (n * 3).toString(),
                    style: {
                        top: 30,
                        height: 30,
                        width: 50,
                        marginLeft: 400 * i + 50 * n
                    }
                });
            }
        }//timelineDay

        for (let i = 0; i <= 8; i++) {
            ChartData.timelineYear.push({
                id: 'timelineYear' + i,
                text: this.yearData[i],
                style: {
                    top: 0,
                    height: 30,
                    width: 600,
                    marginLeft: 600 * i
                }
            });

            for (let n = 0; n <= 11; n++) {
                ChartData.timelineYear.push({
                    id: 'timelineYearM' + n + i,
                    text: this.monthData[n],
                    style: {
                        top: 30,
                        height: 30,
                        width: 50,
                        marginLeft: 600 * i + 50 * n
                    }
                });
            }
        }//timelineYear
    }

    create(taskData: Object) {
        
    }
    autoSchedule() {
        
    }
    delete(taskId: string) {
        
    }
    edit(taskData: Object) {
        
    }
    indent(taskData: Object) {
        
    }
    link(taskData: Object) {
        
    }
    outindent(taskData: Object) {
        
    }
    unlinktask(taskId: string) {
        
    }
}