/**
 * Developer: Grigory Kuznetsov
 * Date: 6/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App'],
    function (App) {
        'use strict';

        var CollectionModel = Backbone.Model.extend({
            initialize: function (cfg) {
                _.extend(this, cfg);
            }
        });

        var SubtasksCollection = Backbone.Collection.extend({
            model: CollectionModel,
            urlRoot: '/EleganceUserObject/GetSubtasks?itemId=',
            getSubtasks: function (id) {
                this.url = this.urlRoot + id;
                this.fetch({
                    reset: true,
                    success: this.onDataLoaded.bind(this)
                });
            },

            onDataLoaded: function () {
                this.trigger('subtasksLoaded');
            },

            parse: function (resp) {
                return resp.data;
            }
        });

        return SubtasksCollection;
    });
