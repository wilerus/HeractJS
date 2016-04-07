/**
 * Developer: Roman Shumskiy
 * Date: 13/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', '../../templates/editors/listOfValuesEditor.html', './BaseEditorView', '../../views/widgets/SearchModalView',
        '../../models/editors/listOfValues/ListOfValueModel'],
    function (App, template, EditorBaseView, SearchModalView, ListOfValuesModel) {
        'use strict';

        var changeMode = {
            blur: 'blur',
            keydown: 'keydown'
        };

        var defaultOptions = {
            changeMode: 'blur'
        };

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));

                this.listModel = new ListOfValuesModel();
            },

            focusElement: '.js-input',

            ui: {
                input: '.js-input',
                removeButton: '.js-remove'
            },

            className: 'field',

            template: Handlebars.compile(template, {noEscape: true}),

            mixinTemplateHelpers: function (data) {
                data = this.setPlaceholder(data);
                return data;
            },

            events: {
                'keyup @ui.input': '__keyup',
                'change @ui.input': '__change',
                'focus @ui.input': '__clicked',
                'click @ui.removeButton': '__clearData',
                'tap @ui.removeButton': '__clearData'
            },

            __keyup: function () {
                if (this.options.changeMode === changeMode.keydown) {
                    this.__value(this.ui.input.val(), false);
                }
            },

            __clearData: function () {
                this.__value({
                    instanceId: null,
                    instanceName: null
                }, true);
                this.ui.removeButton.addClass('hidden');
            },

            __change: function () {
                this.__value(this.ui.input.val(), false);
            },

            setValue: function (value, silent) {
                var data;
                if (value) {
                    if (value.data && value.data.length) {
                        data = value.data[0];
                    } else {
                        data = {
                            instanceId: null,
                            instanceName: null
                        };
                    }
                    this.__value(data, true, silent);
                }
                this.showRemoveBtn();
            },

            showRemoveBtn: function () {
                if (this.value.data && this.value.data[0] && this.value.data[0].instanceId && !this.value.isMultivalue && this.isEditable) {
                    this.ui.removeButton.removeClass('hidden');
                }
            },

            onRender: function () {
                var value = this.getValue();
                this.ui.input.val(value || '');
            },

            __value: function (value, updateUi, silent) {
                if (this.value === value) {
                    return;
                }
                if (value.instanceId || value.instanceId === null) {
                    this.value.data = [value];
                }

                updateUi && this.updateUIValue(value.instanceName);

                !silent && this.__triggerChange();
            },

            updateUIValue: function (value) {
                if (!value) {
                    var data = {};
                    this.setPlaceholder(data);
                    this.ui.input.val(data.prompt);
                } else {
                    this.ui.input.val(value);
                }
                this.resolvePlaceholderClass();
            },

            resolvePlaceholderClass: function () {
                if (this.value.data && this.value.data[0] && this.value.data[0].instanceId) {
                    this.ui.input.removeClass('placeholder');
                } else {
                    this.ui.input.addClass('placeholder');
                }
            },

            __clicked: function () {
                this.ui.input.blur();

                if (this.getAccess() !== 'Editable') {
                    return;
                }

                this.listModel.dataId = this.getDataId();

                this.instanceEditView = new SearchModalView({
                    listModel: this.listModel,
                    type: 'listOfValues'
                });

                this.listenTo(this.instanceEditView, 'triggerBack', this.backFromView.bind(this));
                this.listenTo(this.instanceEditView, 'itemSelected', this.getSelected.bind(this));
                this.listenTo(this.listModel, 'dataLoaded', function () {
                    App.FormMediator.showCustomPopupView(this.instanceEditView);
                });

                this.listModel.getData();
            },
            backFromView: function () {
                if (this.value.isEmpty) {
                    this.trigger('emptyModelFocusLost');
                }
                App.FormMediator.hideCustomPopupView('hideCustomPopupView');
            },
            getSelected: function (selectedData) {
                this.__value({
                    instanceName: selectedData.name,
                    instanceId: selectedData.id
                }, true);
                this.showRemoveBtn();
                App.FormMediator.hideCustomPopupView('hideCustomPopupView');
            },
            getAccess: function () {
                return this.value.access;
            },
            getDataId: function () {
                return this.value.dataId;
            }
        });
    });
