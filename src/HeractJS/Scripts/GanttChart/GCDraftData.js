var GCStore_1 = require('./GCStore');
var ganttChartData = (function () {
    function ganttChartData() {
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
        for (var i = 0; i < this.amountOfElements; i++) {
            if (i % 2 === 0) {
                this.counter++;
            }
            var topMargin = 50 * i;
            var text = 'Task ' + i.toString();
            var leftMargin = GCStore_1.globalStore.svgGridWidth * this.counter;
            var barClass = 'group1';
            if (this.counter < 6) {
                barClass = 'group1';
            }
            else if (this.counter >= 6 && this.counter <= 11) {
                barClass = 'group2';
            }
            else {
                barClass = 'group3';
            }
            ganttChartData.ganttBars.push({
                id: 'bar' + i,
                barClass: barClass,
                type: 'bar',
                complition: 20,
                duration: 80 + this.counter + i,
                text: text,
                style: {
                    top: topMargin,
                    marginLeft: leftMargin
                }
            });
        }
        for (var i_1 = 0; i_1 <= 10; i_1++) {
            ganttChartData.timelineWeek.push({
                id: 'timeline1' + i_1,
                text: 'Week ' + i_1,
                style: {
                    top: 0,
                    height: 30,
                    width: 420,
                    marginLeft: 420 * i_1
                }
            });
            for (var n = 0; n < this.weekData.length; n++) {
                ganttChartData.timelineWeek.push({
                    id: 'timeline11' + n + i_1,
                    text: this.weekData[n],
                    style: {
                        top: 30,
                        height: 30,
                        width: 60,
                        marginLeft: 420 * i_1 + 60 * n
                    }
                });
            }
        }
        for (var i_2 = 0; i_2 <= 11; i_2++) {
            ganttChartData.timelineMonth.push({
                id: 'timeline12' + i_2,
                text: this.monthData[i_2],
                style: {
                    top: 0,
                    height: 30,
                    width: 400,
                    marginLeft: 400 * i_2
                }
            });
            for (var n = 0; n <= 9; n++) {
                ganttChartData.timelineMonth.push({
                    id: 'timeline122' + n + i_2,
                    text: (n * 3).toString(),
                    style: {
                        top: 30,
                        height: 30,
                        width: 40,
                        marginLeft: 400 * i_2 + 40 * n
                    }
                });
            }
        }
    }
    ganttChartData.timelineWeek = [];
    ganttChartData.timelineMonth = [];
    ganttChartData.ganttBars = [];
    return ganttChartData;
})();
exports.ganttChartData = ganttChartData;
;
