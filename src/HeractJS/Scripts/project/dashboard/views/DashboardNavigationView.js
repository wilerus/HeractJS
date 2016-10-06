define([
    'comindware/core',
    './template/dashboardNavigation.html'

], function (core, template) {
    'use strict';

    return function () {
        var collection = new Backbone.Collection([{ id: 'chart1', title: 'Chart1', selected: true }, { id: 'chart2', title: 'Chart2', selected: false }]);
        
        var ListItemView = Marionette.ItemView.extend({
            initialize: function () {
                if (this.model.attributes.selected) {
                    (this.$el.addClass('dasboard-navigation-item-selected'));
                }  
            },    
            template: Handlebars.compile(template),
            className: 'dashboard-navigation-button',
            events: {
                click: function (e) {
                    this.trigger('chartChanged', e)
                }
            },

        });

        var ListView = Marionette.CollectionView.extend({
            childView: ListItemView,
            collection: collection,
            className: 'dashboard-navigation-container',
            childEvents: {
                'chartChanged': function (e) {
                    this.changeSelection(e);
                    this.triggerMethod('chartChanged', e);
                }
            },
            changeSelection: function (e) {
                var views = this.children._views;
                for (var i in views) {
                    var selected = views[i].model.attributes.selected;
                    if (selected) {
                        views[i].model.attributes.selected = false;
                        views[i].$el.removeClass('dasboard-navigation-item-selected');
                        break
                    }
                }
                e.model.attributes.selected = true;
                e.$el.addClass('dasboard-navigation-item-selected');
            }
        });

        return new ListView
    };
});