/**
 * Developer: Grigory Kuznetsov
 * Date: 11/12/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['form/App'],
    function (App) {
        'use strict';
        return Backbone.Model.extend({
            url: '/EleganceForm/GetEnumerationValues/',
            initialize: function () {
                this.data = [];
            },
            parse: function (resp) {
                return resp.data;
            },
            getData: function () {
                this.fetch({
                    data: {propertyId: this.dataId},
                    success: this.onDataLoaded.bind(this)
                });
            },
            getFilteredData: function (filter) {
                this.fetch({
                    success: this.onDataLoaded.bind(this),
                    data: {
                        propertyId: this.dataId,
                        filter: filter
                    }
                });
            },
            onDataLoaded: function (model, resp) {
                this.data = resp.data;
                this.trigger('dataLoaded');
            }
        });
    });