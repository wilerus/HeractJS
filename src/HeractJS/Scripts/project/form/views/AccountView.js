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

/* global define, _ */

define(['../App', '../templates/account.html', '../models/AccountModel'],
    function (App, headerTmpl, AccountModel) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                this.model = new AccountModel(options.account);

                this.listenTo(this.model, 'sync', this.render.bind(this));
            },
            template: Handlebars.compile(headerTmpl),
            className: 'card card_person'
        });
    });
