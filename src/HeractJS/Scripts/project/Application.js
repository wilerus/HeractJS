﻿/**
 * Developer: Stepan Burguchev
 * Date: 6/15/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, _, $, Context */

define([
        'LANGMAPEN',
        'coreui', 'shared',
        'rootpath/moduleConfigs',
        'navigation', 'rootpath/NavigationContext',
        'rootpath/CurrentUserModel',
        'rootpath/StylesConfig',
        'appMediator'
    ],
    function (en, core, shared, moduleConfigs, navigation, navigationContext, currentUserModel, stylesConfig, appMediator) {
        'use strict';

        window.Context = {};
        window.ajaxMap = [];
        window.flag_debug = true;
        window.langCode = 'en';

        Localizer.initialize({
            langCode: 'en',
            localizationMap: window['LANGMAPEN'],
            warningAsError: !!window.Context.compiled
        });

        var App = new Marionette.Application();

        App.addRegions({
            navigationRegion: ".js-navigation-region",
            contentRegion: ".js-content-region",
            contentLoadingRegion: ".js-content-loading-region",
            fadingRegion: ".js-fading-region",
            popupRegion: ".js-popup-region",
            toastNotificationRegion: ".js-toast-notification-region"
        });

        App.ui = {
            contentContainer: $('.js-content-container'),
            navigationContainer: $('.js-navigation-container'),
            fadingRegion: $('.js-fading-region'),
            popupRegion: $('.js-popup-region'),
            toastNotificationRegion: $('.js-toast-notification-region')
        };

        var appModuleConfigs = _.flatten([moduleConfigs]);
        App.registerAppModule = function (moduleConfig) {
            if (!moduleConfig) {
                core.utils.helpers.throwArgumentError();
            }
            appModuleConfigs.push(moduleConfig);
        };

        var userDefinedNavigationItems = [];
        App.registerNavigationItem = function (item) {
            if (!item) {
                core.utils.helpers.throwArgumentError();
            }
            userDefinedNavigationItems.push(item);
        };

        function configure() {
            var langCode = Context.langCode = 'EN';
            // DateTimePicker
            if (!$.fn.datetimepicker.dates[langCode]) {
                $.fn.datetimepicker.dates[langCode] = {
                    days: Localizer.get('CORE.FORMATS.DATETIME.DAYSFULL').split(','), //["Sunday", "Monday", ... ]
                    daysShort: Localizer.get('CORE.FORMATS.DATETIME.DAYSSHORT').split(','), //["Sun", "Mon", ... ],
                    daysMin: Localizer.get('CORE.FORMATS.DATETIME.DAYSSHORT').split(','),
                    months: Localizer.get('CORE.FORMATS.DATETIME.MONTHS').split(','), //["January", "February", ... ]
                    monthsShort: Localizer.get('CORE.FORMATS.DATETIME.MONTHSSHORT').split(','), //["Jan", "Feb", ... ]
                    today: Localizer.get('CORE.FORMATS.DATETIME.TODAY'),
                    meridiem: Localizer.get('CORE.FORMATS.DATETIME.MERIDIEM').split(',')
                };
            }
        }
        App.addInitializer(function () {
            // Module service
            App.currentUser = new currentUserModel(JSON.parse('{"UserId":"account.1","UserName":"admin","UserAbbreviation":"ad","UserLogin":"admin","PersonalContainer":"account.1_tasks","Language":"EN","NeedTrialInfo":false,"TutorialCompletedSteps":0,"TutorialDismissed":false,"IsAdmin":true,"IsManager":false,"IsResourcePoolManager":false,"IsSystemAdmin":false,"HasSubordinates":false}'));
            shared.services.ModuleService.initialize({
                modules: appModuleConfigs
            });
            App.navigationController = new navigation.Controller({
                context: navigationContext,
                predefinedItems: userDefinedNavigationItems
            });
            // Routing service loads and initializes all the application routes and modules
            shared.services.RoutingService.initialize({
                defaultUrl: App.navigationController.getDefaultUrl(),
                modules: appModuleConfigs
            });
            shared.services.SecurityService.initialize({
                // userPermissions: Context.configurationModel.GlobalPermissions
            });

            core.initialize({
                cacheService: shared.services.CacheService,
                ajaxService: {
                    ajaxMap: window.ajaxMap
                },
                localizationService: {
                    langCode: 'en',
                    localizationMap: window.LANGMAPEN,
                    warningAsError: false //window.compiled
                },
                windowService: {
                    fadingRegion: App.fadingRegion,
                    popupRegion: App.popupRegion,
                    ui: App.ui
                },
                userService: {
                    dataProvider: {
                        listUsers: function () {
                            return shared.services.CacheService.GetUsers().map(function (user) {
                                return {
                                    id: user.Id,
                                    name: user.FullName || user.Text || '',
                                    userName: user.Username || '',
                                    abbreviation: user.Abbreviation || '',
                                    avatarUrl: user.UserpicUri,
                                    url: user.link
                                };
                            });
                        }
                    }
                }
            });

            // After that we show left navigation
            App.navigationRegion.show(App.navigationController.view);

            // And remove startup loading element
            $('.js-startup-loading').remove();
            var uri = "ws://" + window.location.host + "/notifications";

            var socket = new WebSocket(uri);
            socket.onopen = function(event) {
                console.log("opened connection to " + uri);
            };
            socket.onclose = function(event) {
                console.log("closed connection from " + uri);
            };
            socket.onmessage = function(event) {
                console.log(event.data);
            };
            socket.onerror = function(event) {
                console.log("error: " + event.data);
            };
        });

        //initialize application mediator
        App.appMediator = appMediator.AppMediator.getInstance();

        window.application = App;

        App.start();
    });
