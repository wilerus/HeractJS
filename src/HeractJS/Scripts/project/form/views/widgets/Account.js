/**
 * Developer: Roman Shumskiy
 * Date: 06/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/widgets/account.html'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (opts) {
                this.generalModel = opts.generalModel;
                this.dataId = this.generalModel.get('dataId');
                _.bindAll(this, "template");
                this.render();
            },
            className: 'card__link',
            events: {
                'click': 'showProfile'
            },
            template: Handlebars.compile(itemTmpl),
            onRender: function(){
                this.$el.addClass(this.className);
            },
            showProfile: function(){
                App.FormMediator.updateItem(false, {
                    fieldId: this.dataId,
                    type: 'account',
                    userId: this.model.get('instanceId')
                });
            }
        });
    });
