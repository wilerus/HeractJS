define([
    'comindware/core',
    './template/dashboardNavigation.html'

], function (core, template) {
    'use strict';

    return function () {
        var collection = new Backbone.Collection([{ id: 'chart1', title: 'Chart1' }, { id: 'chart2', title: 'Chart2' }]);
        
        var ListItemView = Marionette.ItemView.extend({
            template: Handlebars.compile(template),
            events: {
                click: function (e) {
                    this.trigger('chartChanged', e)
                }
            }
        });

        var ListView = Marionette.CollectionView.extend({
            childView: ListItemView,
            collection: collection,
            childEvents: {
                'chartChanged': function (e) {
                    this.triggerMethod('chartChanged', e);
                }
            }
        });

        return new ListView
    };
});