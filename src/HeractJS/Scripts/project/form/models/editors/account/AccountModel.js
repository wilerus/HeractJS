/**
 * Developer: Grigory Kuznetsov
 * Date: 10/12/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define([],
    function () {
        'use strict';
        return Backbone.Model.extend({
            url: '/Elegance/GetAccountsList/',
            initialize: function () {
                this.data = [];
            },
            parse: function (resp) {
                return resp.data;
            },
            getFilteredData: function(filter){
                this.fetch({
                    data: { filter: filter },
                    success: this.onDataLoaded.bind(this)
                });
            },
            getData: function () {
                this.url = this.url;
                this.fetch({
                    success: this.onDataLoaded.bind(this)
                });
            },
            onDataLoaded: function (model, resp) {
                this.data = resp.data;
                this.trigger('dataLoaded');
            }
        });
    });
