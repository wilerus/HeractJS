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
        '../../templates/navigationItems/defaultNavigationItem.hbs',
        './behaviors/NavigationItemBehavior'
    ],
    function (core, template, NavigationItemBehavior) {
        'use strict';

        return Marionette.ItemView.extend({
            initialize: function (options) {
                core.utils.helpers.ensureOption(options, 'model');
            },

            behaviors: {
                NavigationItemBehavior: {
                    behaviorClass: NavigationItemBehavior
                }
            },

            tagName: 'li',

            className: 'left-menu__item',

            template: template
        });
    });
