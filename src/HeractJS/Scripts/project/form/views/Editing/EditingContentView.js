/**
 * Developer: Daniil Korolev
 * Date: 12/03/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../../App'],
    function (App) {
        'use strict';

        return Backbone.Form.extend({
            autocommit: false,
            initialize: function () {

                Backbone.Form.prototype.initialize.apply(this, arguments);

                this.listenTo(App.FormMediator, 'saveEditFormDataToModel', function () {
                    this.commit();
                    App.FormMediator.sendEditedInfoToServer();
                }.bind(this));

            }
        });
    });