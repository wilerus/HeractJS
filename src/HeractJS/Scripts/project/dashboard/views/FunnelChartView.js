define([
    'comindware/core',
    './template/Chart.html',
    'nvd3',
], function (object, template) {

    //Preparing data for Funnel Chart instance
    var values = [
            {
                key: 'Series1',
                values: [
                    {
                        "label": "Group A",
                        "value": 0
                    },
                    {
                        "label": "Group B",
                        "value": 39.5
                    },
                    {
                        "label": "Group C",
                        "value": 80
                    },
                    {
                        "label": "Group D",
                        "value": 90
                    },
                    {
                        "label": "Group E",
                        "value": 97.5
                    }
                ]
            },
            {
                key: 'Series2',
                values: [
                    {
                        "label": "Group A",
                        "value": 200
                    },
                    {
                        "label": "Group B",
                        "value": 121
                    },
                    {
                        "label": "Group C",
                        "value": 40
                    },
                    {
                        "label": "Group D",
                        "value": 20
                    },
                    {
                        "label": "Group E",
                        "value": 5
                    }
                ]
            },
    ];
    //Creating Funnel Chart
    var buildChart = function () {
        chart = nv.models.multiBarHorizontalChart()
                .x(function (d) { return d.label })
                .y(function (d) { return d.value })
                .showYAxis(false)
                .showControls(false)
                .duration(500)
                .margin({ left: 150, right: 150 })
                .showValues(true)
                .showLegend(false)
                .width(700)
                .height(700)
                .stacked(true);
        chart.barColor(function (d, i) {
            var colors = d3.scale.category10().range().slice(0);
            if (d.key == "Series2") {
                return colors[i];
            }
            else {
                return "#FFFFFF";
            }
        });
        chart.yAxis.tickFormat(d3.format(',.2f'))
        chart.yAxis.axisLabel('Y Value');
        chart.xAxis.axisLabel('X Step').axisLabelDistance(20)
        d3.select('.chart svg')
            .datum(values)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    };

    return Marionette.LayoutView.extend({
        initialize: function () {
        },
        model: new Backbone.Model({
            test: function () { nv.addGraph(buildChart) },
        }),
        className: 'chart',
        template: Handlebars.compile(template),
    })
})
