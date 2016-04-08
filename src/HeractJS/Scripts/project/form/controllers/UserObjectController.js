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

/* global define, _ */

define(['form/App', './FormController', './DataProxyManager'],
    function (App, FormController, DataProxyManager) {
        'use strict';

        return Backbone.Marionette.Controller.extend({
            initialize: function () {
                this.dataProxyManager = DataProxyManager;
                this.formController = new FormController();
                this.initializeEventHandling();

                this.listenTo(this.dataProxyManager.userObjectModel, 'formDataLoaded', this.onFormDataLoaded.bind(this));
                this.listenTo(this.dataProxyManager.subtasksCollection, 'subtasksLoaded', this.onSubtasksLoaded.bind(this));
                this.listenTo(this.dataProxyManager.historyCollection, 'historyLoaded', this.onHistoryLoaded.bind(this));
                this.listenTo(this.dataProxyManager.timespentModel, 'timespentLoaded', this.onTimespentLoaded.bind(this));
                this.listenTo(this.dataProxyManager.workflowModel, 'workflowLoaded', this.onWorkflowLoaded.bind(this));
                this.listenTo(this.formController, 'formDataChanged', this.refreshForm.bind(this));

                App.reqres.setHandler('isDataEdited', function () {
                    return this.hasEditedInfo();
                }.bind(this));
            },

            onDestroy: function () {
                this.formController.destroy();
                this.dataProxyManager.destroy();
            },

            onTimespentLoaded: function () {
                this.formController.setTimespentModel(this.dataProxyManager.timespentModel);
                if (App.StateManager.state.fld.type === 'singleTimespent') {
                    this.formController.showSingleTimespent(App.StateManager.state.fld.id);
                } else {
                    this.formController.showTimespent();
                }
            },

            onHistoryLoaded: function () {
                this.formController.setHistoryCollection(this.dataProxyManager.historyCollection);
                this.formController.showHistory();
            },

            onSubtasksLoaded: function () {
                this.formController.setSubtasksCollection(this.dataProxyManager.subtasksCollection);
                this.formController.showSubtasks();
            },

            onFormDataLoaded: function (result) {
                this.setCommentsCollection(result);
                this.formController.setFormData(result);
                this.formController.showForm(result);
            },

            setCommentsCollection: function (result) {
                this.dataProxyManager.setCommentsCollection([_.findWhere(result.data, {type: 'Comments'}).commentsTree]);
                this.formController.setCommentsCollection(this.dataProxyManager.commentsCollection);
            },

            onWorkflowLoaded: function () {
                this.formController.showWorkflow(this.dataProxyManager.workflowModel);
            },

            initializeEventHandling: function () {
                this.listenTo(App.StateManager, 'updateForm', function (form) {
                    this.viewForm(form.formId);
                    if (form.fld) {
                        this.formController.displayField = form.fld;
                    }
                }.bind(this));

                this.listenTo(App.FormMediator, 'deleteCurrentItem', this.deleteForm.bind(this));

                this.listenTo(App.FormMediator, 'reassignCurrentItem', this.reassignForm.bind(this));

                this.listenTo(App.FormMediator, 'moveCurrentItem', this.getTransitionModel.bind(this));

                this.listenTo(App.FormMediator, 'followCurrentItem', this.changeFollowState.bind(this));

                this.listenTo(App.FormMediator, 'sendEditedInfoToServer', this.editForm.bind(this));

                this.listenTo(App.FormMediator, 'sendCreatedTaskToServer', this.createForm.bind(this));

                this.listenTo(App.FormMediator, 'commentsChange', this.refreshComments.bind(this));

                this.listenTo(App.FormMediator, 'showSubtasks', this.getSubtasks.bind(this));

                this.listenTo(App.FormMediator, 'showHistory', this.getHistory.bind(this));

                this.listenTo(App.FormMediator, 'showTimespent', this.getTimespent.bind(this));

                this.listenTo(App.FormMediator, 'createNewTask', this.getEmptyLayout.bind(this));

                this.listenTo(App.FormMediator, 'deferCurrentTask', this.deferTask.bind(this));

                this.listenTo(App.FormMediator, 'startCurrentTask', this.startTask.bind(this));

                this.listenTo(App.FormMediator, 'completeCurrentTask', this.completeTask.bind(this));

                this.listenTo(App.FormMediator, 'showWorkflow', this.getWorkflow.bind(this));

                this.listenTo(App.FormMediator, 'performTransition', this.performTransition.bind(this));

                this.listenTo(App.FormMediator, 'showLetterSettings', this.showLetterEditing.bind(this));

                this.listenTo(App.FormMediator, 'acceptCurrentTask', this.acceptTask.bind(this));

                this.listenTo(App.FormMediator, 'declineCurrentTask', this.declineTask.bind(this));
            },

            getWorkflow: function () {
                var currentWorkflowStates = _.findWhere(this.formController.formData, {id: 'workflowState'}).instances;
                var workflowObject = {
                    id: this.formController.formId,
                    states: currentWorkflowStates
                };
                this.dataProxyManager.getWorkflow(workflowObject);
            },

            getTimespent: function () {
                this.dataProxyManager.getTimespent(this.formController.formId);
            },

            getHistory: function () {
                this.dataProxyManager.getHistory(this.formController.formId);
            },

            getSubtasks: function () {
                this.dataProxyManager.getSubtasks(this.formController.formId);
            },

            refreshComments: function () {
                this.dataProxyManager.getComments(this.formController.formId);
            },

            getEmptyLayout: function (container, prototype) {
                this.formController.setFormId(prototype);
                this.formController.formContainer = container;
                this.formController.formPrototype = prototype;
                this.formController.currentState = 'create';
                this.dataProxyManager.getData(prototype);
            },

            deleteForm: function () {
                var id = this.formController.formId;
                this.dataProxyManager.deleteForm(id);
            },

            editForm: function () {
                var dataToSave = this.formController.formEditedData,
                    formId = this.formController.formId;

                if (!_.isEmpty(dataToSave)) {
                    this.dataProxyManager.editForm(formId, dataToSave);
                } else {
                    App.StateManager.forceRefresh(true, false);
                    App.FormMediator.cleanEditModel();
                    App.StateManager.state.isEdit = false;
                    App.StateManager.state.isCreate = false;
                    App.StateManager.updateItem();
                }
            },

            createForm: function () {
                var formId = this.formController.formId;
                var container = this.formController.formContainer;
                var dataToSave = this.formController.formEditedData;

                if (dataToSave) {
                    this.dataProxyManager.createForm(container, formId, dataToSave);
                }
                App.DatasetMediator.selectItem(this.formController.formId);
            },

            getTransitionModel: function (transition) {
                var transitionInfo = {
                    id: this.formController.formId,
                    transitionId: transition.get('id')
                };

                this.dataProxyManager.getTransitionModel(transitionInfo);
            },

            performTransition: function (tranisitonInfo) {
                this.dataProxyManager.performTransition(tranisitonInfo);
            },

            showLetterEditing: function (transitionModel) {

                var lettersEditing = {
                    formId: transitionModel.get('formId'),
                    transitionId: transitionModel.get('transitionId'),
                    letters: transitionModel.get('letters')
                };

                App.StateManager.lettersEditing = lettersEditing;
                App.StateManager.showLettersSettings();
            },

            reassignForm: function (user) {
                var id = this.formController.formId;
                var userId = user.id;

                this.dataProxyManager.reassignForm(id, userId);
            },

            viewForm: function (id) {
                this.formController.currentState = 'view';
                this.formController.setFormId(id);

                if (!_.isEmpty(this.formController.dataForCloning)) {
                    this.formController.formEditedData = this.formController.dataForCloning;
                    this.formController.dataForCloning = {};
                }
                if (!_.isEmpty(this.formController.formEditedData)) {
                    this.dataProxyManager.refreshForm(id, this.formController.formEditedData, this.formController.formContainer, true);
                } else {
                    this.dataProxyManager.getData(id);
                }
            },

            changeFollowState: function (state) {
                var id = this.formController.formId;
                this.dataProxyManager.changeFollowState(id, state);
            },

            deferTask: function () {
                var id = this.formController.formId;
                this.dataProxyManager.defferTask(id);
            },

            startTask: function () {
                var id = this.formController.formId;
                this.dataProxyManager.startTask(id);
            },

            completeTask: function () {
                var id = this.formController.formId;
                this.dataProxyManager.completeTask(id);
            },

            hasEditedInfo: function () {
                return !_.isEmpty(this.formController.formEditedData);
            },

            acceptTask: function () {
                var id = this.formController.formId;
                this.dataProxyManager.acceptTask(id);
            },

            declineTask: function () {
                var id = this.formController.formId;
                this.dataProxyManager.declineTask(id);
            },

            refreshForm: function () {
                var id = this.formController.formId,
                    editedData = this.formController.formEditedData,
                    container = this.formController.formContainer;
                this.dataProxyManager.refreshForm(id, editedData, container);
            }
        });
    });
