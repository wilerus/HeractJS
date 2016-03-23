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

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

define([
        'coreui',
        '../templates/navigation.hbs',
        '../services/NavigationItemFactory'
    ], function (core, template, NavigationItemFactory) {
        'use strict';

        var constants = {
            DEFAULT_MODE_WIDTH: 260,
            COMPACT_MODE_WIDTH: 51,
            MODE_CHANGE_DURATION_MS: 200
        };

        var classes = {
            COMPACT: 'compact'
        };

        return Marionette.CompositeView.extend({
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'model');
                core.utils.helpers.ensureOption(options, 'reqres');

                this.reqres = options.reqres;

                this.collection = this.model.get('children');
                this.uiState = {
                    compactMode: false
                };
            },

            tagName: 'div',

            className: 'l-left-menu',

            template: template,

            modelEvents: {
                'change:compactMode': '__updateCompactMode'
            },

            events: {
                'click @ui.toggleNavigationButton': '__toggleNavigationMode'
            },

            ui: {
                toggleNavigationButton: '.js-toggle-navigation-button'
            },

            childViewContainer: '.js-navigation-items-container',

            onRender: function () {
                this.__updateCompactMode();
            },

            getChildView: function(child) {
                return NavigationItemFactory.createView(child);
            },

            __toggleNavigationMode: function () {
                this.reqres.request('mode:toggle');
            },

            __updateCompactMode: function () {
                var compactMode = this.model.get('compactMode');
                if (compactMode === this.uiState.compactMode) {
                    return;
                }

                var updateChildrenCompactMode = function () {
                    this.model.get('children').each(function (childNavigationItemModel) {
                        childNavigationItemModel.set('compactMode', compactMode);
                    });
                }.bind(this);
                if (compactMode) {
                    updateChildrenCompactMode();
                }

                var navigationContainerWidth;
                var contentContainerLeft;
                if (compactMode) {
                    navigationContainerWidth = constants.COMPACT_MODE_WIDTH + 'px';
                    contentContainerLeft = '-=' + (constants.DEFAULT_MODE_WIDTH - constants.COMPACT_MODE_WIDTH) + 'px';
                } else {
                    navigationContainerWidth = constants.DEFAULT_MODE_WIDTH + 'px';
                    contentContainerLeft = '+=' + (constants.DEFAULT_MODE_WIDTH - constants.COMPACT_MODE_WIDTH) + 'px';
                }

                var onFinish = function () {
                    $(window).resize();
                    if (!compactMode) {
                        updateChildrenCompactMode();
                    }
                };

                window.application.ui.navigationContainer.animate(
                    { 'width': navigationContainerWidth },
                    constants.MODE_CHANGE_DURATION_MS,
                    onFinish);
                window.application.ui.contentContainer.animate(
                    { 'left': contentContainerLeft },
                    constants.MODE_CHANGE_DURATION_MS);

                this.ui.toggleNavigationButton.toggleClass(classes.COMPACT, compactMode);

                this.uiState.compactMode = compactMode;
            }
        });
    });

