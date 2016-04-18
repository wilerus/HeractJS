"use strict";
var ChartData = (function () {
    function ChartData() {
        this.amountOfElements = 100;
        this.counter = 0;
        this.weekData = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];
        this.monthData = [
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
        this.yearData = [
            '2516',
            '2517',
            '2518',
            '2519',
            '2525',
            '2521',
            '2522',
            '2523'
        ];
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }
            var topMargin = 32 * i;
            var text = "Task " + i;
            var leftMargin = 50 * this.counter;
            var barClass = 'group1';
            ChartData.ganttBars.push({
                id: "bar" + i,
                barClass: barClass,
                type: 'bar',
                progress: 25,
                duration: 80 + this.counter + i,
                name: text,
                description: "Description for" + text,
                startDate: leftMargin,
                position: topMargin
            });
        }
        for (var i_1 = 0; i_1 <= 10; i_1++) {
            ChartData.timelineWeek.push({
                id: "timelineWeek" + i_1,
                text: "Week" + i_1,
                style: {
                    top: 0,
                    height: 25,
                    width: 425,
                    marginLeft: 425 * i_1
                }
            });
            for (var n = 0; n < this.weekData.length; n++) {
                ChartData.timelineWeek.push({
                    id: "timelineWeekM" + n + i_1,
                    text: this.weekData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 60,
                        marginLeft: 425 * i_1 + 60 * n
                    }
                });
            }
        }
        for (var i_2 = 0; i_2 <= 11; i_2++) {
            ChartData.timelineMonth.push({
                id: "timelineMonth" + i_2,
                text: this.monthData[i_2],
                style: {
                    top: 0,
                    height: 25,
                    width: 400,
                    marginLeft: 400 * i_2
                }
            });
            for (var n = 0; n <= 9; n++) {
                ChartData.timelineMonth.push({
                    id: "timelineMonthM" + (this.monthData[i_2] + n),
                    text: (n * 3).toString(),
                    style: {
                        top: 25,
                        height: 25,
                        width: 40,
                        marginLeft: 400 * i_2 + 40 * n
                    }
                });
            }
        }
        for (var i_3 = 0; i_3 < 6; i_3++) {
            ChartData.timelineDay.push({
                id: "timelineDay" + i_3,
                text: this.weekData[i_3],
                style: {
                    top: 0,
                    height: 25,
                    width: 400,
                    marginLeft: 400 * i_3
                }
            });
            for (var n = 0; n < 8; n++) {
                ChartData.timelineDay.push({
                    id: "timelineDay" + n + i_3,
                    text: "H" + n * 3,
                    style: {
                        top: 25,
                        height: 25,
                        width: 50,
                        marginLeft: 400 * i_3 + 50 * n
                    }
                });
            }
        }
        for (var i_4 = 0; i_4 <= 8; i_4++) {
            ChartData.timelineYear.push({
                id: "timelineYear" + i_4,
                text: this.yearData[i_4],
                style: {
                    top: 0,
                    height: 25,
                    width: 600,
                    marginLeft: 600 * i_4
                }
            });
            for (var n = 0; n <= 11; n++) {
                ChartData.timelineYear.push({
                    id: "timelineYearM" + n + i_4,
                    text: this.monthData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 50,
                        marginLeft: 600 * i_4 + 50 * n
                    }
                });
            }
        }
    }
    ChartData.timelineWeek = [];
    ChartData.timelineMonth = [];
    ChartData.timelineDay = [];
    ChartData.timelineYear = [];
    ChartData.ganttBars = [];
    return ChartData;
}());
exports.ChartData = ChartData;
