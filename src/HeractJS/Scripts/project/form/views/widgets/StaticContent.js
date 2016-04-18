/**
 * Developer: Roman Shumskiy
 * Date: 14/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/templates/widgets/staticContent.hbs'],
    function (tpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                this.css = options.css;
                this.isVisible = this.model.get('isVisible');
                this.render();
            },
            ui: {
                container: '.js-content-container'
            },
            onRender: function () {
                this.$el.addClass(!this.isVisible ? 'card__i hidden' : 'card__i');
                this.$el.attr('data-editors', this.model.get('dataId'));
                var data = this.model.get('dataValue');
                if (data && data[0]) {
                    this.ui.container.html(data[0].dataValue);
                }
            },
            template: tpl
        });
    });
