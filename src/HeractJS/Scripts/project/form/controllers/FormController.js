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

/* global define, $, _ */

define(['../App', './FormLayoutBuilder', '../views/FormLayoutView',
        '../views/AccountView',
        '../views/editors/AttachmentEditorView',
        '../views/editors/TextEditorView',
        '../views/editors/DateTimeEditorView',
        '../views/editors/DateTimeMobielEditorView',
        '../views/editors/NumberEditorView',
        '../views/editors/DurationEditorView',
        '../views/editors/TextareaEditorView',
        '../views/editors/AccountEditorView',
        '../views/editors/InstanceEditorView',
        '../views/editors/MultiValueProxyEditorView',
        '../views/widgets/CommentEditView',
        '../views/widgets/TimespentSaveDialog',
        '../views/editors/ListOfValuesEditorView',
        '../views/editors/StaticContentEditorView',
        '../views/editors/BooleanEditorView',
        '../views/editors/RadioSelectorEditorView',
        '../views/editors/MultiSelectEditorView'],
    function (App, FormLayoutBuilder, FormLayoutView, AccountView, AttachmentView,
              TextEditorView, DateTimeEditorView, DateTimeMobielEditorView, NumberEditorView, DurationEditorView, TextareaEditorView, AccountEditorView,
              InstanceEditorView, MultiValueProxyEditorView, CommentEditView, TimespentSaveDialog, ListOfValuesEditorView, StaticContentEditorView, BooleanEditorView,
              RadioSelectorEditorView, MultiSelectEditorView) {
        'use strict';
        return Backbone.Marionette.Controller.extend({
            initialize: function () {
                this.formLayoutBuilder = new FormLayoutBuilder();
                this.formModel = new Backbone.Model();
                this.formViewOpts = {schema: {}, template: {}};
                this.tabsCollection = new Backbone.Collection();
                this.reInitLayoutView();
                this.temporaryAttachments = [];
                this.dataForCloning = [];
                this.formEditedData = {};
                this.initializeEventHandling();

                this.on('destroy', this.onDestroy, this);
            },

            initializeEventHandling: function () {

                this.listenTo(App.FormMediator, 'getFormLayout', this.onGetFormLayout, this);

                this.listenTo(App.FormMediator, 'showAccount', this.showAccount.bind(this));

                this.listenTo(App.FormMediator, 'showSingleAttachment', this.showSingleAttachment.bind(this));

                this.listenTo(App.FormMediator, 'showComments', this.showComments.bind(this));

                this.listenTo(App.FormMediator, 'showCommentEdit', this.showCommentEdit.bind(this));

                this.listenTo(App.FormMediator, 'showEmptyForm', this.showEmptyForm.bind(this));

                this.listenTo(App.FormMediator, 'showSingleTimespent', this.showSingleTimespent.bind(this));

                this.listenTo(App.FormMediator, 'showTimespentSaveDialog', this.showTimespentSaveDialog.bind(this));

                this.listenTo(App.FormMediator, 'showNewTimespent', this.showNewTimeSpent.bind(this));

                this.listenTo(App.FormMediator, 'showEditForm', this.showEditForm.bind(this));

                this.listenTo(App.FormMediator, 'reDrawCurrentItem', this.reDrawCurrentItem.bind(this));

                this.listenTo(App.FormMediator, 'cleanEditModel', this.cleanPrevModel, this);

                this.listenTo(App.FormMediator, 'highlightRequiredFields', this.highlightErrorRequiredFields.bind(this));

                this.listenTo(App.FormMediator, 'saveTemporaryAttachment', this.saveTemporaryAttachment.bind(this));

                this.listenTo(App.FormMediator, 'formUpdated', this.updateForm.bind(this));

                this.listenTo(App.FormMediator, 'formDataChanged', this.onFormDataChanged.bind(this));

                this.listenTo(App.FormMediator, 'saveModelAndStartCloning', this.saveModelForCloning.bind(this));
            },

            findTabWithErrorRequiredFields: function () {
                this.formLayoutBuilder.findTabWithErrorRequiredFields();
            },

            highlightErrorRequiredFields: function (errData) {
                this.setErrorRequiredFields(errData);
                $('.field-invalid').removeClass('field-invalid');

                _.each(this.formLayoutBuilder.errorRequiredFields, function (field) {
                    $('[data-editors="' + field.propertyId + '"]').addClass('field-invalid');
                }.bind(this));

                this.findTabWithErrorRequiredFields();
                this.highlightTabsWithErrorRequiredFields();
            },

            highlightTabsWithErrorRequiredFields: function () {
                _.each(this.formLayoutBuilder.errorTabs, function (tabId) {
                    $('[component-id="' + tabId + '"]').addClass('tab-invalid');
                });
            },

            setErrorRequiredFields: function (errData) {
                this.formLayoutBuilder.errorRequiredFields = errData.Required;
            },

            onDestroy: function () {
                this.formLayoutBuilder.destroy();
            },

            showTimespentSaveDialog: function (opts) {
                var timespentSaveDialog = new TimespentSaveDialog(opts);
                App.FormMediator.showCustomPopupView(timespentSaveDialog);
            },

            reInitLayoutView: function () {
                this.formLayoutView = new FormLayoutView({
                    formModel: this.formModel,
                    formViewOpts: this.formViewOpts,
                    tabsCollection: this.tabsCollection
                });
            },

            showSingleTimespent: function (id) {
                if (!this.timespentModel) {
                    App.FormMediator.trigger('showTimespent');
                } else {
                    var model = this.timespentModel.recordCollection.findWhere({id: id});
                    this.formLayoutView.drawSingleTimespent(model);
                }
            },

            showNewTimeSpent: function () {
                this.formLayoutView.drawNewTimespent(this.timespentModel, this.editEnabled);
            },

            showSubtasks: function () {
                this.formLayoutView.drawSubtasks(this.subtasksCollection);
            },

            setHistoryCollection: function (historyCollection) {
                this.historyCollection = historyCollection;
            },

            showEditForm: function (opts) {
                this.formLayoutView.showEditForm(opts.layout, opts.isCustomTab, opts.id);
            },

            showCreateForm: function (opts) {
                this.formLayoutView.showCreateForm(opts.layout, opts.isCustomTab, opts.id);
            },

            setFormId: function (id) {
                this.formId = id;
            },

            setTimespentModel: function (timespentModel) {
                this.timespentModel = timespentModel;
            },

            setCommentsCollection: function (commentsCollection) {
                this.commentsCollection = commentsCollection;
            },

            setSubtasksCollection: function (subtasksCollection) {
                this.subtasksCollection = subtasksCollection;
            },

            setEditEnabled: function (data) {
                var editAction = _.findWhere(data.actions, {action: 'Edit'});
                this.editEnabled = false;

                if (editAction && editAction.enabled || App.StateManager.state.isCreate) {
                    this.editEnabled = true;
                }
            },

            setFormData: function (data) {
                this.formPrototype = data.objectPrototype || data.prototype;
                this.formData = data.data;
                this.setVisibilityData(data.visibility);
                data.actions = this.extendActions(data);
                this.setEditEnabled(data);

                this.formProps = {
                    formActions: data.actions,
                    resolutions: data.resolutions
                };
                this.setMandatoryFields(data);
            },

            setVisibilityData: function (data) {
                var self = this;
                this.formLayoutBuilder.componentVisibility = {};
                _.each(data, function (vis) {
                    self.formLayoutBuilder.componentVisibility[vis.id] = vis.isVisible;
                });
            },

            setMandatoryFields: function (data) {
                this.formProps.mandatoryFields = [];

                var restrictionsData = _.find(data.data, function (i) {
                    return i.id === 'cmw.workflow.currentWorkflowStepRestrictions';
                });

                if (restrictionsData && restrictionsData.values) {
                    var i, valuesL = restrictionsData.values.length;
                    for (i = 0; i < valuesL; i++) {
                        var outArr = restrictionsData.values[i].match(/^\s*EMPTY\(\$(.*)\)\s*$/);
                        if (outArr && outArr.length == 2 && outArr[1]) {
                            this.formProps.mandatoryFields.push(outArr[1]);
                        }
                    }
                }

                this.formLayoutBuilder.setMandatoryFields(this.formProps.mandatoryFields);
            },

            showForm: function (data) {
                this.formLayoutBuilder.buildFormLayout(data);
            },

            showAccount: function (account) {
                this.reInitLayoutView();
                this.trigger('fillFormRegion', this.formLayoutView);
                this.formLayoutView.drawAccount(account);
            },

            getEmptyForm: function () {
                this.currentState = 'view';
                this.reInitLayoutView();
                return this.formLayoutView;
            },

            showEmptyForm: function () {
                this.reInitLayoutView();
                this.fillFormRegion();
                this.formLayoutView.showEmptyView();
            },

            fillFormRegion: function () {
                this.getRootController().fillFormRegion(this.formLayoutView);
            },

            getRootController: function () {
                if (!this.rootCtrl) {
                    this.rootCtrl = App.appRouter._getController().rootController;
                }

                return this.rootCtrl;
            },

            showSingleAttachment: function (attachmentModel) {
                this.reInitLayoutView();
                this.trigger('fillFormRegion', this.formLayoutView);
                this.formLayoutView.drawSingleAttachment(attachmentModel);
            },

            showComments: function () {
                this.formLayoutView.drawComments(this.commentsCollection, this.editEnabled);
            },

            showHistory: function () {
                this.formLayoutView.drawHistory(this.historyCollection);
            },

            showTimespent: function () {
                this.formLayoutView.drawTimespent(this.timespentModel, this.editEnabled);
            },

            showWorkflow: function (wfModel) {
                var titleObject = this.formModel.get("title");
                var title = titleObject && titleObject.data && titleObject.data[0] && titleObject.data[0].dataValue;
                if (title) {
                    wfModel.set('itemTitle', title);
                }
                this.formLayoutView.showWorkflow(wfModel);
            },

            showCommentEdit: function (opts) {
                var commentEditView = new CommentEditView({model: opts.model, mode: opts.mode});
                App.FormMediator.showCustomPopupView(commentEditView);
            },

            onGetFormLayout: function (layout) {
                this.layout = layout;

                var isEditOrCreate = this.currentState == 'create' || layout.isEdit || (this.displayField && this.displayField.isEdit);
                this.buildFormModels(layout, isEditOrCreate);

                this.formLayoutView.isDestroyed && this.reInitLayoutView(layout.isCustomTab);
                this.trigger('fillFormRegion', this.formLayoutView);

                if (this.currentState == 'create') {
                    this.formLayoutView.showCreateForm(layout, layout.isCustomTab, layout.id);
                } else if (layout.isEdit) {
                    this.formLayoutView.showEditForm(layout, layout.isCustomTab, layout.id);
                } else {
                    if (this.displayField) {
                        this.fieldNavigation(layout, layout.isCustomTab, layout.id);
                    } else {
                        this.formLayoutView.reDraw(layout, this.formLayoutBuilder.fieldModels, this.formProps);
                    }
                }
            },

            buildFormModels: function (layout, isEditOrCreate) {
                this.formLayoutBuilder.applyFormData(layout, this.formData);
                this.buildTemporaryFormModel(this.formLayoutBuilder.fieldModels, layout.isCustomTab, layout.id, isEditOrCreate);
            },

            cleanPrevModel: function () {
                this.formLayoutBuilder.errorRequiredFields = [];
                this.formLayoutBuilder.errorTabs = [];
                this.temporaryAttachments = [];
                this.formEditedData = {};
            },

            reDrawCurrentItem: function () {
                this.formLayoutView.reDraw();
            },

            buildTemporaryTabCollection: function (item) {
                this.tabsCollection.add(item);
            },

            buildTemporaryFormModel: function (models, isCustomTab, tabId, isEditOrCreate) {
                var schema = this.buildEditSchemaAndModel(models);
                this.formViewOpts = {
                    schema: schema
                };

                this.formLayoutView.formSchema = schema;
            },

            getWidgetByType: function (itemType) {
                var widget;

                if (itemType === 'DateTime' || itemType === 'Date') {
                    widget = DateTimeEditorView;
                } else if (itemType == 'Number') {
                    widget = NumberEditorView;
                } else if (itemType == 'Duration') {
                    widget = DurationEditorView;
                } else if (itemType == 'HtmlText' || itemType == 'MultiLineText') {
                    widget = TextareaEditorView;
                } else if (itemType == 'Account') {
                    widget = AccountEditorView;
                } else if (itemType == 'Selector') {
                    widget = ListOfValuesEditorView;
                } else if (itemType == 'Instance') {
                    widget = InstanceEditorView;
                } else if (itemType == 'StaticContent') {
                    widget = StaticContentEditorView;
                } else if (itemType == 'Attachment') {
                    widget = AttachmentView;
                } else if (itemType == 'Boolean') {
                    widget = BooleanEditorView;
                } else if (itemType == 'RadioSelector') {
                    widget = RadioSelectorEditorView;
                } else if (itemType == 'MultiSelect') {
                    widget = MultiSelectEditorView;
                } else  {
                    widget = TextEditorView;
                }

                return widget;
            },

            buildEditSchemaAndModel: function (models) {
                var schema = {},
                    modelsCnt = models.length;

                this.formModel.clear();
                this.tabsCollection.reset();
                for (var i = 0; i < modelsCnt; i++) {
                    var item = models[i],
                        widgetModel,
                        itemType = item.get('widgetType'),
                        widget;

                    if (itemType == 'History' || itemType == 'Subtasks' || itemType == 'ProcessView' ||
                        itemType == 'Comments' || itemType == 'Timespent') {
                        continue;

                    } else if (itemType === 'Panel') {
                        this.buildTemporaryTabCollection(item);
                        continue;
                    }

                    widget = this.getWidgetByType(itemType);
                    widgetModel = this.getWidgetModel(item);

                    if (item.get('multiValue') && itemType != 'MultiSelect') {
                        widgetModel.childType = widget;
                        widget = MultiValueProxyEditorView;
                    }

                    schema[item.get('dataId')] = {type: widget};
                    this.formModel.set(item.get('dataId'), widgetModel);
                }

                return schema;
            },

            getWidgetModel: function (item) {
                var itemType = item.get('widgetType'),
                    widgetModel = {
                        access: item.get('access'),
                        data: item.get('dataValue'),
                        type: itemType,
                        prompt: item.get('promptText'),
                        generalModel: item,
                        isRequired: this.isItemRequired(item),
                        hasValidationError: this.isItemHasValidationError(item),
                        labelText: item.get('labelText'),
                        attributes: item.get('attributes'),
                        isVisible: item.get('isVisible'),
                        componentId: item.get('id')
                    };

                if (itemType === 'DateTime' || itemType === 'Date') {
                    var format = item.get('format');
                    format == 'Undefined' && (format = '');
                    widgetModel.dateFormat = format;
                } else if (itemType == 'Selector') {
                    widgetModel.dataId = item.get('dataId');
                    widgetModel.data = item.get('instances');
                } else if (itemType == 'Account') {
                    widgetModel.data = item.get('instances');
                } else if (itemType == 'Instance') {
                    widgetModel.data = item.get('instances');
                    widgetModel.valueQuery = item.get('valueQuery');
                    widgetModel.dataId = item.get('dataId');
                } else if (itemType == 'StaticContent') {
                    widgetModel.access = 'Static';
                } else if (itemType == 'Attachment') {
                    widgetModel.access = 'Static';
                    widgetModel.data = [this.getAttachmentsData(item)];
                } else if (itemType == 'Boolean') {
                    widgetModel.data = [{dataValue: item.get('dataValue')}];
                } else if (itemType == 'RadioSelector' || itemType == 'MultiSelect') {
                    widgetModel.variants = item.get('variants');
                    var ids = _.map(item.get('instances'), function(it){
                        return it.instanceId;
                    });
                    widgetModel.data =  [{ dataValue: ids }];
                    widgetModel.orientation = item.get('orientation') || 'Horizontal';
                }

                if (item.get('multiValue')) {
                    widgetModel.isMultivalue = true;
                }

                return widgetModel;
            },

            isItemRequired: function (itemModel) {
                var id = itemModel.get('dataId'),
                    isFound = _.find(this.formProps.mandatoryFields, function (i) {
                        return i === id;
                    });

                return isFound ? true : false;
            },

            isItemHasValidationError: function (itemModel) {
                if (!this.formLayoutBuilder.errorRequiredFields || this.formLayoutBuilder.errorRequiredFields.length < 0){
                    return;
                }

                var id = itemModel.get('dataId'),
                    isFound = _.find(this.formLayoutBuilder.errorRequiredFields, function (i) {
                        return i.propertyId === id;
                    });

                return isFound ? true : false;
            },

            fieldNavigation: function (layout) {
                if (this.displayField.isEdit && this.displayField.type !== 'attachments') {
                    if (this.displayField.isCustomTab) {
                        this.formLayoutBuilder.createCustomTabLayout({id: this.displayField.id, isEdit: true});
                    } else {
                        this.showEditForm({
                            layout: layout,
                            isCustomTab: this.displayField.isCustomTab,
                            id: this.displayField.id
                        });
                    }
                } else if (this.displayField.isCreate && this.displayField.type !== 'attachments') {
                    this.currentState = 'create';
                    if (this.displayField.type === 'customTab') {
                        this.formLayoutBuilder.createCustomTabLayout({id: this.displayField.id, isCreate: true});
                    } else {
                        this.setFormId(this.displayField.prototype);
                        this.formContainer = this.displayField.container;
                        this.formPrototype = this.displayField.prototype;
                        this.showCreateForm({
                            layout: layout,
                            isCustomTab: this.displayField.isCustomTab,
                            id: this.displayField.id
                        });
                    }
                } else {
                    if (this.displayField.type === 'account') {
                        var fieldData = {};
                        fieldData.label = this.findFieldById(this.displayField.fieldId, layout);
                        fieldData.userId = this.displayField.userId;
                        this.formLayoutView.drawAccount(fieldData, this.formId);
                    } else if (this.displayField.type === 'attachments') {
                        var attachmentsData = this.getAttachmentsData(this.formData);
                        this.formLayoutView.drawAttachments(attachmentsData, this.editEnabled);
                    } else if (this.displayField.type === 'attachment') {
                        this.formLayoutView.drawSingleAttachment(this.displayField.id, this.editEnabled);
                    } else if (this.displayField.type === 'attachmentAuthor') {
                        var fieldObj = {};
                        fieldObj.label = 'Attachment author';
                        fieldObj.userId = this.displayField.userId;
                        this.formLayoutView.drawAccount(fieldObj, this.formId);
                    } else if (this.displayField.type === 'customTab') {
                        var field = this.displayField;
                        this.displayField = null;
                        this.formLayoutBuilder.createCustomTabLayout({id: field.id});
                        return;
                    } else if (this.displayField.type === 'comments') {
                        this.showComments();
                    } else if (this.displayField.type === 'history') {
                        App.FormMediator.showCurrentItemHistory();
                    } else if (this.displayField.type === 'subtasks') {
                        App.FormMediator.showCurrentItemSubtasks();
                    } else if (this.displayField.type === 'timespent') {
                        App.FormMediator.showCurrentItemTimespent();
                    } else if (this.displayField.type === 'singleTimespent') {
                        App.FormMediator.showSingleTimespent(this.displayField.id);
                    } else if (this.displayField.type === 'workflow') {
                        App.FormMediator.showWorkflow();
                    }
                }
                this.displayField = null;
            },

            findFieldById: function (fieldId, layout) {
                var data = _.find(layout.cfg, function (item) {
                    if (item.field && item.field.datasource && item.field.datasource.id === fieldId) {
                        return true;
                    }
                });
                return data ? data.field.label.text : null;
            },

            getAttachmentsData: function (formData) {
                var attachmentsData = _.find(formData, function (item) {
                    if (item.type === 'Attachment') {
                        return true;
                    }
                });
                this.attachmentsData = attachmentsData ? attachmentsData.attachments : [];
                return this.attachmentsData;
            },

            extendActions: function (data) {
                var actions = data.actions;
                var dataL = data.data.length;
                for (var i = 0; i < dataL; i++) {
                    if (data.data[i].id == 'taskStatus' && data.data[i].instances[0].id == 'cmw.taskStatus.pendingAccept') {
                        actions.push({
                            action: 'AcceptTask',
                            enabled: true,
                            hidden: false
                        });
                        actions.push({
                            action: 'DeclineTask',
                            enabled: true,
                            hidden: false
                        });
                        break;
                    }
                }
                return actions;
            },

            saveTemporaryAttachment: function (attachment) {
                var temporaryAttachmentsL = this.temporaryAttachments.length,
                    isDuplicate = false;

                for (var i = 0; i < temporaryAttachmentsL; i++) {
                    if (this.temporaryAttachments[i].name == attachment.name) {
                        this.temporaryAttachments[i] = attachment;
                        isDuplicate = true;
                        break;
                    }
                }

                if (!isDuplicate) {
                    this.temporaryAttachments.push(attachment);
                }

                var attachments = [];
                _.each(this.temporaryAttachments, function(item){
                    attachments.push({fileName: item.name, revisions: [{stream: item.streamId}]});
                });
                this.onFormDataChanged(attachments.length ? {attachments: attachments} : null);
            },

            updateComponentsVisibility: function () {
                var $el = $(this.formLayoutView.el);
                _.each(this.formLayoutBuilder.componentVisibility, function (isVisible, cmpId) {
                    var cmplEl = $el.find('[component-id="' + cmpId + '"]');
                    if (!cmplEl)
                        return;

                    if (isVisible)
                        cmplEl.removeClass('hidden');
                    else
                        cmplEl.addClass('hidden');
                });
            },

            updateFormData: function (rD) {
                this.setFormData(rD);
                this.setValues();
            },

            setValues: function () {
                _.each(this.formData, function (it) {
                    var id = it.id,
                        data = this.formModel.attributes[id];

                    if (!data || !data.attributes.Calculated)
                        return;

                    var dataObj = {};

                    if (it.values) {
                        var values = it.values,
                            dataValues = [];
                        for (var q = 0; q < values.length; q++) {
                            dataValues.push({
                                dataValue: values[q]
                            });
                        }
                        dataObj = {data: dataValues};
                    } else if (it.instances) {
                        var instances = it.instances,
                            instanceValues = [];
                        for (var cnt = 0; cnt < instances.length; cnt++) {
                            instanceValues.push({
                                instanceName: instances[cnt].name,
                                instanceId: instances[cnt].id
                            });
                        }
                        dataObj = {data: instanceValues};
                    }

                    this.formLayoutView.editView.formModel.trigger('change:' + id,  dataObj);
                }.bind(this));
            },

            processVisibilityData: function (cmp, parent, isParentVisible) {
                var items = cmp && cmp.children || this.formLayoutBuilder.dataProxyManager.cfgModel.attributes.root.children,
                    visibilityData = this.formLayoutBuilder.componentVisibility;

                isParentVisible === undefined && (isParentVisible = true);

                _.each(items, function (it) {
                    var isVisible = visibilityData[it.id];

                    isVisible === undefined && (isVisible = true);

                    if (!isParentVisible) {
                        isVisible = false;
                    }

                    visibilityData[it.id] = isVisible;

                    if (it.children) {
                        this.processVisibilityData(it, it, isVisible);
                    }
                }, this);
            },

            updateForm: function (rD) {
                this.setVisibilityData(rD.visibility);
                this.processVisibilityData();
                this.updateComponentsVisibility();
                this.updateFormData(rD);
            },

            onFormDataChanged: function (changedData, silent) {
                for (var fieldId in changedData) {
                    this.formEditedData[fieldId] = changedData[fieldId];
                }

                !silent && this.trigger('formDataChanged');
            },

            saveModelForCloning: function () {
                var container = {},
                    prototype = {},
                    data = {};


                var propsNotToClone = {
                    'id': true,
                    'creator': true,
                    'creationDate': true,
                    'cmw.ui.AttachmentsDataSet': true,
                    'cmw.ui.exportTemplates': true,
                    'cmw.ui.commentsObjectId': true,
                    'taskWorkflowState': true,
                    'workflowState': true,
                    'cmw.workflowEvent': true,
                    'currentSubtask': true,
                    'currentSubtaskAssignee': true,
                    'cmw.possibleResolutions': true,
                    'cmw.previousAssignee': true,
                    'assignee': true,
                    'taskStatus': true
                };

                for (var i = 0; i < this.formData.length; i++) {
                    var p = this.formData[i];
                    if (p.accessType === 'Editable' && !propsNotToClone[p.id]) {
                        if (p.values) {
                            if (p.id === 'title') {
                                var title = p.values[0];
                                data['title'] = App.Localizer.get('ELEGANCE.FORM.WIDGETS.FIELDS.CLONETITLE').replace('{cloneItemTitle}', title);;
                            } else {
                                data[p.id] = p.values;
                            }
                        }
                        if (p.instances) {
                            data[p.id] = _.map(p.instances, function(i) { return i.id; });
                        }
                    }
                    if (p.id === 'container') {
                        container.id = p.values[0];
                    }
                }
                this.dataForCloning = data;
                prototype.id = this.formPrototype;
                App.FormMediator.newTask({container: container, prototype : prototype});
            }
        });
    });
