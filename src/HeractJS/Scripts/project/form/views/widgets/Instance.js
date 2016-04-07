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

define(['../../App', '../../templates/widgets/instance.html'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (opts) {
                this.isNotInstance = opts.isNotInstance;
                _.bindAll(this, "template");
                this.render();
            },
            className: 'card__link',
            ui: {
                link: 'a'
            },
            events: {
                'click': 'showItem'
            },
            template: Handlebars.compile(itemTmpl),
            onRender: function () {
                this.$el.addClass(this.className);

                if (this.isNotInstance) {
                    this.ui.link.addClass('disabled-link');
                }
            },
            showItem: function () {
                if (this.isNotInstance) {
                    return;
                }

                var itemId = this.model.get('instanceId');
                if (itemId) {
                    App.FormMediator.showItemById(itemId);
                }
            }
        });
    });
