/**
 * Developer: Roman Shumskiy
 * Date: 17/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../../../App'],
    function (App) {
        'use strict';
        return Backbone.Model.extend({
            url: '/Elegance/GetObjectsList',
            initialize: function () {
                this.data = [];
            },
            parse: function (resp) {
                return resp.data;
            },
            getData: function () {
                if (this.query === '') { //fix for deleted ref's
                    this.onDataLoaded(this, {data: []});
                    return;
                }

                this.fetch({
                    data: {query: this.query, property: this.property},
                    success: this.onDataLoaded.bind(this)
                });
            },
            getFilteredData: function (filter) {
                if (this.query === '') { //fix for deleted ref's
                    this.onDataLoaded(this, {data: []});
                    return;
                }

                this.fetch({
                    data: {query: this.query, property: this.property, filter: filter},
                    success: this.onDataLoaded.bind(this)
                });
            },
            onDataLoaded: function (model, resp) {
                this.data = resp.data;
                this.trigger('dataLoaded');
            }
        });
    });