/**
 * Developer: Grigory Kuznetsov
 * Date: 31/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, Backbone */

define(['../../App', '../../templates/widgets/commentItem.html',
        '../../templates/widgets/commentsCollection.html', '../../templates/widgets/commentInlineEdit.html'],
    function (App, commentItemTmpl, CommentsTmpl, commentInlineEditTmpl) {
        'use strict';

        var CommentsMediator = Marionette.Controller.extend({
            editModel: function (editModel) {
                this.trigger('editModel', editModel);
            },
            removeEditModel: function (editModel) {
                this.trigger('removeEditModel', editModel);
            }
        });

        var commentsMediator = new CommentsMediator();

        var CommentInlineEditView = Marionette.ItemView.extend({
            tagName: 'li',
            className: 'comments__i edit',
            template: Handlebars.compile(commentInlineEditTmpl),
            ui: {
                sendCommentBtn: '.js-send-comment',
                editCommentBtn: '.js-edit-comment',
                input: '.js-input'
            },

            events: {
                'click @ui.editCommentBtn': 'editComment',
                'click @ui.sendCommentBtn': 'sendComment',
                'keyup @ui.input': 'onInputKeyup'
            },

            mixinTemplateHelpers: function (data) {
                data.userId = App.currentParameters.id;
                return data;
            },

            editComment: function (e) {
                e.stopPropagation();
                this.model.set({value: this.ui.input.val()});
                App.FormMediator.showCommentEdit({model: this.model, mode: 'new'});
            },

            sendComment: function () {
                var inputValue = this.ui.input.val(),
                    value = inputValue.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                this.model.set({value: value});
                this.model.unset('isNew');
                this.model.add();
            },

            minHeight: 32,
            maxHeight: 96,

            onInputKeyup: function () {
                var scrollHeight = 0,
                    height = 0;

                this.ui.input.attr("wrap", "");

                scrollHeight = this.ui.input.prop('scrollHeight');
                if (scrollHeight < this.minHeight) {
                    height = this.minHeight;
                } else if (scrollHeight > this.maxHeight) {
                    height = this.maxHeight;
                } else {
                    height = scrollHeight;
                }

                if (this.prevHeight > height) {
                    height = this.prevHeight;
                }

                if (this.prevHeight !== height) {
                    this.ui.input.height(this.prevHeight + 'px');
                }

                this.prevHeight = height;
            },

            onShow: function () {
                if (!this.model.get('isEdit')) {
                    return;
                }

                this.focusInput();
            },

            focusInput: function () {
                this.ui.input.focus();
            }
        });

        var CommentItemView = Marionette.CompositeView.extend({
            childViewContainer: '.child-comments',
            tagName: 'li',
            className: 'comments__i',
            template: Handlebars.compile(commentItemTmpl),
            ui: {
                editBtn: '.js-edit',
                replyBtn: '.js-reply',
                commentValue: '.js-comment-value'
            },
            events: {
                'click @ui.editBtn': 'onEditClick',
                'click @ui.replyBtn': 'onReplyClick'
            },
            initialize: function (cfg) {
                var children = this.model.children;
                this.editEnabled = cfg.editEnabled;

                if (children) {
                    this.collection = children;
                }
            },
            mixinTemplateHelpers: function (data) {
                data.date = App.DateFormatter.getFullDateTime(data.date);
                return data;
            },
            getChildView: function (childModel) {
                return childModel.get('isEdit') ? CommentInlineEditView : CommentItemView;
            },
            childViewOptions: function (model) {
                return {model: model, editEnabled: this.editEnabled};
            },
            onEditClick: function (e) {
                e.stopPropagation();
                App.FormMediator.showCommentEdit({
                    model: this.model,
                    mode: 'edit'
                });
            },

            removeCurrentEditModel: function (editModel) {
                this.ui.replyBtn.removeClass('active');
                commentsMediator.removeEditModel(editModel);
            },

            onReplyClick: function (e) {
                e.stopPropagation();
                var editModel = this.collection.findWhere({isEdit: true});

                if (editModel) {
                    this.removeCurrentEditModel(editModel);
                    return;
                }

                var newModel = new this.model.collection.model({
                    parentId: this.model.get('id'),
                    value: '',
                    isEdit: true
                });

                this.ui.replyBtn.addClass('active');

                var index = this.collection.indexOf(this.model) + 1;
                this.collection.add(newModel, {at: index});
                commentsMediator.editModel(newModel);
            },

            onRender: function () {
                this.ui.commentValue.html(this.model.get('value'));
                var commentAuthor = this.model.get('author');
                if (!this.canEdit(commentAuthor)) {
                    this.ui.editBtn.addClass('hidden');
                }

                if (!this.editEnabled) {
                    this.ui.replyBtn.addClass('hidden');
                }
            },
            canEdit: function (commentAuthor) {
                return this.editEnabled && commentAuthor && commentAuthor.id === App.currentParameters.id;
            }
        });

        return Marionette.CompositeView.extend({
            template: Handlebars.compile(CommentsTmpl),
            childViewContainer: '.js-comments-container',
            tagName: 'div',
            className: 'l-comments',
            getChildView: function (childModel) {
                return childModel.get('isEdit') ? CommentInlineEditView : CommentItemView;
            },
            childViewOptions: function (model) {
                return {model: model, editEnabled: this.editEnabled};
            },
            mixinTemplateHelpers: function (data) {
                data.showPlaceholder = this.isNeedToShowPlaceholder();
                return data;
            },
            isNeedToShowPlaceholder: function () {
                var modelsL = this.collection.length;
                return (!this.editEnabled && modelsL < 1);
            },
            initialize: function (cfg) {
                this.commentsCollection = cfg.commentsCollection;
                this.editEnabled = cfg.editEnabled;

                this.setCollection();
                this.listenTo(this.commentsCollection, 'commentsLoaded', this.onCollectionLoaded.bind(this));

                this.listenTo(commentsMediator, 'editModel', function (editModel) {
                    this.removeCurrentEditModel();
                    this.editModel = editModel;
                }.bind(this));

                this.listenTo(commentsMediator, 'removeEditModel', function () {
                    this.removeCurrentEditModel();
                }.bind(this));
            },

            removeCurrentEditModel: function () {
                this.editModel && this.editModel.collection.remove(this.editModel);
                delete this.editModel;
            },

            onCollectionLoaded: function () {
                this.removeCurrentEditModel();
                this.setCollection();
                this.render();
            },

            setCollection: function () {
                var comments = this.commentsCollection.models;
                if (comments[0]) {
                    this.collection = new Backbone.Collection(comments[0].children.models);
                }

                if (this.editEnabled) {
                    var emptyModel = new this.commentsCollection.model({
                        parentId: App.StateManager.state.form,
                        value: '',
                        isEdit: true
                    });

                    this.collection.add(emptyModel, {at: 0});
                }

                App.FormMediator.hideCustomPopupView('hideCustomPopupView');
            }
        });
    });
