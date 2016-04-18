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

define(['form/App', 'form/templates/widgets/multiSelect.html'],
    function (App, template) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                this.selectValues();
                this.isVisible = this.model.get('isVisible');
                this.render();
            },

            template: Handlebars.compile(template),

            selectValues: function () {
                var instances = this.model.get('instances');
                if (instances) {
                    var selectedIds = _.map(this.model.get('instances'), function (it) {
                        return it.instanceId;
                    });
                    var variants = this.model.get('variants');

                    _.each(variants, function (item) {
                        if (_.contains(selectedIds, item.id)) {
                            item.selected = true;
                        }
                    });
                }
            },

            mixinTemplateHelpers: function (data) {
                if (data.access === 'Hidden') {
                    data.isDisabled = true;
                }
                if (data.orientation == 'Vertical') {
                    data.isVertical = true;
                }

                return data;
            },

            onRender: function () {
                this.$el.addClass(!this.isVisible ? 'card__i hidden' : 'card__i');
                this.isHasValidationError && this.$el.addClass(this.invalidClass);
                this.$el.attr('data-editors', this.model.get('dataId'));
            }
        });
    });
