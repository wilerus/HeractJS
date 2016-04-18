/**
 * Developer: Stepan Burguchev
 * Date: 10/13/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, Backbone, _ */

define(['form/App', 'form/templates/editors/multiValueProxyEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        var defaultOptions = {
            changeMode: 'blur'
        };

        var ValueCollection = Backbone.Collection.extend({
            addEmptyModel: function (modelProperties) {
                if (modelProperties.type == 'Account' || modelProperties.type == 'Instance' || modelProperties.type == 'Selector') {
                    modelProperties.data = [{
                        instanceName: null,
                        instanceId: null
                    }];
                } else {
                    modelProperties.data = [{
                        dataValue: null
                    }];
                }
                modelProperties.isEmpty = true;
                this.push({
                    value: modelProperties
                });
            }
        });

        //composite view for collection
        var CompositeView = Marionette.CompositeView.extend({
            initialize: function (opts) {
                this.childView = opts.childView;
                this.collection = new Backbone.Collection(this.model);
            },
            ui: {
                removeButton: '.js-mv-proxy-remove'
            },
            className: 'field',
            template: Handlebars.compile('<div class="btn-remove js-mv-proxy-remove hidden"></div>'),
            childEvents: {
                'change': function (child) {
                    this.trigger('change', child);
                },
                'emptyModelFocusLost': 'removeClicked'
            },

            onRender: function () {
                if (!this.model.get('value').isEmpty && this.model.get('value').access === 'Editable') {
                    this.ui.removeButton.removeClass('hidden');
                }
            },

            events: {
                'click .js-mv-proxy-remove': 'removeClicked'
            },
            removeClicked: function () {
                this.model.collection.remove(this.model);
            },
            childViewOptions: function () {
                return {key: 'value'};
            }
        });

        //collection view
        var MultiValueEditorView = Marionette.CollectionView.extend({
            initialize: function (opts) {
                this.value = opts.value;

                this.on('childview:change', function (child) {
                    this.trigger('change', child);
                }.bind(this));
            },
            childView: CompositeView,
            childViewOptions: function (model) {
                return {model: model, childView: this.value.childType};
            }
        });

        return EditorBaseView.extend({
            initialize: function (options) {
                _.extend(this.options, defaultOptions, _.pick(options || {}, _.keys(defaultOptions)));

                var value = this.getValue();
                this.dataCollection = this.prepareCollection(value);
                this.collectionView = new MultiValueEditorView({collection: this.dataCollection, value: value});

                this.listenTo(this.dataCollection, 'remove', this.removeFromCollection.bind(this));
                this.listenTo(this.collectionView, 'change', this.checkAddedValue.bind(this));
            },

            className: '',

            ui: {
                collectionContainer: '.js-value-collection',
                addButton: '.js-add-button'
            },

            events: {
                'click .js-add-button': 'addEmptyModel'
            },

            template: Handlebars.compile(template),

            mixinTemplateHelpers: function (data) {
                var attrs = this.value.attributes;
                if (this.value.access === 'Hidden' || this.value.access === 'Static' || this.value.access === 'Readonly' || attrs.Calculated || attrs.Readonly) {
                    data.isEditable = false;
                    data.prompt = this.value.access === 'Hidden' ? this.placeholders.disabled : this.placeholders.readonly;
                } else {
                    data.isEditable = true;
                }
                data.isEmpty = this.dataCollection.length < 1;
                return data;
            },

            setValue: function (value, silent) {
                this.__value(value.data, silent);
                this.initialData = value;
            },

            onRender: function () {
                this.collectionView.render();
                this.ui.collectionContainer.html(this.collectionView.$el);
            },

            __value: function (value, silent) {
                if (this.value.data === value) {
                    return;
                }
                this.value.data = value;
                this.updateUIValue();

                !silent && this.__triggerChange();
            },

            updateUIValue: function () {
                var newModels = this.prepareCollection(this.value).models;

                if (newModels.length > 0) {
                    this.$el.find('.js-placeholder').hide();
                } else {
                    this.$el.find('.js-placeholder').show();
                }

                this.dataCollection.reset(newModels);
            },

            prepareCollection: function (value) {
                var collection = [];
                if (value.data) {
                    if (value.type == 'Instance' || value.type == 'Account' || value.type == 'Selector') {
                        for (var i = 0; i < value.data.length; i++) {
                            collection.push({
                                value: {
                                    data: [value.data[i]],
                                    isMultivalue: true,
                                    generalModel: value.generalModel,
                                    access: value.access,
                                    type: value.type,
                                    valueQuery: value.valueQuery,
                                    dataId: value.dataId, //only for selector
                                    attributes: value.attributes
                                }
                            });
                        }
                    } else if (value.type == 'Date' || value.type == 'DateTime') {
                        for (var i = 0; i < value.data.length; i++) {
                            collection.push({
                                value: {
                                    data: [{dataValue: value.data[i].dataValue}],
                                    generalModel: value.generalModel,
                                    access: value.access,
                                    type: value.type,
                                    isMultivalue: true,
                                    dateFormat: value.dateFormat,
                                    attributes: value.attributes
                                }
                            });
                        }
                    } else {
                        for (var i = 0; i < value.data.length; i++) {
                            collection.push({
                                value: {
                                    data: [{dataValue: value.data[i].dataValue}],
                                    generalModel: value.generalModel,
                                    access: value.access,
                                    type: value.type,
                                    isMultivalue: true,
                                    attributes: value.attributes
                                }
                            });
                        }
                    }
                }

                var coll = new ValueCollection(collection);
                return coll;
            },

            checkAddedValue: function (child) {
                if (!this.initialData) {
                    return;
                }

                var childModel = child && child.model && child.model.get('value');
                if (childModel) {
                    var value = this.getDataValue(childModel.data[0]);
                    var isDuplicate = this.checkDuplicates(value);
                    this.removeIfDuplicate(childModel, isDuplicate);
                    if (!isDuplicate && value) {
                        child.ui.removeButton.removeClass('hidden');
                    }
                    if (isDuplicate) {
                        this.showDuplicateNotification();
                    }
                    this.setFilteredValue();
                }

                !isDuplicate && this.refreshForm();
            },

            getEditedData: function () {
                var editedData = {},
                    val = [];

                if (this.value.type === 'Selector' || this.value.type === 'Instance' || this.value.type === 'Account') {
                    for (var i = 0; i < this.value.data.length; i++) {
                        val.push(this.value.data[i].instanceId);
                    }
                } else {
                    for (var i = 0; i < this.value.data.length; i++) {
                        val.push(this.value.data[i].dataValue);
                    }
                }

                editedData[this.key] = val;
                return editedData;
            },

            getDataValue: function (model) {
                if (model.instanceId) {
                    return model.instanceId;
                }
                if (model.dataValue) {
                    return model.dataValue;
                }
                return null;
            },

            setFilteredValue: function () {
                var value = this.initialData,
                    data = [];

                for (var i = 0; i < this.dataCollection.length; i++) {
                    data.push(this.dataCollection.models[i].get('value').data[0]);
                }
                value.data = data;
                this.setValue(value, true);
            },

            removeIfDuplicate: function (childModel, isDuplicate) {
                if (!isDuplicate) {
                    childModel.isEmpty = false;
                    this.toggleAddButton('show');
                } else {
                    var dataCollectionL = this.dataCollection.length;
                    this.dataCollection.remove(this.dataCollection.at(dataCollectionL - 1), {isDuplicate: true});
                }
            },

            removeFromCollection: function (model, collection ,opts) {
                var data = [];
                for (var i = 0; i < this.dataCollection.length; i++) {
                    data.push(this.dataCollection.models[i].get('value').data[0]);
                }

                var value = this.value;
                value.data = data;
                this.setValue(value);
                this.toggleAddButton('show');

                !opts.isDuplicate && this.refreshForm();
            },

            addEmptyModel: function () {
                var properties = {};
                if (this.value.type == 'Date' || this.value.type == 'DateTime') {
                    properties.dateFormat = this.value.dateFormat;
                }
                properties = _.extend(properties, {
                    generalModel: this.value.generalModel,
                    access: this.value.access,
                    type: this.value.type,
                    valueQuery: this.value.valueQuery,
                    dataId: this.value.dataId,
                    isMultivalue: this.value.isMultivalue,
                    prompt: this.value.prompt,
                    attributes: this.value.attributes
                });
                this.dataCollection.addEmptyModel(properties);
                this.toggleAddButton('hide');
                this.setFocusOnLastChildView();
            },

            toggleAddButton: function (action) {
                if (action == 'hide') {
                    this.ui.addButton.addClass('hidden');
                } else {
                    this.ui.addButton.removeClass('hidden');
                }
            },

            setFocusOnLastChildView: function () {
                var editor = this.collectionView.children.findByIndex(this.collectionView.children.length - 1)
                    .children.findByIndex(0);

                editor.setDefaultValue && editor.setDefaultValue();
                editor.focus();
            },

            checkDuplicates: function (data) {
                var initDataArray = this.initialData.data;
                var initDataArrayL = this.initialData.data ? this.initialData.data.length : 0;
                if (initDataArrayL) {
                    for (var i = 0; i < initDataArrayL; i++) {
                        if (this.getDataValue(initDataArray[i]) == data) {
                            return true;
                        }
                    }
                }
                return false;
            },

            showDuplicateNotification: function () {
                App.NotificationsMediator.showWarning(App.Localizer.get('ELEGANCE.FORM.NOTIFICATIONS.DUPLICATEMULTI'));
            }
        });
    });
