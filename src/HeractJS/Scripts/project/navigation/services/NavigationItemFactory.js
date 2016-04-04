/**
 * Developer: Stepan Burguchev
 * Date: 6/29/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

define([
        'coreui',
        'shared',
        '../views/navigationItems/DefaultNavigationItemView',
        '../views/navigationItems/RecordTypeNavigationItemView'
    ],
    function (
        core,
        shared,
        DefaultNavigationItemView,
        RecordTypeNavigationItemView
    ) {
        'use strict';

        var systemTypes = {
            SYSTEM_ITEM: 'cmw.workspace.SystemItem',
            RECORD_TYPE: 'cmw.object.App'
        };

        var systemItems = {
            ARCHITECTURE: "cmw.workspace.ArchitectureItem",
            MY_TASKS: "cmw.workspace.MyTasksItem",
            PEOPLE: "cmw.workspace.PeopleItem",
            PROCESS_MONITOR: "cmw.workspace.ProcessMonitoringItem",
            DATA_MODEL: "cmw.workspace.DataDiagramItem",
            PROCESSES: "cmw.workspace.ProcessesItem",
            RECORDS: "cmw.workspace.RecordsItem",
            SETTINGS: "cmw.workspace.SettingsItem",
            GLOBAL_FUNCTIONS: "cmw.workspace.GlobalFunctionsItem",
            COMMUNICATION_CHANNELS: "cmw.workspace.CommunicationChannelsItem",
            COMMUNICATION_ROUTES: "cmw.workspace.CommunicationRoutesItem",
            GRID: "cmw.workspace.GridItem",
            GANTT: "cmw.workspace.GanttItem"
        };

        var configItems = [systemItems.ARCHITECTURE, systemItems.PROCESS_MONITOR, systemItems.DATA_MODEL, 
            systemItems.PROCESSES, systemItems.SETTINGS, systemItems.GLOBAL_FUNCTIONS];

        var systemItemMap = {};
        systemItemMap[systemItems.ARCHITECTURE] = 'architecture';
        systemItemMap[systemItems.MY_TASKS] = 'myTasks';
        systemItemMap[systemItems.PEOPLE] = 'people';
        systemItemMap[systemItems.PROCESS_MONITOR] = 'processMonitor';
        systemItemMap[systemItems.DATA_MODEL] = 'dataModel';
        systemItemMap[systemItems.PROCESSES] = 'processes';
        systemItemMap[systemItems.RECORDS] = 'records';
        systemItemMap[systemItems.SETTINGS] = 'settings';
        systemItemMap[systemItems.GLOBAL_FUNCTIONS] = 'globalFunctions';
        systemItemMap[systemItems.COMMUNICATION_CHANNELS] = 'communicationChannels';
        systemItemMap[systemItems.COMMUNICATION_ROUTES] = 'communicationRoutes';
        systemItemMap[systemItems.GRID] = 'grid';
        systemItemMap[systemItems.GANTT] = 'gantt';

        return {
            createModel: function (attributes) {
                switch (attributes.systemType) {
                case systemTypes.SYSTEM_ITEM:
                    return this.__createSystemModel(attributes);
                case systemTypes.RECORD_TYPE:
                    return this.__createRecordTypeModel(attributes);
                default:
                    core.utils.helpers.throwFormatError('Invalid systemType.');
                }
            },

            createView: function (model) {
                switch (model.get('type')) {
                case 'system':
                    return DefaultNavigationItemView;
                case 'recordType':
                    return RecordTypeNavigationItemView;
                default:
                    core.utils.helpers.throwFormatError('Invalid navigation item type.');
                }
            },

            __createSystemModel: function (attributes) {
                //noinspection JSUnresolvedVariable
                var result = {
                    id: systemItemMap[attributes.id],
                    config: configItems.indexOf(attributes.id) > -1,
                    type: 'system',
                    compactMode: false
                };

                switch (attributes.id) {
                case systemItems.ARCHITECTURE:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_ARCHITECTURE_SHOWALL);
                    result.name = Localizer.get('PROCESS.COMMON.NAVIGATION.ARCHITECTURE.NAME');
                    result.tooltip = Localizer.get('PROCESS.COMMON.NAVIGATION.ARCHITECTURE.TIP');
                    break;
                case systemItems.MY_TASKS:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.MYTASKS);
                    result.name = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.MYTASKS.NAME');
                    result.tooltip = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.MYTASKS.TIP');
                    break;
                case systemItems.PEOPLE:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PEOPLE_USERS);
                    result.name = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.PEOPLE.NAME');
                    result.tooltip = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.PEOPLE.TIP');
                    break;
                case systemItems.PROCESS_MONITOR:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_PROCESSMONITOR);
                    result.name = Localizer.get('PROCESS.COMMON.NAVIGATION.PROCEESSMONITOR.NAME');
                    result.tooltip = Localizer.get('PROCESS.COMMON.NAVIGATION.PROCEESSMONITOR.TIP');
                    break;
                case systemItems.DATA_MODEL:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_DATADIAGRAM);
                    result.name = Localizer.get('PROCESS.COMMON.NAVIGATION.DATAMODEL.NAME');
                    result.tooltip = Localizer.get('PROCESS.COMMON.NAVIGATION.DATAMODEL.TIP');
                    break;
                case systemItems.PROCESSES:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_PROCESSTEMPLATES_SHOWALL);
                    result.name = Localizer.get('PROCESS.COMMON.NAVIGATION.PROCESSTEMPLATES.NAME');
                    result.tooltip = Localizer.get('PROCESS.COMMON.NAVIGATION.PROCESSTEMPLATES.TIP');
                    break;
                case systemItems.RECORDS:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_RECORDTYPES_SHOWALL);
                    result.name = Localizer.get('PROCESS.COMMON.NAVIGATION.RECORDTYPES.NAME');
                    result.tooltip = Localizer.get('PROCESS.COMMON.NAVIGATION.RECORDTYPES.TIP');
                    break;
                case systemItems.SETTINGS:
                    if (shared.services.SecurityService.hasGlobalPermission(shared.services.SecurityService.globalPermissions.APP_DESIGN)) {
                        result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.SETTINGS_GROUPS);
                        result.name = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.SETTINGS.NAME');
                        result.tooltip = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.SETTINGS.TIP');
                    } else {
                        result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.SETTINGS_WORKSPACE);
                        result.name = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.SETTINGS.NAME');
                        result.tooltip = Localizer.get('TEAMNETWORK.COMMON.NAVIGATION.SETTINGS.TIP');
                    }
                    break;
                case systemItems.GLOBAL_FUNCTIONS:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.SUPPORT_GLOBAL_FUNCTIONS);
                    result.name = Localizer.get('TEAMNETWORK.WORKSPACE.GLOBALFUNCTIONSITEM.NAME');
                    result.tooltip = Localizer.get('TEAMNETWORK.WORKSPACE.GLOBALFUNCTIONSITEM.NAME');
                    break;

                case systemItems.COMMUNICATION_CHANNELS:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.SUPPORT_COMMUNICATION_CHANNELS);
                    result.name = Localizer.get('TEAMNETWORK.WORKSPACE.COMMUNICATIONCHANNELS.NAME');
                    result.tooltip = Localizer.get('TEAMNETWORK.WORKSPACE.COMMUNICATIONCHANNELS.TIP');
                    break;

                case systemItems.COMMUNICATION_ROUTES:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.SUPPORT_COMMUNICATION_ROUTES);
                    result.name = Localizer.get('TEAMNETWORK.WORKSPACE.COMMUNICATIONROUTES.NAME');
                    result.tooltip = Localizer.get('TEAMNETWORK.WORKSPACE.COMMUNICATIONROUTES.TIP');
                    break;

                case systemItems.GRID:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.GRID);
                    result.name = 'Grid view';
                    result.tooltip = 'Grid view';
                    break;

                case systemItems.GANTT:
                    result.url = shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.GANTT);
                    result.name = 'Gantt view';
                    result.tooltip = 'Gantt view';
                    break;

                }
                return new Backbone.Model(result);
            },

            __createRecordTypeModel: function (attributes) {
                return new Backbone.Model({
                    id: attributes.id,
                    name: attributes.name,
                    iconUrl: null,
                    type: 'recordType',
                    tooltip: '',
                    compactMode: false,
                    url: shared.services.ModuleService.getDefaultModuleUrl(shared.services.ModuleService.modules.PROCESS_RECORDTYPES_RECORDS, {
                        recordTypeId: shared.services.UrlService.encodeObjectId(shared.services.UrlService.objectTypes.RECORD_TYPE, attributes.id)
                    })
                });
            }
        };
    });