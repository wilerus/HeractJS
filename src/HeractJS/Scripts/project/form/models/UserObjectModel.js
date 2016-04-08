/**
 * Developer: Roman Shumskiy
 * Date: 03/10/2014
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
            urlRoot: '/EleganceForm',

            getData: function (id) {
                this.url = '/EleganceForm/GetData/' + id;
                this.fetch({
                    success: this.parseData.bind(this)
                });
            },

            parse: function (resp) {
                return resp.data;
            },

            parseData: function (model, resp) {
                this.trigger('formDataLoaded', resp.data);
            },

            deleteForm: function (id) {
                var objToSend = {
                    id: id
                };
                App.API.post('/EleganceUserObject/Delete', objToSend).done(function () {
                    App.FormMediator.setSkipShowTask(true);
                    App.StateManager.state.form = null;
                    App.StateManager.updateItem();
                    App.StateManager.forceRefresh(true, false, 'showEmpty');
                });
            },

            editForm: function (id, data) {
                var objToSend = {
                    id: id,
                    data: data
                };

                App.API.post('/EleganceUserObject/Edit', objToSend).done(function (resp) {
                    if (resp.success) {
                        App.StateManager.forceRefresh(true, false);
                        App.FormMediator.cleanEditModel();
                        App.StateManager.state.isEdit = false;
                        App.StateManager.state.isCreate = false;
                        App.StateManager.updateItem();
                    } else {
                        App.NotificationsMediator.showError(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.FAILEDIT'));
                    }
                });
            },

            refreshForm: function (id, editedData, container, isReDraw) {
                var self = this,
                    objToSend = {
                    id: id,
                    data: editedData,
                    container: container
                };

                App.API.post('/EleganceUserObject/PrepareData', objToSend, {noMask: true}).done(function (resp) {
                    if (resp.success) {
                        if (isReDraw) {
                            self.trigger('formDataLoaded', resp.data);
                        } else {
                            App.FormMediator.formUpdated(resp.data);
                        }
                    } else {
                        App.NotificationsMediator.showError(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.FAILEDIT'));
                    }
                });
            },

            createForm: function (container, id, data) {
                var objToSend = {
                    container: container,
                    prototype: id,
                    data: data
                };

                App.API.post('/EleganceUserObject/Create', objToSend).done(function (resp) {
                    if (resp.success) {
                        App.StateManager.setNewFormId(resp.data);
                        App.StateManager.forceRefresh(true, false);
                        App.FormMediator.cleanEditModel();
                        App.StateManager.state.isEdit = false;
                        App.StateManager.state.isCreate = false;
                        App.StateManager.updateItem(resp.data);
                    } else {
                        App.NotificationsMediator.showError(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.FAILCREATE'));
                    }
                });
            },

            performTransition: function (tranisitonInfo) {
                App.API.post('/EleganceUserObject/NextStep', tranisitonInfo).done(function () {
                    App.StateManager.forceRefresh(true, true);
                });
            },

            reassignForm: function (id, userId) {
                var objToSend = {
                    itemId: id,
                    userId: userId
                };

                App.API.post('/EleganceUserObject/Reassign', objToSend).done(function () {
                    App.StateManager.forceRefresh(true, true);
                });
            },

            changeFollowState: function (id, state) {
                var objToSend = {
                    itemId: id,
                    follow: state
                };
                App.API.post('/EleganceUserObject/Follow', objToSend).done(function (resp) {
                    if (resp.success) {
                        App.StateManager.forceRefresh(true, true);
                        if (state) {
                            App.NotificationsMediator.showInfo(App.Localizer.get('ELEGANCE.FORM.ACTIONS.FOLLOWNOTIFICATION'));
                        } else {
                            App.NotificationsMediator.showInfo(App.Localizer.get('ELEGANCE.FORM.ACTIONS.UNFOLLOWNOTIFICATION'));
                        }
                    }
                });
            },

            defferTask: function (id) {
                var objToSend = {
                    id: id
                };
                App.API.post('/EleganceUserObject/Defer', objToSend).done(function () {
                    App.StateManager.forceRefresh(true, true);
                });
            },

            startTask: function (id) {
                var objToSend = {
                    id: id
                };
                App.API.post('/EleganceUserObject/Start', objToSend).done(function () {
                    App.StateManager.forceRefresh(true, true);
                });
            },

            completeTask: function (id) {
                var objToSend = {
                    id: id,
                    completeSubtask: true
                };
                App.API.post('/EleganceUserObject/Complete', objToSend).done(function () {
                    App.StateManager.forceRefresh(true, true);
                });
            },

            acceptTask: function (id) {
                var objToSend = {
                    id: id
                };
                App.API.post('/EleganceUserObject/Accept', objToSend).done(function (resp) {
                    if (resp.success) {
                        App.StateManager.forceRefresh(true, true);
                        App.NotificationsMediator.showInfo(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.TASK.ACCEPTED'));
                    }
                });
            },

            declineTask: function (id) {
                var objToSend = {
                    id: id
                };
                App.API.post('/EleganceUserObject/Decline', objToSend).done(function (resp) {
                    if (resp.success) {
                        App.StateManager.forceRefresh(true, true);
                        App.NotificationsMediator.showInfo(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.TASK.DECLINED'));
                    }
                });
            }
        });
    });