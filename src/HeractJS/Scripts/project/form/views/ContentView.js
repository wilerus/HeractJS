/**
 * Developer: Roman Shumskiy
 * Date: 29/09/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, Backbone */

define([],
    function () {
        'use strict';

        var itemView = Marionette.ItemView.extend({
            template: Handlebars.compile(''),
            id: function (){
                return this.model.get('widgetId');
            }
        });

        return Marionette.CollectionView.extend({
            initialize: function (options) {
                var Collection = Backbone.Collection.extend();
                this.collection = new Collection(options.cfgCollection);
            },
            template: Handlebars.compile(''),
            tagName: 'div',
            className: 'card',
            childView: itemView
        });
    });
