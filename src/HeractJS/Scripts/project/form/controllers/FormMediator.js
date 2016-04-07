/**
 * Developer: Roman Shumskiy
 * Date: 20/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../App'],
    function (App) {
        'use strict';
        return Marionette.Controller.extend({
            hideCustomPopupView: function () {
                //App.vent.trigger('hideCustomPopupView');
            },

            showCustomPopupView: function (view) {
                //App.vent.trigger('showCustomPopupView', view);
            },

            showItemById: function (itemId) {
                //App.vent.trigger('itemSelected', {id: itemId});
            },

            deleteCurrentItem: function () {
                this.trigger('deleteCurrentItem');
            },

            reassignCurrentItem: function (model) {
                this.trigger('reassignCurrentItem', model);
            },

            moveToNextStep: function (stepModel) {
                this.trigger('moveCurrentItem', stepModel);
            },

            changeFollowState: function (state) {
                this.trigger('followCurrentItem', state);
            },

            sendFormLayout: function (layout) {
                this.trigger('getFormLayout', layout);
            },

            showEmptyView: function () {
                this.trigger('showEmptyView');
            },

            showAttachment: function (model) {
                this.trigger('showSingleAttachment', model);
            },

            showEditForm: function (opts) {
                this.trigger('showEditForm', opts);
            },

            showEmptyForm: function () {
                this.trigger('showEmptyForm');
            },

            saveEditFormDataToModel: function (mode) {
                this.mode = mode;
                this.trigger('saveEditFormDataToModel');
            },

            sendEditedInfoToServer: function () {
                if (this.mode === 'create' || this.mode === "createCustomTab") {
                    this.trigger('sendCreatedTaskToServer');
                } else if (this.mode === 'edit' || this.mode === 'editCustomTab') {
                    this.trigger('sendEditedInfoToServer');
                }
            },

            hideEditView: function () {
                App.vent.trigger('hideEditView');
            },

            showEditView: function (view) {
                App.vent.trigger('showEditView', view);
            },

            showAccount: function (instance) {
                this.trigger('showAccount', instance);
            },
            showCurrentItemComments: function () {
                this.trigger('showComments');
            },

            onCommentsChange: function () {
                this.trigger('commentsChange');
            },

            showCommentEdit: function (view) {
                this.trigger('showCommentEdit', view);
            },

            showCurrentItemSubtasks: function () {
                this.trigger('showSubtasks');
            },

            showCurrentItemHistory: function () {
                this.trigger('showHistory');
            },

            showCurrentItemTimespent: function () {
                //App.StateManager.state.isTimespentCraeteOrEdit = false;
                this.trigger('showTimespent');
            },

            backToDatasetFromForm: function () {
            },

            showSingleTimespent: function (id) {
                //App.StateManager.state.isTimespentCraeteOrEdit = true;
                this.trigger('showSingleTimespent', id);
            },

            newTask: function (newTaskConfigData) {
                this.cleanEditModel();
                var container = newTaskConfigData.container.id;
                var prototype = newTaskConfigData.prototype.id;
                this.updateItem(false, {
                    container: container,
                    prototype: prototype,
                    isCreate: true
                });
            },

            cloneItem: function () {
                this.trigger('saveModelAndStartCloning');
            },

            drawNewTask: function (container, prototype) {
                this.trigger('createNewTask', container, prototype);
            },

            drawNewTaskTab: function (container, prototype, customTab) {
                this.trigger('createNewTask', container, prototype, customTab);
            },

            tryBackToTimespentCollection: function () {
                this.trigger('tryBackToTimespentCollection');
            },

            showTimespentSaveDialog: function (opts) {
                this.trigger('showTimespentSaveDialog', opts);
            },

            showNewTimespent: function (model) {
                //App.StateManager.state.isTimespentCraeteOrEdit = true;
                this.trigger('showNewTimespent', model);
            },

            createNewTimespent: function () {
                this.trigger('createNewTimespent');
            },

            deleteTimespentItem: function () {
                this.trigger('deleteTimespentItem');
            },

            reDrawCurrentItem: function () {
                this.trigger('reDrawCurrentItem');
            },

            showCustomTab: function (opts) {
                this.trigger('showCustomTab', opts);
            },

            backToFormFromTab: function () {
                this.trigger('backToFormFromTab');
            },

            deferCurrentTask: function () {
                this.trigger('deferCurrentTask');
            },

            startCurrentTask: function () {
                this.trigger('startCurrentTask');
            },

            completeCurrentTask: function () {
                this.trigger('completeCurrentTask');
            },

            showWorkflow: function () {
                this.trigger('showWorkflow');
            },

            backToEditMainForm: function () {
                this.trigger('backToEditMainForm');
            },

            cleanEditModel: function () {
                this.trigger('cleanEditModel');
            },

            updateItem: function (item, fld) {
                //App.StateManager.updateItem(item, fld);
            },

            setSkipShowTask: function (value) {
                this.trigger('setSkipShowTask', value);
            },

            showLetterSettings: function (transitionModel) {
                this.trigger('showLetterSettings', transitionModel);
            },

            performTransition: function (transitionInfo) {
                this.trigger('performTransition', transitionInfo);
            },

            highlightRequiredFields: function (errData) {
                this.trigger('highlightRequiredFields', errData);
            },

            isEdittedInfoReturn: function (hasEditedInfo) {
                this.trigger('isEdittedInfoReturn', hasEditedInfo);
            },

            unSetValidationError: function (dataId) {
                this.trigger('unSetValidationError', dataId);
            },

            acceptCurrentTask: function () {
                this.trigger('acceptCurrentTask');
            },

            declineCurrentTask: function () {
                this.trigger('declineCurrentTask');
            },

            saveTemporaryAttachment: function (attachment) {
                this.trigger('saveTemporaryAttachment', attachment);
            },

            deleteAttachmentById: function (attachmentId) {
                this.trigger('deleteAttachmentById', attachmentId);
            },

            refershForm: function () {
                this.trigger('refreshForm');
            },

            formUpdated: function (data) {
                this.trigger('formUpdated', data);
            },

            formDataChanged: function (changedData) {
                this.trigger('formDataChanged', changedData);
            },

            downloadWorkflow: function() {
                this.trigger('downloadWorkflow');
            }
        });
    });