/**
 * Developer: Roman Shumskiy
 * Date: 31/12/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/widgets/attachments.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));
            },

            className: '',

            template: Handlebars.compile(template, {noEscape: true}),

            events: {
                'click': '__clicked'
            },

            ui: {
                'input': ''
            },

            __change: function () {
                this.__value(this.ui.input.val(), false);
            },

            setValue: function (value, silent) {
                var data;
                if (value) {
                    if (value.data && value.data.length){
                        data = value.data[0];
                    }
                    else {
                        data = [{
                            instanceId: null,
                            instanceName: null
                        }];
                    }
                    this.__value(data, true, silent);
                }

                if (this.value.data && this.value.data[0] && this.value.data[0].instanceId && !this.value.isMultivalue) {
                    this.ui.removeButton.removeClass('hidden');
                }
            },

            onRender: function () {
                var value = this.getValue();
                var length = value.generalModel.get('dataValue') ? value.generalModel.get('dataValue').length : false;
                if(length){
                    this.$el.children().attr('data-num', length);
                } else {
                    this.$el.children().attr('data-num', '0');
                }
            },

            __value: function (value, updateUi, silent) {
                if (this.value === value) {
                    return;
                }
                if (value.instanceId || value.instanceId === null) {
                    this.value.data = [value];
                }
                if (updateUi) {
                    this.ui.input.val(value.instanceName);
                }
                !silent && this.__triggerChange();
            },

            __clicked: function () {
                if(App.StateManager.state.isCreate){
                    App.FormMediator.updateItem(false, {
                        type: 'attachments',
                        mode: 'create'
                    });
                } else {
                    App.FormMediator.updateItem(false, {
                        type: 'attachments',
                        mode: 'edit'
                    });
                }
            }
        });
    });
