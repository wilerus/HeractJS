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

        var TimespentItemModel = Backbone.Model.extend({
            initialize: function (cfg) {
                _.extend(this, cfg);
            },
            create: function () {
                this.set({'target': App.StateManager.state.form});
                var recordRaw = this.toJSON();

                App.API.post('/EleganceTimeSpent/create', {recordRaw: recordRaw}).done(function (resp) {
                    if (resp.success) {
                        App.FormMediator.showCurrentItemTimespent();
                    }
                }.bind(this));
            },
            edit: function () {
                var id = this.get('id'),
                    recordRaw = this.toJSON();

                App.API.post('/EleganceTimeSpent/Edit', {recordId: id, recordRaw: recordRaw}).done(function (resp) {
                    if (resp.success) {
                        App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                        App.FormMediator.showCurrentItemTimespent();
                    }
                }.bind(this));
            },

            delete: function () {
                var id = this.get('id');

                App.API.post('/EleganceTimeSpent/Delete', {recordId: id}).done(function (resp) {
                    if (resp.success) {
                        App.FormMediator.showCurrentItemTimespent();
                    }
                }.bind(this));
            }
        });

        var TimespentCollection = Backbone.Collection.extend({
            model: TimespentItemModel
        });

        var TimespentModel = Backbone.Model.extend({
            urlRoot: '/EleganceTimeSpent/GetList?taskId=',
            initialize: function () {
                this.recordCollection = new TimespentCollection();
            },
            getTimespent: function (id) {
                this.url = this.urlRoot + id;
                this.fetch({
                    reset: true,
                    success: this.onDataLoaded.bind(this)
                });
            },
            onDataLoaded: function (model) {
                this.recordCollection.reset(model.get('records'));
                this.trigger('timespentLoaded');
            },
            parse: function (resp) {
                return resp.data;
            }
        });

        return TimespentModel;
    });
