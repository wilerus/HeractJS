/**
 * Developer: Daniil Korolev
 * Date: 12/03/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, $ */

define(['form/App', './ActionsDropDownView', 'form/templates/actions.html',
        'form/views/ConfirmView', 'form/views/widgets/SearchModalView', 'form/views/NextStepView', 'form/models/editors/account/ReassignModel'],
    function (App, ActionsDropDownView, actionsTmpl, ConfirmView,
              SearchModalView, NextStepView, ReassignModel) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                this.resolutions = options.resolutions;
                this.isCustomTab = options.isCustomTab;
                this.id = options.id;

                this.reassignModel = new ReassignModel();

                var actionsTemplate = {
                    'AcceptTask': {
                        displayName: 'Accept',
                        id: 'action-accept',
                        hidden: true,
                        enabled: false
                    },
                    'DeclineTask': {
                        displayName: "Decline",
                        id: 'action-decline',
                        hidden: true,
                        enabled: false
                    },
                    'Edit': {
                        displayName: 'Edit',
                        id: 'action-edit',
                        hidden: true,
                        enabled: false
                    },
                    'Clone': {
                        displayName: 'Clone',
                        id: 'action-clone',
                        hidden: true,
                        enabled: false
                    },
                    'Follow': {
                        displayName: 'Follow',
                        id: 'action-follow',
                        hidden: true,
                        enabled: false
                    },
                    'Unfollow': {
                        displayName: 'Unfollow',
                        id: 'action-unfollow',
                        hidden: true,
                        enabled: false
                    },
                    'StartTask':{
                        displayName: 'Start',
                        id: 'action-start',
                        hidden: true,
                        enabled: false
                    },
                    'DeferTask':{
                        displayName: 'Deffer',
                        id: 'action-defer',
                        hidden: true,
                        enabled: false
                    },
                    'CompleteTask':{
                        displayName: 'Complete',
                        id: 'action-compete',
                        hidden: true,
                        enabled: false
                    },
                    'Reassign': {
                        displayName: 'Reassign',
                        id: 'action-reassign',
                        hidden: true,
                        enabled: false
                    },
                    'ResolveItem': {
                        displayName: 'Resolve',
                        id: 'action-move',
                        hidden: true,
                        enabled: false
                    },
                    'ResolveTask': {
                        displayName: 'Resolve task',
                        id: 'action-move',
                        hidden: true,
                        enabled: false
                    },
                    'Delete': {
                        displayName: 'Delete',
                        id: 'action-delete',
                        hidden: true,
                        enabled: false
                    }
                };

                var actions = [];

                for(var i = 0; i < options.actions.length; i++){
                    var item = options.actions[i];
                    var itemType = item.action;

                    if(actionsTemplate[itemType] !== undefined){
                        actionsTemplate[itemType].hidden = item.hidden;
                        actionsTemplate[itemType].enabled = item.enabled;
                    }

                    // If user has rights to do cloning, he can also clone items.
                    if (itemType == 'Edit') {
                        actionsTemplate['Clone'].hidden = item.hidden;
                        actionsTemplate['Clone'].enabled = item.enabled;
                    }
                }

                for(var key in actionsTemplate){
                    if(actionsTemplate[key].enabled && !actionsTemplate[key].hidden){
                        actions.push(actionsTemplate[key]);
                    }
                }

                this.actions = actions;
                this.actionsDropDownView = new ActionsDropDownView({
                    actions: this.actions
                });
                this.initializeEventsHandling();
            },

            template: Handlebars.compile(actionsTmpl),

            regions: {
                dropDownRegion: '#actionsDropDown-region'
            },

            events: {
                'click #actionsButton': '__toggleActionsDropDown'
            },

            initializeEventsHandling: function(){

                this.listenTo(this.actionsDropDownView, 'triggerDeleteItemClick', this.deleteItemClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerReassignItemClick', this.reassignItemClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerMoveItemClick', this.moveItemClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerFollowItemClick', this.followClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerUnfollowItemClick', this.unfollowClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerEditItemClick', this.editClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerDeferItemClick', this.deferClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerStartItemClick', this.srartClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerCompleteItemClick', this.completeClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerAcceptTaskClick', this.acceptClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerDeclineTaskClick', this.declineClicked.bind(this));

                this.listenTo(this.actionsDropDownView, 'triggerCloneItemClick', this.cloneClicked.bind(this));
            },

            onRender: function () {
                this.dropDownRegion.show(this.actionsDropDownView);
            },

            onShow: function(){
                this.actionsDropDownView.ui.focusTarget.on('blur', function(){
                    this.hideDropdown();
                }.bind(this));
            },

            __toggleActionsDropDown: function () {
                $('#actionsButton').parent().addClass('open');
                this.actionsDropDownView.ui.focusTarget.focus();
            },

            deleteItemClicked: function(){
                this.confirmView = new ConfirmView({
                    title:'Delete',
                    text: 'Are you sure?',
                    className: 'wmodal wmodal_confirm'
                });

                this.listenTo(this.confirmView, 'triggerOk', function(){
                    App.FormMediator.deleteCurrentItem();
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                this.listenTo(this.confirmView, 'triggerCancel', function(){
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                App.FormMediator.showCustomPopupView(this.confirmView);
            },

            reassignItemClicked: function(){
                this.searchView = new SearchModalView({
                    listModel: this.reassignModel,
                    type: 'user'
                });

                this.listenTo(this.searchView, 'itemSelected', function(model){
                    App.FormMediator.reassignCurrentItem(model);
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                this.listenTo(this.searchView, 'triggerBack', function(){
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                this.listenTo(this.reassignModel, 'dataLoaded', function(){
                    App.FormMediator.showCustomPopupView(this.searchView);
                });
                this.reassignModel.getData(App.StateManager.state.form);
            },

            moveItemClicked: function(){
                this.nextStepView = new NextStepView({
                    className: 'wmodal wmodal-nextstep',
                    resolutions: this.resolutions
                });

                this.listenTo(this.nextStepView, 'itemSelected', function(model){
                    App.FormMediator.moveToNextStep(model);
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                this.listenTo(this.nextStepView, 'triggerBack', function(){
                    App.FormMediator.hideCustomPopupView('hideCustomPopupView');
                    this.hideDropdown();
                }.bind(this));

                App.FormMediator.showCustomPopupView(this.nextStepView);
            },

            followClicked: function(){
                this.hideDropdown();
                App.FormMediator.changeFollowState(true);
            },


            unfollowClicked: function(){
                this.hideDropdown();
                App.FormMediator.changeFollowState(false);
            },

            editClicked: function(){
                this.hideDropdown();
                App.FormMediator.updateItem(false, {
                    isEdit: true,
                    isCustomTab: this.isCustomTab,
                    fieldId: this.id
                });
            },

            deferClicked: function(){
                this.hideDropdown();
                App.FormMediator.deferCurrentTask();
            },

            srartClicked: function(){
                this.hideDropdown();
                App.FormMediator.startCurrentTask();
            },

            completeClicked: function(){
                this.hideDropdown();
                App.FormMediator.completeCurrentTask();
            },

            acceptClicked: function(){
                this.hideDropdown();
                App.FormMediator.acceptCurrentTask();
            },

            declineClicked: function(){
                this.hideDropdown();
                App.FormMediator.declineCurrentTask();
            },

            cloneClicked: function () {
                App.FormMediator.cloneItem();
            },

            showDropdown: function(){
                $('#actionsButton').parent().addClass('open');
            },

            hideDropdown: function(){
                $('#actionsButton').parent().removeClass('open');
            }
        });
    });
