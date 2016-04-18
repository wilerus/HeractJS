/**
 * Developer: Daniil Korolev
 * Date: 27/04/2015
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

define(['form/App', 'form/templates/widgets/radioSelector.html'],
    function (App, template) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                this.selectValue();
                this.isVisible = this.model.get('isVisible');
                this.render();
            },

            template: Handlebars.compile(template),

            selectValue: function () {
                var instances = this.model.get('instances');
                if (instances && instances[0] && instances[0].instanceId) {
                    var selectedId = instances[0].instanceId;
                    var variants = this.model.get('variants');

                    _.each(variants, function (item) {
                        if (item.id === selectedId) {
                            item.selected = true;
                        }
                    });
                }
            },

            onRender: function () {
                this.$el.addClass(!this.isVisible ? 'card__i hidden' : 'card__i');
                this.isHasValidationError && this.$el.addClass(this.invalidClass);
                this.$el.attr('data-editors', this.model.get('dataId'));
            },

            mixinTemplateHelpers: function (data) {
                if (data.orientation == 'Vertical') {
                    data.isVertical = true;
                }
                if (data.access === 'Hidden') {
                    data.isDisabled = true;
                }
                return data;
            }
        });
    });
