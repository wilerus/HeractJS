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

/* global define, _ */

define(['../../App', '../../templates/actionsDropDown.html'],
    function (App, dropDownTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                var Model = Backbone.Model.extend({});
                this.model = new Model({actions: options.actions});
            },

            className: 'l-dropdown l-dropdown_action',
            template: Handlebars.compile(dropDownTmpl),
            events: {
                'click #action-accept': '__handleAcceptClick',
                'click #action-decline': '__handleDeclineClick',
                'click #action-delete': '__handleDeleteClick',
                'click #action-move': '__handleMoveClick',
                'click #action-reassign': '__handleReassignClick',
                'click #action-unfollow': '__handleUnfollowClick',
                'click #action-follow': '__handleFollowClick',
                'click #action-defer': "__handleDeferClick",
                'click #action-start': "__handleStartClick",
                'click #action-compete': "__handleCompelteClick",
                'click #action-edit': "__handleEditClick",
                "click #action-clone": "__handleCloneClick"
            },
            ui: {
                focusTarget: '#action-dropdown'
            },

            __handleAcceptClick: function() {
                this.trigger('triggerAcceptTaskClick');
            },

            __handleDeclineClick: function() {
                this.trigger('triggerDeclineTaskClick');
            },

            __handleEditClick: function() {
                this.trigger('triggerEditItemClick');
            },

            __handleDeleteClick: function(){
                this.trigger('triggerDeleteItemClick');
            },

            __handleReassignClick: function(){
                this.trigger('triggerReassignItemClick');
            },

            __handleMoveClick: function(){
                this.trigger('triggerMoveItemClick');
            },

            __handleFollowClick: function(){
                this.trigger('triggerFollowItemClick');
            },

            __handleUnfollowClick: function(){
                this.trigger('triggerUnfollowItemClick');
            },

            __handleDeferClick: function(){
                this.trigger('triggerDeferItemClick');
            },

            __handleStartClick: function(){
                this.trigger('triggerStartItemClick');
            },

            __handleCompelteClick: function(){
                this.trigger('triggerCompleteItemClick');
            },

            __handleCloneClick: function () {
                this.trigger('triggerCloneItemClick');
            }
        });
    });
