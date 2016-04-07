/**
 * Developer: Grigory Kuznetsov
 * Date: 05/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, CKEDITOR */

define(['../../App', '../../templates/widgets/commentEditView.html'],
    function (App, commentEditView) {
        'use strict';
        var ItemView = Marionette.ItemView.extend({
            tagName: 'div'
        });

        return Marionette.CompositeView.extend({
            initialize: function (options) {
                this.mode = options.mode;

                _.bindAll(this, "template");
                this.getTitle();
            },


            template: Handlebars.compile(commentEditView),

            childView: ItemView,
            childViewContainer: '#commentEditor',
            className: 'wmodal',
            events: {
                'click #commentSaveBtn': 'saveComment',
                'click #commentCancelBtn': 'closePopup',
                'click a': 'onClickLink'
            },
            ui: {
                'title': '.js-title',
                'input': '#commentInput'
            },

            onClickLink: function (e) {
                e.preventDefault();
                e.stopPropagation();
            },

            closePopup: function () {
                App.FormMediator.hideCustomPopupView('hideCustomPopupView');
            },

            saveComment: function () {
                var commentData = this.editor.getData();
                if (this.mode === 'edit') {
                    this.model.set({'value': commentData});
                    this.model.save();
                } else {
                    this.model.set({'value': commentData});
                    this.model.add();
                }
            },

            getTitle: function () {
                this.titleNew = App.Localizer.get('ELEGANCE.FORM.WIDGETS.COMMENTS.EDITVIEW.ADDNEWCOMMENTTITLE');
                this.titleEdit = App.Localizer.get('ELEGANCE.FORM.WIDGETS.COMMENTS.EDITVIEW.EDITCOMMENTTITLE');

                if (this.mode === 'new' || this.mode === 'reply') {
                    this.title = this.titleNew;
                } else if (this.mode === 'edit') {
                    this.title = this.titleEdit;
                }
            },

            onShow: function () {
                this.ui.title.html(this.title);

                var config = {
                    toolbar: 'Full',
                    baseFloatZIndex: 9999999,
                    language: App.currentParameters.language,
                    startupFocus : true
                };

                CKEDITOR.env.isCompatible = true;
                this.editor = CKEDITOR.replace('commentInput', config);
            }
        });
    });
