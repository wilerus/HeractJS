/**
 * Developer: Stepan Burguchev
 * Date: 7/11/2014
 * Copyright: 2009-2013 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, $ */

define(['form/App',
        'form/templates/editTemplate.html', 'form/templates/layout.hbs', './EmptyView', './ContentView', './HeaderView', './AccountView',
        'form/views/editors/attachments/AttachmentsCollection', 'form/views/editors/attachments/AttachmentsSingle',
        'form/views/Editing/EditingLayoutView',
        './widgets/CommentsCollection',
        './widgets/SubtasksCollection',
        './widgets/HistoryCollection',
        './widgets/TimespentCollection',
        './widgets/SingleTimespent',
        './widgets/Attachments',
        './widgets/Timespent',
        './widgets/Comments',
        './widgets/HtmlText',
        './widgets/WidgetComposite',
        './widgets/Subtasks',
        './widgets/History',
        './widgets/Process',
        './widgets/CustomTab',
        './widgets/WorkflowView',
        './widgets/StaticContent',
        './widgets/RadioSelector',
        './widgets/MultiSelect'],
    function (App, editTemplate, template, EmptyView, ContentView, HeaderView, AccountView,
              AttachmentsCollection, AttachmentsSingle,
              EditingView, CommentsCollectionView, SubtasksCollectionView, HistoryCollectionView, TimespentCollectionView, SingleTimespentView,
              WAttachments, WTimespent, WComments, WHtmlText,
              WidgetComposite, WSubtasks, WHistory, WProcessView, WCustomTab, WorkflowViewer, WStaticContent, RadioSelector, MultiSelect) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function (options) {
                this.formModel = options.formModel;
                this.formSchema = options.formViewOpts && options.formViewOpts.schema;

                this.tabsCollection = options.tabsCollection;

                this.tabsEditedModel = {};

                this.emptyView = new EmptyView();
                this.widgetsLib = {
                    Attachment: WAttachments,
                    Comments: WComments,
                    Panel: WCustomTab,
                    History: WHistory,
                    Subtasks: WSubtasks,
                    Timespent: WTimespent,
                    ProcessView: WProcessView,

                    Instance: WidgetComposite,
                    Account: WidgetComposite,
                    Date: WidgetComposite,
                    DateTime: WidgetComposite,
                    Duration: WidgetComposite,
                    Selector: WidgetComposite,
                    Number: WidgetComposite,
                    Checkbox: WidgetComposite,
                    HtmlText: WidgetComposite,
                    MultiLineText: WidgetComposite,
                    SingleLineText: WidgetComposite,
                    RadioSelector: RadioSelector,
                    MultiSelect: MultiSelect,
                    StaticContent: WStaticContent
                };
            },
            regions: {
                headerRegion: '#form-header-region',
                contentRegion: '#form-content-region'
            },
            className: 'right-column',
            template: template,

            showEmptyView: function () {
                this.buildAndShowHeaderView({
                    mode: 'default'
                });
                this.emptyView = new EmptyView();
                this.contentRegion.show(this.emptyView);
            },

            reDraw: function (layout, models, formProps) {
                this.layout = layout ? layout : this.layout;
                this.models = models ? models : this.models;
                this.actions = formProps.formActions ? formProps.formActions : this.actions;
                this.resolutions = formProps.resolutions ? formProps.resolutions : null;

                if (this.layout.isCustomTab) {
                    this.currentState = 'customTab';
                } else {
                    this.currentState = 'form';
                }

                if (this.layout && this.models && this.actions) {
                    this.buildAndShowHeaderView({
                        mode: this.layout.isCustomTab ? 'viewCustomTab' : 'view'
                    });

                    var widgets = this.widgets ? this.widgets : [];
                    this.contentView = new ContentView({
                        cfgCollection: this.layout.cfg,
                        tmplt: this.layout.template
                    });
                    this.contentRegion.show(this.contentView);
                    this.contentView.children.each(function (view, i) {
                        var model = this.models[i],
                            wType = this.layout.cfg[i].type,
                            el = view.$el;

                        widgets.push(this.getWidget(wType, model, el));
                    }.bind(this));
                    this.widgets = widgets;
                } else {
                    this.showEmptyForm();
                }
            },

            getWidget: function (wType, model, el) {
                if (!this.widgetsLib[wType]) {
                    wType = 'SingleLineText';
                }

                return new this.widgetsLib[wType]({
                    model: model,
                    el: el
                });
            },

            drawAccount: function (accountOpts) {
                if (accountOpts.label) {
                    accountOpts.label = "Account";
                }

                this.buildAndShowHeaderView({
                    title: accountOpts.label,
                    mode: 'account'
                });
                this.contentRegion.show(new AccountView({account: accountOpts}));
            },

            drawAttachments: function (model, editEnabled) {
                this.attachmentsCollectionModel = model ? model : this.attachmentsCollectionModel;
                this.attachmentsCollectionView = new AttachmentsCollection({
                    attachmentsCollection: this.attachmentsCollectionModel
                });

                this.buildAndShowHeaderView({
                    mode: 'attachment',
                    editEnabled: editEnabled
                });
                this.listenTo(this.attachmentsCollectionView, 'attachmentSelected', this.drawSingleAttachment.bind(this));
                this.contentRegion.show(this.attachmentsCollectionView);
            },

            drawSingleAttachment: function (id, editEnabled) {
                this.attachmentsSingleView = new AttachmentsSingle({id: id});

                this.buildAndShowHeaderView({
                    mode: 'attachmentSingle',
                    editEnabled: editEnabled,
                    attachmentId: id
                });
                this.contentRegion.show(this.attachmentsSingleView);
            },

            drawComments: function (commentsCollection, editEnabled) {
                this.commentsCollectionView = new CommentsCollectionView({
                    commentsCollection: commentsCollection,
                    editEnabled: editEnabled
                });
                this.buildAndShowHeaderView({
                    mode: 'comments'
                });
                this.contentRegion.show(this.commentsCollectionView);
            },

            drawSubtasks: function (subtasksCollection) {
                this.subtasksCollectionView = new SubtasksCollectionView({collection: subtasksCollection});
                this.buildAndShowHeaderView({
                    mode: 'subtasks'
                });
                this.contentRegion.show(this.subtasksCollectionView);
            },

            drawHistory: function (historyCollection) {
                this.historyCollectionView = new HistoryCollectionView({collection: historyCollection});
                this.buildAndShowHeaderView({
                    mode: 'history'
                });
                this.contentRegion.show(this.historyCollectionView);
            },

            drawTimespent: function (timespentModel, editEnabled) {
                this.timespentCollectionView = new TimespentCollectionView({
                    model: timespentModel,
                    editEnabled: editEnabled
                });
                this.buildAndShowHeaderView({
                    mode: 'timespent',
                    editEnabled: editEnabled
                });
                this.contentRegion.show(this.timespentCollectionView);
            },

            drawSingleTimespent: function (model, editEnabled) {
                this.singleTimespentView = new SingleTimespentView({model: model});
                this.buildAndShowHeaderView({
                    mode: 'singleTimespent',
                    editEnabled: editEnabled
                });
                this.contentRegion.show(this.singleTimespentView);
            },

            drawNewTimespent: function (timespentModel, editEnabled) {
                this.singleTimespentView = new SingleTimespentView({timespentModel: timespentModel, isNew: true});
                this.buildAndShowHeaderView({
                    mode: 'newTimespent',
                    editEnabled: editEnabled
                });
                this.contentRegion.show(this.singleTimespentView);
            },

            cleanEditModels: function () {
                this.tabsEditedModel = {};
                delete this.editedModel;
            },

            getEditModel: function (isCustomTab, tabId) {
                var editedModel;

                if (isCustomTab) {
                    editedModel = $.extend(true, {}, this.formModel);
                    this.tabsEditedModel[tabId] = editedModel;
                } else {
                    editedModel = $.extend(true, {}, this.formModel);
                    this.editedModel = editedModel;
                }

                return editedModel;
            },

            showEditForm: function (layout, isCustomTab, tabId) {
                this.layout = layout;
                var editedModel = this.getEditModel(isCustomTab, tabId),
                    formTemplate = this.getEditTemplate(editedModel.attributes);

                this.formSchema = $.extend(true, {}, this.formSchema);

                this.editView = new EditingView({
                    formModel: editedModel,
                    formSchema: this.formSchema,
                    formTemplate: formTemplate,
                    tabsCollection: this.tabsCollection,
                    mode: 'edit',
                    isCustomTab: isCustomTab
                });

                this.buildAndShowHeaderView({
                    mode: this.layout.isCustomTab ? 'editCustomTab' : 'edit',
                    tabId: tabId
                });
                this.contentRegion.show(this.editView);
            },

            showCreateForm: function (layout, isCustomTab, tabId) {
                this.layout = layout;
                var editedModel = this.getEditModel(isCustomTab, tabId);

                if (isCustomTab) {
                    this.currentState = 'customTab';
                } else {
                    this.currentState = 'form';
                }

                this.formSchema = $.extend(true, {}, this.formSchema);
                var formTemplate = this.getEditTemplate(editedModel.attributes);

                this.editView = new EditingView({
                    formModel: editedModel,
                    formSchema: this.formSchema,
                    formTemplate: formTemplate,
                    mode: 'create',
                    tabsCollection: this.tabsCollection,
                    isCustomTab: isCustomTab
                });

                this.buildAndShowHeaderView({
                    mode: isCustomTab ? 'createCustomTab' : 'create'
                });
                this.contentRegion.show(this.editView);
            },

            hideEditForm: function () {
                App.FormMediator.hideEditView();
            },

            showEmptyForm: function () {
                this.headerView = new HeaderView();
                this.headerRegion.show(this.headerView);
                this.emptyView = new EmptyView();
                this.contentRegion.show(this.emptyView);
            },

            showWorkflow: function (wfModel) {
                this.buildAndShowHeaderView({
                    mode: 'workflowViewer'
                });
                var workflowViewer = new WorkflowViewer({model: wfModel});
                this.contentRegion.show(workflowViewer);
            },

            buildAndShowHeaderView: function (options) {
                var handlerFunction = null,
                    opts = {};
                if (options.mode == 'account') {
                    opts = options;
                    handlerFunction = function () {
                        App.StateManager.backFromInner();
                    }.bind(this);
                } else if (options.mode == 'viewCustomTab' || options.mode == 'view') {
                    var isDescription = this.isDescription();
                    opts = {
                        title: isDescription ? this.layout.cfg[0].field.label.text : this.layout.appName,
                        //title: isDescription ? App.Localizer.parseLabelText(this.layout.cfg[0].field.label.text) : this.layout.appName,
                        mode: options.mode,
                        id: this.layout.id,
                        actions: this.actions,
                        resolutions: this.resolutions
                    };
                } else if (options.mode == 'attachment') {
                    opts = {
                        mode: options.mode,
                        attachmentsCollection: this.attachmentsCollectionModel
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem();
                    }.bind(this);
                } else if (options.mode == 'attachmentSingle') {
                    opts = {
                        mode: options.mode,
                        attachmentId: options.attachmentId
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem(false, {
                            type: 'attachments'
                        });
                    }.bind(this);
                } else if (options.mode == 'editCustomTab' || options.mode == 'edit') {
                    opts = {
                        mode: options.mode,
                        prevState: this.currentState ? this.currentState : null,
                        tabId: options.tabId,
                        isDescription: this.isDescription()
                    };
                } else if (options.mode == 'createCustomTab' || options.mode == 'create') {
                    opts = {
                        mode: options.mode,
                        prevState: this.currentState ? this.currentState : false,
                        isDescription: this.isDescription()
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem();
                    }.bind(this);
                } else if (options.mode == 'comments' || options.mode == 'subtasks' || options.mode == 'history' ||
                options.mode == 'timespent' || options.mode == 'workflowViewer') {
                    opts = {
                        mode: options.mode
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem();
                    }.bind(this);
                } else if (options.mode == 'attachments') {
                    opts = {
                        mode: options.mode
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem(false, {
                            type: 'attachments'
                        });
                    }.bind(this);
                } else if (options.mode == 'singleTimespent' || options.mode == 'newTimespent') {
                    opts = {
                        mode: options.mode
                    };
                    handlerFunction = function () {
                        App.FormMediator.updateItem(false, {
                            type: 'timespent'
                        });
                    }.bind(this);
                }

                opts.editEnabled = options.editEnabled;
                this.headerView = new HeaderView(opts);
                if (handlerFunction) {
                    this.listenTo(this.headerView, 'backToForm', handlerFunction);
                }
                this.headerRegion.show(this.headerView);
            },

            getEditTemplate: function (models) {
                return Handlebars.compile(editTemplate)(models);
            },

            isDescription: function () {
                if (this.layout.cfg[0].field.datasource) {
                    return this.layout.cfg[0].field.datasource.id === 'description';
                }
                return false;
            }
        });
    });
