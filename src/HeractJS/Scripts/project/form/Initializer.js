/**
 * Developer: Daniil Korolev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define([
    'shared',
    './views/DefaultContentView',
    './controllers/FormController',
], function (
    shared, DefaultContentView, FormController
) {
    'use strict';

    return shared.application.Module.extend({
        contentView: DefaultContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.formController = new FormController();
            this.moduleRegion.show(this.formController.formLayoutView);
        }
    });
});
