/**
 * Developer: Grigory Kuznetsov
 * Date: 7/11/2014
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

        var HistoryModel = Backbone.Model.extend({
            initialize: function (cfg) {
                _.extend(this, cfg);
            }
        });

        var HistoryCollection = Backbone.Collection.extend({
            model: HistoryModel,
            urlRoot: '/EleganceHistory/GetHistory?itemId=',
            getHistory: function (id) {
                this.url = this.urlRoot + id;
                this.fetch({
                    reset: true,
                    success: this.onDataLoaded.bind(this)
                });
            },

            onDataLoaded: function () {
                this.trigger('historyLoaded');
            },

            parse: function (resp) {
                return resp.data;
            }
        });

        return HistoryCollection;
    });
