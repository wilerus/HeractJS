/**
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
        'appMediator',
        './shared/application/views/DefaultContentView'
    ],
    function (en, core, shared, moduleConfigs, navigation, navigationContext, currentUserModel, stylesConfig, appMediator, DefaultContentView) {
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

        var appModuleConfigs = _.flatten([moduleConfigs]);

        Core.Application.start({
            regions: {
                navigationRegion: ".js-navigation-region",
                contentRegion: ".js-content-region",
                contentLoadingRegion: ".js-content-loading-region",
                fadingRegion: ".js-fading-region",
                popupRegion: ".js-popup-region",
                toastNotificationRegion: ".js-toast-notification-region"
            },
            ui: {
                contentContainer: $('.js-content-container'),
                navigationContainer: $('.js-navigation-container'),
                fadingRegion: $('.js-fading-region'),
                popupRegion: $('.js-popup-region'),
                toastNotificationRegion: $('.js-toast-notification-region')
            },
            localizationService: {
                langCode: window.langCode,
                localizationMap: window['LANGMAPEN'],
                warningAsError: !!window.Context.compiled
            },
            ajaxService: {
                ajaxMap: window.ajaxMap
            },
            windowService: {
                popupRegion: '.js-popup-region',
                ui: {
                    contentContainer: $('.js-content-container'),
                    navigationContainer: $('.js-navigation-container'),
                    fadingRegion: $('.js-fading-region'),
                    popupRegion: $('.js-popup-region'),
                    toastNotificationRegion: $('.js-toast-notification-region')
                }
            },
            userService: {
                dataProvider: {
                    listUsers() {
                        return shared.services.CacheService.GetUsers().map(user => ({
                            id: user.Id,
                            name: user.FullName || user.Text || '',
                            userName: user.Username || '',
                            abbreviation: user.Abbreviation || '',
                            avatarUrl: user.UserpicUri,
                            url: user.link
                        }));
                    }
                }
            },
            registerAppModule: moduleConfig => {
                if (!moduleConfig) {
                    Core.utils.helpers.throwArgumentError();
                }
                appModuleConfigs.push(moduleConfig);
            },
            webSocketConfiguration: {
                activateOnStart: true,
                url: "ws://" + window.location.host + "/notifications"
            },
            contentView: DefaultContentView,
            serviceInitializer() {
                this.currentUser = new currentUserModel(JSON.parse('{"UserId":"account.1","UserName":"admin","UserAbbreviation":"ad","UserLogin":"admin","PersonalContainer":"account.1_tasks","Language":"EN","NeedTrialInfo":false,"TutorialCompletedSteps":0,"TutorialDismissed":false,"IsAdmin":true,"IsManager":false,"IsResourcePoolManager":false,"IsSystemAdmin":false,"HasSubordinates":false}'));

                shared.services.ModuleService.initialize({
                    modules: appModuleConfigs
                });

                this.navigationController = new navigation.Controller({
                    context: navigationContext,
                    predefinedItems: []
                });

                shared.services.RoutingService.initialize({
                    defaultUrl: this.navigationController.getDefaultUrl(),
                    modules: appModuleConfigs
                });
                shared.services.SecurityService.initialize({
                    // userPermissions: Context.configurationModel.GlobalPermissions
                });

                this.navigationRegion.show(this.navigationController.view);
            }
        });
        //initialize application mediator
        window.application.appMediator = appMediator.AppMediator.getInstance();

        $('.js-startup-loading').remove();
    });
