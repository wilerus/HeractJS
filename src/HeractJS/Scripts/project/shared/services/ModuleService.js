/**
 * Developer: Stepan Burguchev
 * Date: 7/3/2015
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
    ],
    function (core) {
        'use strict';

        var configs;

        var modules = {
            SETTINGS_GROUPS: 'module:settings:groups',
            SETTINGS_WORKSPACE: 'module:settings:workspace',
            SETTINGS_ROLES: 'module:settings:roles',
            SETTINGS_ACTIVE_DIRECTORY: 'module:settings:activeDirectory',

            MYTASKS: 'module:myTasks',
            MYTASKS_DESIGNER: 'module:myTasks:formDesigner',
            PEOPLE_USERS: 'module:people:users',
            DEMO_CORE: 'module:demo:core',

            GRID: 'module:grid',
	        GANTT: 'module:gantt',
            CHATIK: 'module:chatik',

	        FORM: 'module:form',

	        DASHBOARD: 'module:dashboard',

            PROJECT_ROOMS_SHOWALL: 'module:project:rooms:showAll',
            PROJECT_ROOMS_OVERVIEW: 'module:project:rooms:overview',

            PROCESS_PROCESSTEMPLATES_DESIGNER: 'module:process:processTemplates:designer',
            PROCESS_PROCESSTEMPLATES_ATTRIBUTES: 'module:process:processTemplates:attributes',
            PROCESS_PROCESSTEMPLATES_STATISTICS: 'module:process:processTemplates:statistics',
            PROCESS_PROCESSTEMPLATES_SETTINGS: 'module:process:processTemplates:settings',
            PROCESS_PROCESSTEMPLATES_SHOWALL: 'module:process:processTemplates:showAll',

            PROCESS_PROCESSTEMPLATES_DESIGNER_ACTIVITY_CONTEXT: 'module:process:processTemplates:designer:activity:context',
            PROCESS_PROCESSTEMPLATES_DESIGNER_ACTIVITY_FORMDESIGNER: 'module:process:processTemplates:designer:activity:formDesigner',
            PROCESS_PROCESSTEMPLATES_DESIGNER_ACTIVITY_SETTINGS: 'module:process:processTemplates:designer:activity:settings',
            PROCESS_PROCESSTEMPLATES_DESIGNER_ACTIVITY_RULES: 'module:process:processTemplates:designer:activity:rules',

            PROCESS_ARCHITECTURE_OVERVIEW: 'module:process:architecture:overview',
            PROCESS_ARCHITECTURE_DESIGNER: 'module:process:architecture:designer',
            PROCESS_ARCHITECTURE_DESIGNER_ACTIVITY_SETTINGS: 'module:process:architecture:designer:activity:settings',
            PROCESS_ARCHITECTURE_SHOWALL: 'module:process:architecture:showAll',

            PROCESS_RECORDTYPES_ATTRIBUTES: 'module:process:recordTypes:attributes',
            PROCESS_RECORDTYPES_DIAGRAM: 'module:process:recordTypes:diagram',
            PROCESS_RECORDTYPES_FORMDESIGNER: 'module:process:recordTypes:formDesigner',
            PROCESS_RECORDTYPES_SETTINGS: 'module:process:recordTypes:settings',
            PROCESS_RECORDTYPES_RECORDS: 'module:process:recordTypes:records',
            PROCESS_RECORDTYPES_SHOWALL: 'module:process:recordTypes:showAll',

            PROCESS_PROCESSMONITOR: 'module:process:processMonitor',
            PROCESS_DATADIAGRAM: 'module:process:dataDiagram',

            SUPPORT_GLOBAL_FUNCTIONS: 'module:support:globalFunctions',

            SUPPORT_COMMUNICATION_ROUTES: 'module:support:routes',
            SUPPORT_COMMUNICATION_CHANNELS: 'module:support:channels'
        };

        var messagesCache = {};

        return {
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'modules');
                configs = options.modules;
            },

            getDefaultModuleUrl: function (moduleId, options) {
                return this.getModuleUrlByName('default', moduleId, options);
            },

            getModuleUrlByName: function (urlName, moduleId, options) {
                //return '#' + moduleId + '/' + urlName;

                options = options || {};
                var moduleConfig = _.findWhere(configs, { id : moduleId }) || _.findWhere(configs.default, { id : moduleId });
                if (!moduleConfig) {
                    return '#' + moduleId + '/' + urlName;
                    core.utils.helpers.throwError('Failed to find a module with id `' + moduleId + '`.');
                }
                if (!moduleConfig.navigationUrl) {
                    return '#' + moduleId + '/' + urlName;
                    core.utils.helpers.throwError('The module `' + moduleId + '` is incomplete and doesn`t have navigationUrl.');
                }
                var url = moduleConfig.navigationUrl[urlName];
                if (!url) {

                    return '#' + moduleId + '/' + urlName;
                    core.utils.helpers.throwError('Failed to find navigation url `' + urlName + '` in the module `' + moduleId + '`');
                }

                var result = [];
                var lastIndex = 0;
                var match;
                var re = /:[^/]+(?=\/|$)/g;
                while (true) {
                    match = re.exec(url);
                    if (!match) {
                        break;
                    }
                    result.push(url.substring(lastIndex, match.index));
                    var param = match[0].substring(1);
                    var opt = options[param];
                    if (!opt) {
                        core.utils.helpers.throwFormatError('Missing url options `' + param + '`.');
                    }
                    result.push(opt);
                    lastIndex = match.index + param.length + 1;
                }
                result.push(url.substring(lastIndex));
                var resultUrl = result.join('');
                if (resultUrl[0] !== '#') {
                    resultUrl = '#' + resultUrl;
                }
                return resultUrl;
            },

            pushMessage: function (moduleId, jsonObj) {
                if (!_.has(messagesCache, moduleId)) {
                    messagesCache[moduleId] = [];
                }
                messagesCache[moduleId].push(jsonObj);
            },

            listMessages: function (moduleId) {
                return messagesCache[moduleId] || [];
            },

            deleteMessage: function (moduleId, messageIndex) {
                if (!moduleId) {
                    core.utils.helpers.throwArgumentError("Invalid input parameter `moduleId`");
                }
                if (!_.isNumber(messageIndex)) {
                    core.utils.helpers.throwArgumentError("Invalid input parameter `messageIndex`");
                }
                if (!messagesCache[moduleId]) {
                    return;
                }
                if (messagesCache[moduleId].length <= 1) {
                    delete messagesCache[moduleId];
                    return;  
                }    
                messagesCache[moduleId] = messagesCache[moduleId].splice(messageIndex, 1);
            },

            modules: modules
        };
    });
