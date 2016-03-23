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
        '../application/views/contentloadingview',
        './ModuleProxy'
    ],
    function (core, ContentLoadingView, ModuleProxy) {
        'use strict';

        var activeModule = null;
        var loadingContext = null;
        var thisOptions = null;
        var router;

        var __registerDefaultRoute = function () {
            var DefaultRouter = Marionette.AppRouter.extend({
                routes: {
                    "": "defaultRoute"
                },
                defaultRoute: function () {
                    routingService.navigateToUrl(thisOptions.defaultUrl, { replace: true });
                }
            });
            router = new DefaultRouter();
        };

        var __onModuleLoading = function (callbackName, routingArgs, config) {
            loadingContext = {
                config: config,
                leavingPromise: null,
                loaded: false
            };
            if (!activeModule) {
                window.application.contentLoadingRegion.show(new ContentLoadingView());
            } else {
                loadingContext.leavingPromise = Promise.resolve(activeModule.leave());
                loadingContext.leavingPromise.then(function (canLeave) {
                    if (!canLeave && this.getPreviousUrl()) {
                        // getting back to last url
                        routingService.navigateToUrl(this.getPreviousUrl(), { replace: true, trigger: false });
                        return;
                    }
                    //clear all promises of the previous module
                    core.services.PromiseServer.cancelAll();
                    if (!loadingContext.loaded) {
                        activeModule.view.setModuleLoading(true);
                    }
                }.bind(this));
            }
        };

        var __onModuleLoaded = function (callbackName, routingArgs, config, Module) {
            // reject race condition
            if (loadingContext === null || loadingContext.config.module !== config.module) {
                return;
            }

            loadingContext.loaded = true;
            Promise.resolve(loadingContext.leavingPromise ? loadingContext.leavingPromise : true).then(function (canLeave) {
                if (!canLeave) {
                    return;
                }

                // reset loading region
                window.application.contentLoadingRegion.reset();
                if (activeModule) {
                    activeModule.view.setModuleLoading(false);
                }
                var movingOut = activeModule && activeModule.options.config.module !== config.module;

                // destroy active module
                if (activeModule && movingOut) {
                    activeModule.destroy();
                }

                // construct new module
                if (!activeModule || movingOut) {
                    activeModule = new Module({
                        config: config,
                        region: window.application.contentRegion
                    });
                }

                // navigate to new module
                loadingContext = null;
                if (activeModule.onRoute) {
                    activeModule.onRoute.apply(activeModule, routingArgs);
                }
                var routingCallback = activeModule[callbackName];
                if (!routingCallback) {
                    var moduleId = config.id || config.module;
                    core.utils.helpers.throwError(
                        'Failed to find callback method `' + callbackName + '` for the module `' + moduleId + '`.');
                }
                routingCallback.apply(activeModule, routingArgs);
            }.bind(this));
        };

        var routingService = _.extend(_.clone(core.services.RoutingServiceBase), {
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'defaultUrl');
                core.utils.helpers.ensureOption(options, 'modules');
                var configs = options.modules;
                thisOptions = options;
                _.each(configs, function (config) {
                    var moduleProxy = new ModuleProxy({
                        config: config
                    });
                    moduleProxy.on('module:loading', __onModuleLoading, this);
                    moduleProxy.on('module:loaded', __onModuleLoaded, this);
                    new Marionette.AppRouter({
                        controller: moduleProxy,
                        appRoutes: config.routes
                    });
                }, this);

                __registerDefaultRoute();
                core.services.RoutingServiceBase.initialize();
            },
            
            logoutImmediate: function() {
                Ajax.Home.Logout().then(function () {
                    window.location = "";
                });

            },

            logout: function () {
                //noinspection JSUnresolvedVariable
                if (!activeModule || !activeModule.leave)
                    this.logoutImmediate();

                Promise.resolve(_.result(activeModule, "leave")).then(function(canLeave) {
                    if (canLeave)
                        this.logoutImmediate();
                }.bind(this));
            }
        });
        return routingService;
    });
