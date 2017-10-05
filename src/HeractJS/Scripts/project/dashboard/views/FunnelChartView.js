define([
    'comindware/core',
    './template/Chart.html',
    'nvd3',
], function (object, template) {
    //Creating View that contains model of Funnel Chart
    return Marionette.LayoutView.extend({
        initialize: function (options) {
            var cfg = options.get('config');
            var buildChart = function () {
                chart = nv.models.multiBarHorizontalChart()
                        .x(cfg.x)
                        .y(cfg.y)
                        .showYAxis(cfg.showYAxis)
                        .showControls(cfg.showControls)
                        .duration(cfg.duration)
                        .margin(cfg.margin)
                        .showValues(cfg.showValues)
                        .showLegend(cfg.showLegend)
                        .width(cfg.width)
                        .height(cfg.height)
                        .stacked(cfg.stacked)
                        .barColor(cfg.barColor);
                chart.yAxis.tickFormat(d3.format(',.2f'))
                chart.yAxis.axisLabel('Y Value');
                chart.xAxis.axisLabel('X Step').axisLabelDistance(20)
                d3.select('.chart svg')
                    .datum(options.get('data'))
                    .call(chart);
                nv.utils.windowResize(chart.update);
                return chart;
            };
            this.model = new Backbone.Model({
                test: function () { nv.addGraph(buildChart) },
            });
        },
        className: 'chart',
        template: Handlebars.compile(template),
    })
})
