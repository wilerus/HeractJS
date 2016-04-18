"use strict";
var ChartData = (function () {
    function ChartData() {
        this.amountOfElements = 100000;
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
            '2016',
            '2017',
            '2018',
            '2019',
            '2025',
            '2021',
            '2022',
            '2023'
        ];
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }
            var topMargin = 22 * i;
            var text = "Task " + (i + 1);
            var leftMargin = 40 * i;
            ChartData.ganttBars.push({
                id: "bar" + i,
                progress: 25,
                duration: 40,
                name: text,
                description: "Description for " + text,
                startDate: leftMargin,
                finishDate: leftMargin,
                position: topMargin,
                link: {
                    id: "link" + i,
                    to: "bar" + (i + 1),
                    type: 'finichToStart'
                }
            });
        }
        for (var i_1 = 0; i_1 <= 10; i_1++) {
            ChartData.timelineWeek.push({
                id: "timelineWeek" + i_1,
                text: "Week" + i_1,
                style: {
                    top: 0,
                    height: 25,
                    width: 508,
                    marginLeft: 508 * i_1
                }
            });
            for (var n = 0; n < this.weekData.length; n++) {
                ChartData.timelineWeek.push({
                    id: "timelineWeekM" + n + i_1,
                    text: this.weekData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 72,
                        marginLeft: 508 * i_1 + 72 * n
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
                    width: 594,
                    marginLeft: 594 * i_2
                }
            });
            for (var n = 0; n <= 10; n++) {
                ChartData.timelineMonth.push({
                    id: "timelineMonthM" + (this.monthData[i_2] + n),
                    text: (n * 3).toString(),
                    style: {
                        top: 25,
                        height: 25,
                        width: 54,
                        marginLeft: 594 * i_2 + 54 * n
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
                    width: 480,
                    marginLeft: 480 * i_3
                }
            });
            for (var n = 0; n < 8; n++) {
                ChartData.timelineDay.push({
                    id: "timelineDay" + n + i_3,
                    text: "H" + n * 3,
                    style: {
                        top: 25,
                        height: 25,
                        width: 60,
                        marginLeft: 480 * i_3 + 60 * n
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
                    width: 648,
                    marginLeft: 648 * i_4
                }
            });
            for (var n = 0; n <= 11; n++) {
                ChartData.timelineYear.push({
                    id: "timelineYearM" + n + i_4,
                    text: this.monthData[n],
                    style: {
                        top: 25,
                        height: 25,
                        width: 54,
                        marginLeft: 600 * i_4 + 54 * n
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
