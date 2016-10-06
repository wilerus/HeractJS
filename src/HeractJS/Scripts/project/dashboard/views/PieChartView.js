define([
    'comindware/core',
    './template/Chart.html',
    'nvd3',
], function (object, template) {
    
    //Preparing data for Pie Chart instance
    var values = [
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
                    }];
    //Creating Pie Chart
    var buildChart = function () {
        var chart = nv.models.pieChart()
                    .x(function (d) { return d.label })
                    .y(function (d) { return d.value })
                    .duration(750)
                    .margin({ left: 50, right: 50, top: 50, bottom: 50 })
                    .showLabels(true)
                    .title("Donut Chart")
                    .labelsOutside(true)
                    .donut(true)
                    .width(700)
                    .height(700)
                    .showLegend(true);
        d3.select('.chart svg')
            .datum(values)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    };
    //Creating View that contains model of Funnel Chart
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
            