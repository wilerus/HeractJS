// simulating server data
// initial set up

export class ChartData {
    public amountOfElements: number = 100000
    public counter: number = 0;

    public static timelineWeek: Object[] = []
    public static timelineMonth: Object[] = []
    public static timelineDay: Object[] = []
    public static timelineYear: Object[] = []

    public static ganttBars: Object[] = []

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
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }

            let topMargin: number = 22 * i
            let text = `Task ${i + 1}`
            let leftMargin = 50 * this.counter
            let barClass = 'group1'

            ChartData.ganttBars.push({
                id: `bar${i}`,
                barClass: barClass,
                type: 'bar',
                progress: 25,
                duration: 80 + this.counter + i,
                name: text,
                description: `Description for${text}`,
                startDate: leftMargin,
                position: topMargin
            });
        }//ganttBars

        for (let i = 0; i <= 10; i++) {
            ChartData.timelineWeek.push({
                id: `timelineWeek${i}`,
                text: `Week${i}`,
                style: {
                    top: 0,
                    height: 25,
                    width: 425,
                    marginLeft: 425 * i
                }
            });
            for (let n = 0; n < this.weekData.length; n++) {
                ChartData.timelineWeek.push({
                    id: `timelineWeekM${n}${i}`,
                    text: this.weekData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 60,
                        marginLeft: 425 * i + 60 * n
                    }
                });
            }
        }//timelineWeek

        for (let i = 0; i <= 11; i++) {
            ChartData.timelineMonth.push({
                id: `timelineMonth${i}`,
                text: this.monthData[i],
                style: {
                    top: 0,
                    height: 25,
                    width: 400,
                    marginLeft: 400 * i
                }
            });

            for (let n = 0; n <= 9; n++) {
                ChartData.timelineMonth.push({
                    id: `timelineMonthM${this.monthData[i] + n}`,
                    text: (n * 3).toString(),
                    style: {
                        top: 25,
                        height: 25,
                        width: 40,
                        marginLeft: 400 * i + 40 * n
                    }
                });
            }
        }//timelineMonth

        for (let i = 0; i < 6; i++) {
            ChartData.timelineDay.push({
                id: `timelineDay${i}`,
                text: this.weekData[i],
                style: {
                    top: 0,
                    height: 25,
                    width: 400,
                    marginLeft: 400 * i
                }
            });

            for (let n = 0; n < 8; n++) {
                ChartData.timelineDay.push({
                    id: `timelineDay${n}${i}`,
                    text: `H${n * 3}`,
                    style: {
                        top: 25,
                        height: 25,
                        width: 50,
                        marginLeft: 400 * i + 50 * n
                    }
                });
            }
        }//timelineDay

        for (let i = 0; i <= 8; i++) {
            ChartData.timelineYear.push({
                id: `timelineYear${i}`,
                text: this.yearData[i],
                style: {
                    top: 0,
                    height: 25,
                    width: 600,
                    marginLeft: 600 * i
                }
            });

            for (let n = 0; n <= 11; n++) {
                ChartData.timelineYear.push({
                    id: `timelineYearM${n}${i}`,
                    text: this.monthData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 50,
                        marginLeft: 600 * i + 50 * n
                    }
                });
            }
        }//timelineYear
    }
}