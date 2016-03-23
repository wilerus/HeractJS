/**
 * Developer: Stepan Burguchev
 * Date: 7/10/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer */

define(['coreui'], function (lib) {
    'use strict';
    return Marionette.Behavior.extend({
        initialize: function (options, view) {
        },

        modelEvents: {
            'change:compactMode': '__updateCompactMode'
        },

        __updateCompactMode: function () {
            this.view.render();
        }
    });
});
