/**
 * Developer: Roman Shumskiy
 * Date: 29/09/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../App', '../views/Actions/ActionsView', '../views/HeaderPartView',
        '../templates/header.html', '../views/ConfirmView', '../views/editors/attachments/AddAttachmentView'],
    function (App, ActionsView, HeaderPartView, headerTmpl, ConfirmView, AddAttachmentView) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                var Model = Backbone.Model.extend({});
                this.editEnabled = options.editEnabled;
                this.model = new Model(options);
                if (options.attachmentsCollection) {
                    this.attachmentsCollection = options.attachmentsCollection;
                }
                this.isDescription = options.isDescription;
            },

            regions: {
                leftHeaderRegion: '#form-header-left-region',
                rightHeaderRegion: '#form-header-right-region'
            },

            className: 'tbar',

            template: Handlebars.compile(headerTmpl),

            mixinTemplateHelpers: function (data) {
                data.rightHeaderRegionClass = this.model.get('mode') === 'timespent' ? 'tbar__btn' : 'tbar__i';
                data.title = this.setTitle(data.mode, data.title);
                return data;
            },

            onRender: function () {
                this.buildHeader();
            },

            backToEditMainForm: function () {
                App.FormMediator.backToEditMainForm();
            },

            tryBackToTimespentCollection: function () {
                App.FormMediator.tryBackToTimespentCollection();
            },

            showCurrentItemHistory: function () {
                App.FormMediator.showCurrentItemHistory();
            },

            deleteTimespentItem: function () {
                App.FormMediator.deleteTimespentItem();
            },

            createNewTimespent: function () {
                App.FormMediator.createNewTimespent();
            },

            showNewTimespent: function () {
                App.FormMediator.showNewTimespent(this.model);
            },

            backToTimespentCollection: function () {
                App.FormMediator.showCurrentItemTimespent();
            },

            leftSectionClicked: function () {
                this.trigger('backToForm');
            },

            rightSectionClicked: function () {
                var mode = this.model.get('mode');
                if (mode === 'edit' || mode === 'editCustomTab' || mode === 'create' || mode === 'createCustomTab') {
                    App.FormMediator.saveEditFormDataToModel(this.model.get('mode'));
                } else if (mode === 'attachmentSingle') {
                    this.deleteAttachment();
                } else if (mode === 'attachment') {
                    this.uploadAttachment();
                } else if (mode === 'workflowViewer') {
                    this.downloadWorkflow();
                }
            },

            downloadWorkflow: function () {
                App.FormMediator.downloadWorkflow();
            },

            deleteAttachment: function () {
                this.confirmView = new ConfirmView({
                    text: App.Localizer.get('ELEGANCE.FORM.CONFIRM.DELETEATTACHMENT'),
                    className: 'wmodal wmodal_confirm'
                });

                this.listenTo(this.confirmView, 'triggerOk', function () {
                    App.FormMediator.deleteAttachmentById(this.model.get('attachmentId'));
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                }.bind(this));

                this.listenTo(this.confirmView, 'triggerCancel', function () {
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                }.bind(this));

                App.FormMediator.showCustomPopupView(this.confirmView);
            },

            uploadAttachment: function () {

            },

            backToFormFromTab: function () {
                App.FormMediator.backToFormFromTab();
            },

            buildViewCustomTabHeader: function () {
                var actions = this.model.get('actions'),
                    editAction = _.find(actions, function (act) {
                        return act.action === 'Edit';
                    });

                this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.BACK')});
                this.listenTo(this.leftSection, 'sectionClicked', function () {
                    App.FormMediator.updateItem();
                }.bind(this));

                if (editAction && editAction.enabled) {
                    this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.EDITACTION')});

                    this.listenTo(this.rightSection, 'sectionClicked', function () {
                        App.FormMediator.updateItem(false, {
                            isEdit: true,
                            isCustomTab: true,
                            fieldId: this.model.get('id')
                        });
                    }.bind(this));

                    this.rightHeaderRegion.show(this.rightSection);
                }
                this.leftHeaderRegion.show(this.leftSection);
            },

            buildViewHeader: function () {
                var actions = this.model.get('actions');
                this.rightSection = new ActionsView({
                    actions: actions,
                    resolutions: this.model.get('resolutions'),
                    isCustomTab: false,
                    id: this.model.get('id')
                });

                if (App.StateManager.isMobile) {
                    var btnText = '';
                    if (App.StateManager.state.opts.isSubtask || !App.StateManager.state.ds) {
                        btnText = App.Localizer.get('ELEGANCE.FORM.HEADER.CLOSE');
                    } else {
                        btnText = App.Localizer.get('ELEGANCE.FORM.HEADER.BACK');
                    }

                    this.leftSection = new HeaderPartView({text: btnText});
                    this.listenTo(this.leftSection, 'sectionClicked', function () {
                        App.FormMediator.backToDatasetFromForm();
                    });
                    this.leftHeaderRegion.show(this.leftSection);
                }

                this.rightHeaderRegion.show(this.rightSection);
            },

            buildEditNCreateHeader: function () {
                var mode = this.model.get('mode');

                this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.DONE')});
                this.listenTo(this.rightSection, 'sectionClicked', this.rightSectionClicked, this);

                if (App.StateManager.isMobile && mode === 'create') {
                    this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.CANCEL')});
                    this.listenTo(this.leftSection, 'sectionClicked', function () {
                        App.FormMediator.backToDatasetFromForm();
                    });
                } else if (mode === 'create') {
                    this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.CANCEL')});
                    this.listenTo(this.leftSection, 'sectionClicked', function () {
                        App.StateManager.state.isEdit = App.StateManager.state.isCreate = false;
                        App.FormMediator.updateItem(false, {mode: mode, isBack: true});
                    }.bind(this));
                } else {
                    this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.CANCEL')});
                    this.listenTo(this.leftSection, 'sectionClicked', function () {
                        App.StateManager.state.isEdit = App.StateManager.state.isCreate = false;
                        App.FormMediator.updateItem(false, {mode: mode, isBack: true});
                    }.bind(this));
                }

                this.leftHeaderRegion.show(this.leftSection);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildEditNCreateCustomTabHeader: function () {
                this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.CLOSE')});
                this.listenTo(this.rightSection, 'sectionClicked', function () {
                    var mode = this.model.get('mode');
                    if (mode == 'createCustomTab') {
                        App.FormMediator.updateItem(false, {
                            isCreate: true,
                            mode: 'createFromCustomTab'
                        });
                    } else if (mode == 'create') {
                        App.FormMediator.showEmptyView();
                    } else {
                        App.FormMediator.updateItem(false, {
                            isEdit: true
                        });
                    }
                });
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildAttachmentHeader: function () {
                this.buildBackHeader();

                if(App.StateManager.state.isEdit){
                    this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.BACK')});
                    this.listenTo(this.leftSection, 'sectionClicked', function(){
                        App.FormMediator.updateItem(false, {
                            isEdit: true
                        });
                    }, this);
                    this.leftHeaderRegion.show(this.leftSection);
                } else if (App.StateManager.state.isCreate){
                    this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.BACK')});
                    this.listenTo(this.leftSection, 'sectionClicked', function(){
                        App.FormMediator.updateItem(false, {
                            isCreate: true,
                            mode: 'createFromCustomTab'
                        });
                    }, this);
                    this.leftHeaderRegion.show(this.leftSection);
                }

                if (!this.editEnabled) {
                    return;
                }

                this.rightSection = new AddAttachmentView({
                    attacmentsCollection: this.attachmentsCollection
                });
                this.listenTo(this.rightSection, 'sectionClicked', this.rightSectionClicked, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildAttachmentSingleHeader: function () {
                this.buildBackHeader();

                if (!this.editEnabled) {
                    return;
                }

                this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.DELETE')});
                this.listenTo(this.rightSection, 'sectionClicked', this.rightSectionClicked, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildWorkflowHeader: function() {
                this.buildBackHeader();
                this.rightSection = new HeaderPartView({ text: App.Localizer.get('ELEGANCE.FORM.HEADER.DOWNLOAD') });
                this.listenTo(this.rightSection, 'sectionClicked', this.rightSectionClicked, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildTimespentHeader: function () {
                this.buildBackHeader();

                if (!this.editEnabled) {
                    return;
                }

                this.rightSection = new HeaderPartView({className: 'icon icon-add'});
                this.listenTo(this.rightSection, 'sectionClicked', this.showNewTimespent, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildSingleTimespentHeader: function () {
                this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.BACK')});
                this.listenTo(this.leftSection, 'sectionClicked', this.tryBackToTimespentCollection, this);
                this.leftHeaderRegion.show(this.leftSection);

                this.listenTo(App.FormMediator, 'showTimespent', this.leftSectionClicked);

                this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.DELETE')});
                this.listenTo(this.rightSection, 'sectionClicked', this.deleteTimespentItem, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildNewTimespentHeader: function () {
                this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.CANCEL')});
                this.listenTo(this.leftSection, 'sectionClicked', this.backToTimespentCollection, this);
                this.leftHeaderRegion.show(this.leftSection);

                this.rightSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.SAVE')});
                this.listenTo(this.rightSection, 'sectionClicked', this.createNewTimespent, this);
                this.rightHeaderRegion.show(this.rightSection);
            },

            buildBackHeader: function () {
                this.leftSection = new HeaderPartView({text: App.Localizer.get('ELEGANCE.FORM.HEADER.BACK')});
                this.listenTo(this.leftSection, 'sectionClicked', this.leftSectionClicked, this);
                this.leftHeaderRegion.show(this.leftSection);
            },


            buildHeader: function () {
                var mode = this.model.get('mode');
                if (mode === 'viewCustomTab') {
                    this.buildViewCustomTabHeader();
                } else if (mode === 'view') {
                    this.buildViewHeader();
                } else if (mode === 'edit' || mode === 'create') {
                    this.buildEditNCreateHeader();
                } else if (mode === 'editCustomTab' || mode === 'createCustomTab') {
                    this.buildEditNCreateCustomTabHeader();
                } else if (mode === 'attachment') {
                    this.buildAttachmentHeader();
                } else if (mode === 'attachmentSingle') {
                    this.buildAttachmentSingleHeader();
                } else if (mode === 'comments' || mode === 'subtasks' || mode === 'history') {
                    this.buildBackHeader();
                } else if (mode === 'timespent') {
                    this.buildTimespentHeader();
                } else if (mode === 'singleTimespent') {
                    this.buildSingleTimespentHeader();
                } else if (mode === 'newTimespent') {
                    this.buildNewTimespentHeader();
                } else if (mode === 'workflowViewer') {
                    this.buildWorkflowHeader();
                } else if (mode === 'account') {
                    this.buildBackHeader();
                }
            },

            setTitle: function (mode, text) {
                var title = '';
                if (mode === 'account' || mode === 'view' || mode === 'viewCustomTab') {
                    title = text;
                } else if (mode === 'attachment') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.ATTACHMENTS');
                } else if (mode === 'attachmentSingle') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.ATTACHMENT');
                } else if (mode === 'comments') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.COMMENTS');
                } else if (mode === 'subtasks') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.SUBTASKS');
                } else if (mode === 'history') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.HISTORY');
                } else if (mode === 'timespent') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.TIMESPENT');
                } else if (mode === 'singleTimespent') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.SINGLETIMESPENT');
                } else if (mode === 'newTimespent') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.NEWTIMESPENT');
                } else if (mode === 'workflowViewer') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.WORKFLOW');
                } else if (mode === 'edit') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.EDITTASK');
                } else if (mode === 'editCustomTab') {
                    title = this.isDescription ? App.Localizer.get('ELEGANCE.FORM.HEADER.EDITDESCRIPTION') : App.Localizer.get('ELEGANCE.FORM.HEADER.EDITTASK');
                } else if (mode === 'create') {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.CREATE');
                } else if (mode === 'createCustomTab') {
                    title = this.isDescription ? App.Localizer.get('ELEGANCE.FORM.HEADER.EDITDESCRIPTION') : App.Localizer.get('ELEGANCE.FORM.HEADER.EDITTASK');
                } else {
                    title = App.Localizer.get('ELEGANCE.FORM.HEADER.DEFAULTTITLE');
                }
                return title;
            }
        });
    });
