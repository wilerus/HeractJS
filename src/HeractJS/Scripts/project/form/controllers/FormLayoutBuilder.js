/**
 * Developer: Roman Shumskiy
 * Date: 26/09/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, $ */

define(['form/App', './DataProxyManager'],
    function (App, DataProxyManager) {
        'use strict';
        return Backbone.Marionette.Controller.extend({
            initialize: function () {
                this.dataProxyManager = DataProxyManager;
                this.initializeEventHandling();
                this.currentAppName = 'Elegance_default';
                this.errorTabs = [];
                this.tabFields = {};
            },

            initializeEventHandling: function () {
                this.listenTo(this.dataProxyManager.cfgModel, 'formLayoutLoaded', this.createAndSendLayout, this);
                this.listenTo(App.FormMediator, 'showCustomTab', this.createCustomTabLayout, this);
                this.listenTo(App.FormMediator, 'backToFormFromTab', this.createAndSendLayout, this);
                this.listenTo(App.FormMediator, 'backToEditMainForm', this.backToEditMainForm, this);
                this.listenTo(App.FormMediator, 'unSetValidationError', this.unSetValidationError, this);
            },

            applyFormData: function (layout, items) {
                this.fieldModels = [];
                this.findTabWithErrorRequiredFields();
                this.buildFormModels(layout, items);
            },

            isTabContainsRequiredFields: function (layout) {
                if (!layout.children || layout.children.length < 1 || this.mandatoryFields.length < 1) {
                    return;
                }

                var childL = layout.children.length,
                    i = 0,
                    isFound = false;

                for (; i < childL; i++) {
                    if (layout.children[i].children && layout.children[i].children.length) {
                        isFound = this.isTabContainsRequiredFields(layout.children[i]);
                        if (isFound) {
                            break;
                        }
                        continue;
                    }

                    if (!layout.children[i].field || !layout.children[i].field.datasource) {
                        continue;
                    }

                    var id = layout.children[i].field.datasource.id;
                    isFound = _.find(this.mandatoryFields, function (i) {
                        return i === id;
                    });

                    if (isFound){
                        break;
                    }
                }

                return isFound;
            },

            findTabWithErrorRequiredFields: function () {
                var tabFields = this.tabFields,
                    errorTabs = [];

                _.each(this.errorRequiredFields, function (field) {
                    for (var tabId in tabFields) {
                        var found = _.find(tabFields[tabId], function (i) {
                            return i === field.propertyId;
                        });

                        if (found) {
                            errorTabs.push(tabId);
                            break;
                        }
                    }
                }.bind(this));

                this.errorTabs = errorTabs;
            },

            isTabContainsValidationError: function (layout) {
                var found = _.find(this.errorTabs, function (i) {
                    return i === layout.id;
                });
                return found ? true : false;
            },

            hasTabChildren: function (layout) {
                var hasChildren = layout.children ? layout.children.length : false;
                return hasChildren ? true : false;
            },

            populateTabFields: function (tabLayout, tabId) {
                if (!this.tabFields[tabId]) {
                    this.tabFields[tabId] = [];
                }

                if (!tabLayout.children || tabLayout.children.length === 0){
                    return;
                }

                _.each(tabLayout.children, function (item) {
                    if (item.field && item.field.datasource && item.field.datasource.id) {
                        this.tabFields[tabId].push(item.field.datasource.id);
                    } else {
                        if (item.children && item.children.length) {
                            this.populateTabFields(item, tabId);
                        }
                    }
                }.bind(this));
            },

            resetTabFields: function () {
                this.tabFields = {};
            },

            isHasRequiredError: function (fieldId) {
                return _.find(this.errorRequiredFields, function (i) {
                    return i.propertyId === fieldId;
                });
            },

            buildFormModels: function (layout, items) {
                var WidgetModel = Backbone.Model.extend({});
                for (var i = 0; i < layout.cfg.length; i++) {
                    for (var k = 0; k < items.length; k++) {
                        if (layout.cfg[i].field && layout.cfg[i].field.datasource && layout.cfg[i].field.datasource.id == items[k].id) {
                            layout.cfg[i].widgetData = items[k];
                            break;
                        } else if (layout.cfg[i].type === 'Panel' || (layout.cfg[i].type === 'Comments' && items[k].id === 'cmw.ui.commentsObjectId')) {
                            layout.cfg[i].widgetData = items[k];
                        }
                    }

                    var model = new WidgetModel();
                    if (App.currentParameters.isRequestor && layout.cfg[i].type === 'Subtasks') {
                        model.set({ 'isVisible': false });
                    } else {
                        model.set({ 'isVisible': layout.cfg[i].isVisible });
                    }
                    if (layout.cfg[i].type === 'Panel') {
                        this.processPanel(layout.cfg[i], model);
                    } else if (layout.cfg[i].field && layout.cfg[i].field.datasource) {
                        model.set('isHasValidationError', this.isHasRequiredError(layout.cfg[i].field.datasource.id));
                    }

                    if (layout.cfg[i].type !== 'StaticContent') {
                        model.set({
                            id: layout.cfg[i].id,
                            widgetType: layout.cfg[i].type,
                            promptText: layout.cfg[i].field ? layout.cfg[i].field.prompt : undefined
                        });
                    }

                    if (layout.cfg[i].field && layout.cfg[i].field.datasource) {
                        var dataType = layout.cfg[i].field.datasource.dataType;
                        model.set({
                            dataId: layout.cfg[i].field.datasource.id,
                            multiValue: layout.cfg[i].field.datasource.isMultivalue,
                            dataType: layout.cfg[i].field.datasource.dataType
                        });

                        if (dataType === 'Boolean') {
                            model.set({widgetType: dataType});
                        }
                    }

                    if (layout.cfg[i].field && layout.cfg[i].field.label) {
                        if (layout.cfg[i].field.datasource && layout.cfg[i].field.datasource.id == 'description') {
                            var parentNode = this.findTab(layout.cfg[i].parent, this.dataProxyManager.cfgModel.get('root'));
                            if (parentNode && parentNode.field) {
                                layout.cfg[i].field.label.text = parentNode.field.label.text;
                            }
                        }
                        model.set({
                            labelHidden: layout.cfg[i].field.label.hidden,
                            labelText: App.Localizer.parseLabelText(layout.cfg[i].field.label.text),
                            labelAlign: layout.cfg[i].field.label.align
                        });
                    }

                    var itemType = layout.cfg[i].type;
                    if (itemType == 'Number' || itemType == 'SingleLineText' || itemType == 'HtmlText' ||
                        itemType == 'MultiLineText' || itemType == 'DateTime' || itemType == 'Duration' || itemType == 'Date') {

                        if (layout.cfg[i].type == 'Date' || layout.cfg[i].type == 'DateTime') {
                            var cfgFormat = layout.cfg[i].field.datasource.dataFormat,
                                format = cfgFormat != 'Undefined' ? cfgFormat : '';
                            model.set({
                                format: format
                            });
                        }

                        var values = layout.cfg[i].widgetData.values || [];

                        var dataValues = [];
                        for (var q = 0; q < values.length; q++) {
                            dataValues.push({
                                dataValue: values[q]
                            });
                        }
                        model.set({
                            dataValue: dataValues.length ? dataValues : null,
                            access: layout.cfg[i].widgetData.accessType
                        });
                    } else if (layout.cfg[i].type === 'StaticContent') {
                        model.set({
                            id: layout.cfg[i].id,
                            dataId: layout.cfg[i].id,
                            widgetType: layout.cfg[i].type,
                            dataValue: [{dataValue: App.Localizer.parseLabelText(layout.cfg[i].field.content)}]
                        });
                    } else if (layout.cfg[i].type == 'Attachment') {
                        var attachments = layout.cfg[i].widgetData.attachments || [];
                        var attachmentsValue = [];
                        for (var w = 0; w < attachments.length; w++) {
                            attachmentsValue.push(attachments[w]);
                        }
                        model.set({
                            dataValue: attachmentsValue.length ? attachmentsValue : null,
                            access: layout.cfg[i].widgetData.accessType
                        });
                    } else if (layout.cfg[i].type !== 'Account' && layout.cfg[i].type !== 'Instance' && layout.cfg[i].type !== 'Selector' &&
                        layout.cfg[i].type !== 'Comments' && layout.cfg[i].type !== 'Subtasks' && layout.cfg[i].type !== 'ProcessView' &&
                        layout.cfg[i].type !== 'History' && layout.cfg[i].type !== 'Timespent' && layout.cfg[i].type !== 'RadioSelector' && layout.cfg[i].type !== 'MultiSelect') {
                        if (layout.cfg[i].widgetData && layout.cfg[i].widgetData.values && layout.cfg[i].widgetData.values[0] !== undefined && layout.cfg[i].widgetData.values[0] !== null) {
                            model.set({
                                dataValue: layout.cfg[i].widgetData.values[0],
                                access: layout.cfg[i].widgetData.accessType
                            });
                        } else {
                            model.set({
                                dataValue: null,
                                access: layout.cfg[i].widgetData.accessType
                            });
                        }
                    } else if (layout.cfg[i].type === 'Account' || layout.cfg[i].type === 'Instance'
                           || layout.cfg[i].type === 'Selector' || layout.cfg[i].type === 'RadioSelector' || layout.cfg[i].type === 'MultiSelect') {
                        if (layout.cfg[i].widgetData) {
                            var instanceValues = [];
                            var instances = layout.cfg[i].widgetData.instances || [];
                            for (var cnt = 0; cnt < instances.length; cnt++) {
                                instanceValues.push({
                                    instanceName: instances[cnt].name,
                                    instanceId: instances[cnt].id
                                });
                            }
                            model.set({
                                instances: instanceValues.length ? instanceValues : null,
                                id: layout.cfg[i].id,
                                fieldName: layout.cfg[i].widgetData.id,
                                access: layout.cfg[i].widgetData.accessType
                            });
                            if (layout.cfg[i].widgetData.valueQuery) {
                                model.set('valueQuery', layout.cfg[i].widgetData.valueQuery);
                            }

                            if (layout.cfg[i].field.datasource.dataType === 'Account') {
                                model.set({widgetType:  layout.cfg[i].field.datasource.dataType});
                            }

                            if (layout.cfg[i].type === 'Account' && layout.cfg[i].field.datasource.id === 'assignee' &&
                                layout.id === 'TaskForm.js') { //hack for task's
                                model.set({access: 'Editable'});
                            }

                            if (layout.cfg[i].type === 'RadioSelector' || layout.cfg[i].type === 'MultiSelect') {
                                var attrs = layout.cfg[i].widgetData.attributes;
                                if ($.inArray('Calculated', attrs) > -1) {
                                    layout.cfg[i].type = 'Selector';
                                    model.set({
                                        widgetType: 'Selector'
                                    });
                                } else {
                                    var variants = layout.cfg[i].field.datasource.variants;
                                    var componentId = layout.cfg[i].id;
                                    variants = _.each(variants, function (it) {
                                        it.componentId = componentId;
                                    });
                                    model.set({variants: variants});
                                }
                                var orientation = layout.cfg[i].layout.orientation || 'Horizontal';
                                model.set({orientation: orientation});
                            }
                        }

                    } else if (layout.cfg[i].type === 'Comments') {
                        model.set({
                            dataValue: this.dataProxyManager.commentsCollection,
                            access: null
                        });
                    } else if (layout.cfg[i].type === 'Attachment' || layout.cfg[i].type === 'Subtasks' ||
                        layout.cfg[i].type === 'ProcessView' || layout.cfg[i].type === 'History' || layout.cfg[i].type === 'Timespent') {
                        model.set({
                            dataValue: null,
                            access: null
                        });
                    }

                    var widgetData = layout.cfg[i].widgetData;
                    model.set({attributes: {}});

                    if (widgetData && widgetData.attributes) {
                        _.each(widgetData.attributes, function (attr) {
                            model.attributes.attributes[attr] = true;
                        });
                    }

                    this.fieldModels.push(model);
                }
            },

            processPanel: function (layout, model) {
                var tabId = layout.id;
                this.populateTabFields(layout, tabId);
                model.set({isContainRequiredFields: this.isTabContainsRequiredFields(layout)});
                model.set({isContainValidationError: this.isTabContainsValidationError(layout)});
                model.set({hasChildren: this.hasTabChildren(layout)});
            },

            buildFormLayout: function (form) {
                this.currentAppName = form.objectPrototypeName;
                //disable caching for debugging
                var layout = null; //window.localStorage.getItem('cmw_elegance_form_'+form.form);
                if (layout) {
                    layout = JSON.parse(layout);
                    App.FormMediator.sendFormLayout(layout);
                } else {
                    this.dataProxyManager.getCfg(form.formId);
                }
            },

            parseChildren: function (layout, formComponent, isParentVisible, doNotFall) {
                formComponent.isVisible = this.isComponentVisible(formComponent, isParentVisible);
                if (formComponent.type !== 'Panel' && formComponent.type !== 'Undefined' &&
                    formComponent.type !== 'TabContainer') {
                    layout.cfg.push($.extend(true, {}, formComponent));
                    return layout;
                }

                if (!doNotFall && formComponent.type === 'Panel' && formComponent.children) {
                    for (var i = 0; i < formComponent.children.length; i++) {
                        layout = this.parseChildren(layout, formComponent.children[i], formComponent.isVisible);
                    }
                } else if (formComponent.type === 'TabContainer' && formComponent.children) {
                    _.each(formComponent.children, function (child) {
                        child.isVisible = this.isComponentVisible(child, formComponent.isVisible);
                        layout.cfg.push($.extend(true, {}, child));
                    }, this);
                }

                return layout;
            },

            isComponentVisible: function (formComponent, isParentVisible) {
                var isVisible = true;

                if (formComponent.id === 'descriptionPanel') {
                    formComponent = formComponent.children[0];
                }

                if (isParentVisible === false) {
                    isVisible = false;
                } else {
                    var cmpVisibility = this.componentVisibility[formComponent.id];
                    isVisible = cmpVisibility === undefined ? true : cmpVisibility;
                }

                return isVisible;
            },

            findTab: function (id, root) {
                var childrenL = root.children.length;
                for (var i = 0; i < childrenL; i++) {
                    var children = root.children[i];
                    if (children.id === id) {
                        return children;
                    }

                    if (children.children && children.children.length) {
                        var tab = this.findTab(id, children);
                        if (tab) {
                            return tab;
                        }
                    }
                }
            },

            createCustomTabLayout: function (opts) {
                var root = this.dataProxyManager.cfgModel.get('root'),
                    tab = this.findTab(opts.id, root);

                this.createAndSendLayout({root: tab}, true, opts.isEdit, opts.isCreate);
            },

            backToEditMainForm: function () {
                this.createAndSendLayout(false, false, true);
            },

            getFormLayout: function (config, isCustomTab, isEdit, isCreate) {
                var cfg = config || this.dataProxyManager.cfgModel.attributes;
                var layout = {
                    id: '',
                    appName: this.currentAppName,
                    template: '',
                    widgets: [],
                    cfg: [],
                    isCustomTab: isCustomTab,
                    isEdit: isEdit,
                    isCreate: isCreate
                };
                layout.id = (config && config.root.id) || this.dataProxyManager.cfgModel.get('id');

                if (cfg.root && cfg.root.children) {
                    var isRootVisible = this.isComponentVisible(cfg.root, true);
                    layout = this.parseChildren(layout, cfg.root, isRootVisible);
                }

                return layout;
            },

            createAndSendLayout: function (config, isCustomTab, isEdit, isCreate) {
                var layout = this.getFormLayout(config, isCustomTab, isEdit, isCreate);
                App.FormMediator.sendFormLayout(layout);
            },

            setMandatoryFields: function (mandatoryFields) {
                this.mandatoryFields = mandatoryFields;
            },

            unSetValidationError: function (id) {
                if (this.errorRequiredFields && this.errorRequiredFields.length) {
                    this.errorRequiredFields = _.without(this.errorRequiredFields, _.findWhere(this.errorRequiredFields, {propertyId: id}));
                }
            }
        });
    });
