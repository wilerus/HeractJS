/**
 * Developer: Stepan Burguchev
 * Date: 6/26/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer, Ajax */

define([
        'coreui',
        'shared',
        '../views/NavigationView',
        '../services/NavigationItemFactory'
    ],
    function (
        core,
        shared,
        NavigationView,
        NavigationItemFactory
    ) {
        'use strict';

        return Marionette.Controller.extend({
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'context');
                core.utils.helpers.ensureOption(options, 'predefinedItems');
                this.bindReqres();
                this.createModel(options.context);
                this.createView();
            },

            bindReqres: function () {
                this.reqres = new Backbone.Wreqr.RequestResponse();

                this.reqres.setHandler('mode:toggle', this.__toggleMode, this);
            },

            createModel: function (context) {
                this.model = new Backbone.Model();
                this.model.set('children', new Backbone.Collection(this.__getNavigationItems(context)));
                this.model.set('compactMode', false);
            },

            createView: function () {
                this.view = new NavigationView({
                    reqres: this.reqres,
                    model: this.model
                });
            },

            getDefaultUrl: function () {
                var firstItem = this.model.get('children').at(0);
                if (!firstItem || !firstItem.get('url')) {
                    core.utils.helpers.throwError('Failed to find a valid default module.');
                }
                return firstItem.get('url');
            },

            reload: function () {
                //noinspection JSUnresolvedFunction
                Ajax.Navigation.GetNavigationContext().then(function (context) {
                    this.model.get('children').reset(this.__getNavigationItems(context));
                }.bind(this));
            },

            __getNavigationItems: function (context) {
                //noinspection JSUnresolvedVariable
                var itemsArray = _.chain(context.workspace)
                    .filter(function (wsItem) {
                        if (wsItem.systemType === 'cmw.workspace.SystemItem') {
                            switch (wsItem.id) {
                                case 'cmw.workspace.MyTasksItem':
                                    return wsItem;
                                case 'cmw.workspace.PeopleItem':
                                    return wsItem;
                                case 'cmw.workspace.RecordsItem':
                                    return wsItem;
                                case 'cmw.workspace.GridItem':
                                    return wsItem;
                                case 'cmw.workspace.GanttItem':
                                    return wsItem;
                                case 'cmw.workspace.FormItem':
                                    return wsItem;
                                case 'cmw.workspace.SettingsItem':
                                    return wsItem;
                                case 'cmw.workspace.ProcessesItem':
                                    return wsItem;
                                case 'cmw.workspace.ProcessMonitoringItem':
                                    return wsItem;
                                case 'cmw.workspace.ArchitectureItem':
                                    return wsItem;
                                case 'cmw.workspace.DataDiagramItem':
                                    return wsItem;
                                case 'cmw.workspace.GlobalFunctionsItem':
                                    return wsItem;
                                case 'cmw.workspace.CommunicationChannelsItem':
                                    return wsItem;
                                case 'cmw.workspace.CommunicationRoutesItem':
                                    return wsItem;
                                case 'cmw.workspace.Chatik':
                                    return wsItem;
                            }
                        } else {
                            return wsItem;
                        }
                    }).map(function (wsItem) {
                        return NavigationItemFactory.createModel(wsItem);
                    }).value();

                itemsArray.push(new Backbone.Model({
                    compactMode: false,
                    id: "dashboard",
                    name: "Dashboard",
                    tooltip: "Dashboard",
                    type: "system",
                    url: shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.DASHBOARD)
                }));

                if (window.flag_debug) {
                    itemsArray.push(new Backbone.Model({
                        compactMode: false,
                        id: "demoCore",
                        name: "Core UI Demo",
                        tooltip: "Core UI Demo",
                        type: "system",
                        url: shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.DEMO_CORE)
                    }));
                }

                _.each(this.options.predefinedItems, function (item) {
                    itemsArray.push(_.extend({
                        compactMode: false,
                        type: "system",
                        tooltip: item.name
                    }, item));
                }, this);

                return itemsArray;
            },

            __toggleMode: function () {
                var newCompactMode = !this.model.get('compactMode');
                this.model.set('compactMode', newCompactMode);
            }
        });
    });
