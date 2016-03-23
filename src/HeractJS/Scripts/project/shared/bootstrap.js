/**
 * Developer: Stepan Burguchev
 * Date: 7/18/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Backbone, _, shared */

define([
    './application/Module',
    './application/views/behaviors/ContentViewBehavior',
    './utils/helpers',
    './utils/comparators',
    './services/RoutingService',
    './services/ModuleService',
    './services/SecurityService',
    './services/UrlService',
    './services/SidecardService',
  //  './services/CacheService',
  //  './services/FormService',
  //  './services/ToastNotificationService',
	'./services/ErrorService',
	'./Meta',


/*
    './general/DelayedSync',
    './general/BackboneErrorHandling',
    './general/PromiseErrorHandling',
    './general/BackboneAjaxCancellable'
*/

], function (Module, ContentViewBehavior, Helpers, Comparators,
            RoutingService, ModuleService, SecurityService, UrlService, SidecardService, //CacheService, //FormService, ToastNotificationService,
            ErrorService, Meta) {
    'use strict';
    return {
        application: {
            Module: Module,
            views: {
                behaviors: {
                    ContentViewBehavior: ContentViewBehavior
                }
            }
        },
/*        collections: {
            PersonCollection: PersonCollection
        },
        notifications: {
            controllers: {
                NotificationsController: NotificationsController,
                NotificationsInformerController: NotificationsInformerController
            }
        },
*/      

        services: {
            RoutingService: RoutingService,
            ModuleService: ModuleService,
            SecurityService: SecurityService,
            UrlService: UrlService,
            SidecardService: SidecardService,
            CacheService:  {
                GetUsers: function() {
                    return [];
                },
                ListUsers: function() {
                    return [];
                }
            },
            ErrorService: ErrorService,
        },
        utils: {
            helpers:Helpers,
            comparators: Comparators
        },
        meta: Meta
    };
});
