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

/* global define */

define(['../models/UserObjectModel', '../models/LayoutModel', '../models/CommentsCollection',
        '../models/SubtasksCollection', '../models/HistoryCollection', '../models/TimespentModel', '../models/TransitionModel', '../models/WorkflowModel'],
    function (UserObjectModel, LayoutModel, CommentsCollection, SubtasksCollection, HistoryCollection,
              TimespentModel, TransitionModel, WorkflowModel) {
        'use strict';

        var DataProxyManager = Backbone.Marionette.Controller.extend({
            initialize: function () {
                this.userObjectModel = new UserObjectModel();
                this.cfgModel = new LayoutModel();
                this.workflowModel = new WorkflowModel();
                this.commentsCollection = new CommentsCollection();
                this.subtasksCollection = new SubtasksCollection();
                this.historyCollection = new HistoryCollection();
                this.timespentModel = new TimespentModel();
                this.transitionModel = new TransitionModel();
            },

            getData: function (id) {
                this.userObjectModel.getData(id);
            },

            getWorkflow: function (workflowObject) {
                this.workflowModel.getWorkflow(workflowObject);
            },

            getCfg: function (id) {
                this.cfgModel.getData(id);
            },

            getComments: function (id) {
                this.commentsCollection.getComments(id);
            },

            setCommentsCollection: function (comments) {
                this.commentsCollection.reset(comments);

            },

            getSubtasks: function (id) {
                this.subtasksCollection.getSubtasks(id);
            },

            getHistory: function (id) {
                this.historyCollection.getHistory(id);
            },

            getTimespent: function (id) {
                this.timespentModel.getTimespent(id);
            },

            getTransitionModel: function (transitionInfo) {
                this.transitionModel.getTransition(transitionInfo);
            },

            deleteForm: function(id){
                this.userObjectModel.deleteForm(id);
            },

            editForm: function(id, data){
                this.userObjectModel.editForm(id, data);
            },

            createForm: function(container, id, data){
                this.userObjectModel.createForm(container, id, data);
            },

            performTransition: function(transitionInfo){
                this.userObjectModel.performTransition(transitionInfo);
            },

            reassignForm: function(id, userId){
                this.userObjectModel.reassignForm(id, userId);
            },

            changeFollowState: function(id, state){
                this.userObjectModel.changeFollowState(id, state);
            },

            defferTask: function(id){
                this.userObjectModel.defferTask(id);
            },

            startTask: function(id){
                this.userObjectModel.startTask(id);
            },

            completeTask: function(id){
                this.userObjectModel.completeTask(id);
            },

            acceptTask: function(id){
                this.userObjectModel.acceptTask(id);
            },

            declineTask: function(id){
                this.userObjectModel.declineTask(id);
            },

            refreshForm: function (id, editedData, container, isReDraw) {
                var self = this;

                if (this.refreshTimeout) {
                    clearTimeout(this.refreshTimeout)
                }

                this.refreshTimeout = setTimeout(function() {
                    self.userObjectModel.refreshForm(id, editedData, container, isReDraw);
                }, 200);
            }
        });

        return new DataProxyManager();
    });

