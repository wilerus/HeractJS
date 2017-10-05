define([
    'comindware/core',
    './template/Chart.html',
    'nvd3',
], function (object, template) {
    return Marionette.LayoutView.extend({
        initialize: function (options) {
            var cfg = options.get('config');
            var buildChart = function () {
                var chart = nv.models.pieChart()
                            .x(cfg.x)
                            .y(cfg.y)
                            .duration(cfg.duration)
                            .margin(cfg.margin)
                            .showLabels(cfg.showLabels)
                            .title(cfg.title)
                            .labelsOutside(cfg.labelsOutside)
                            .donut(cfg.donut)
                            .width(cfg.width)
                            .height(cfg.height)
                            .showLegend(cfg.showLegend);
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
            