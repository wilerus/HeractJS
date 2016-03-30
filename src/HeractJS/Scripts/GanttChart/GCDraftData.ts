// simulating server data
// initial set up
import {globalStore} from './GCStore';

export class ganttChartData {
    amountOfElements: number = 100
    counter: number = 0;

    static timelineWeek = []
    static timelineMonth = []
    static timelineDay = []
    static timelineYear = []
    static ganttBars = []

    timelineMonth

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

            ganttChartData.ganttBars.push({
                id: 'bar' + i,
                barClass: barClass,
                type: 'bar',
                complition: 20,
                duration: 80 + this.counter + i,
                text: text,
                description:'Description for ' + text,
                startDate: leftMargin,
                style: {
                    top: topMargin,
                }
            });
        }//ganttBars

        for (let i = 0; i <= 10; i++) {
            ganttChartData.timelineWeek.push({
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
                ganttChartData.timelineWeek.push({
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
            ganttChartData.timelineMonth.push({
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
                ganttChartData.timelineMonth.push({
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
            ganttChartData.timelineDay.push({
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
                ganttChartData.timelineDay.push({
                    id: 'timelineDay' + n + i,
                    text: 'H'+(n * 3).toString(),
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
            ganttChartData.timelineYear.push({
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
                ganttChartData.timelineYear.push({
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
}