// simulating server data
// initial set up
import {globalStore} from './GCStore';

export class ganttChartData {
    amountOfElements: number = 100
    counter: number = 0;

    static timelineWeek = []
    static timelineMonth = []
    static timelineDay = []
    static timelineQuad = []
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

    constructor() {
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }

            let topMargin = 50 * i
            let text = 'Task ' + i.toString()
            let leftMargin = globalStore.svgGridWidth * this.counter
            let barClass = 'group1'

            if (this.counter < 6) {
                barClass = 'group1'
            } else if (this.counter >= 6 && this.counter <= 11) {
                barClass = 'group2'
            } else {
                barClass = 'group3'
            }

            ganttChartData.ganttBars.push({
                id: 'bar' + i,
                barClass: barClass,
                type: 'bar',
                complition: 20,
                duration: 80 + this.counter + i,
                text: text,
                startDate: leftMargin,
                style: {
                    top: topMargin,
                }
            });
        }//ganttBars

        for (let i = 0; i <= 10; i++) {
            ganttChartData.timelineWeek.push({
                id: 'timeline1' + i,
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
                    id: 'timeline11' + n + i,
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
                id: 'timeline12' + i,
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
                    id: 'timeline122' + n + i,
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

        for (let i = 0; i <= 11; i++) {
            ganttChartData.timelineMonth.push({
                id: 'timeline12' + i,
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
                    id: 'timeline122' + n + i,
                    text: (n * 3).toString(),
                    style: {
                        top: 30,
                        height: 30,
                        width: 40,
                        marginLeft: 400 * i + 40 * n
                    }
                });
            }
        }//timelineDay

        for (let i = 0; i <= 11; i++) {
            ganttChartData.timelineMonth.push({
                id: 'timeline12' + i,
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
                    id: 'timeline122' + n + i,
                    text: (n * 3).toString(),
                    style: {
                        top: 30,
                        height: 30,
                        width: 40,
                        marginLeft: 400 * i + 40 * n
                    }
                });
            }
        }//timelineQuad
    }
}