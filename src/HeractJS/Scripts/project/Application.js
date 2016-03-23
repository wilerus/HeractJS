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
    'navigation', 'rootpath/NavigationContext'
    ],
    function (en, core, shared, moduleConfigs, navigation, navigationContext) {
    'use strict';

    window.Context = {};
    window.ajaxMap = [];
    window.flag_debug = true;

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


        // Backbone default behaviors path (obsolete because of inconsistency: we store behaviors in many different paths)
        Backbone.Marionette.Behaviors.behaviorsLookup = shared.views.behaviors;
        // obsolete old stuff initialization
        //noinspection JSUnresolvedVariable
    }
    App.addInitializer(function () {

        core.initialize({
            cacheService: shared.services.CacheService,
            ajaxService: {
                ajaxMap: window.ajaxMap
            },
            localizationService: {
                langCode: 'EN',
                localizationMap: window.LANGMAPEN,
                warningAsError: false //window.compiled
            },
            windowService: {
                fadingRegion: App.fadingRegion,
                popupRegion: App.popupRegion,
                ui: App.ui
            }
        });

        // Module service
        shared.services.ModuleService.initialize({
            modules: appModuleConfigs
        });
        // Navigation
        App.navigationController = new navigation.Controller({
            context: navigationContext,
            predefinedItems: userDefinedNavigationItems
        });
        shared.services.SecurityService.initialize({
           // userPermissions: Context.configurationModel.GlobalPermissions
        });
        // Routing service loads and initializes all the application routes and modules
        shared.services.RoutingService.initialize({
            defaultUrl: App.navigationController.getDefaultUrl(),
            modules: appModuleConfigs
        });
        // Window service provides global dialog and other stuff
        core.services.WindowService.initialize({
            fadingRegion: App.fadingRegion,
            popupRegion: App.popupRegion,
            ui: App.ui
        });

        // After that we show left navigation
        App.navigationRegion.show(App.navigationController.view);

        // And remove startup loading element
        $('.js-startup-loading').remove();
    });

    window.application = App;
    App.start();
});
