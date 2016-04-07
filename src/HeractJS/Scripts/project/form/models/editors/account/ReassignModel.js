/**
 * Developer: Daniil Korolev
 * Date: 14/04/2015
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
            url: '/EleganceUserObject/GetPossibleAssignees/',
            initialize: function () {
                this.data = [];
            },
            parse: function (resp) {
                return resp.data;
            },
            getData: function (objId) {
                this.objId = objId;
                this.fetch({
                    success: this.onDataLoaded.bind(this),
                    data: {objId: objId}
                });
            },
            getFilteredData: function (filter) {
                var self = this;
                this.fetch({
                    success: this.onDataLoaded.bind(this),
                    data: { filter: filter, objId: self.objId }
                });
            },
            onDataLoaded: function (model, resp) {
                this.data = resp.data;
                this.trigger('dataLoaded');
            }
        });
    });
