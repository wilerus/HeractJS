/**
 * Developer: Roman Shumskiy
 * Date: 16/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../../App', '../../../templates/editors/attachments/attachmentsSingle.html',
        '../../../models/editors/attachments/AttachmentsSingle',  './VersionsItem'],
    function (App, itemTmpl, AttachmentsSingleModel, AttachmentsVersionsView) {
        'use strict';
        return Marionette.CompositeView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                this.model = new AttachmentsSingleModel({id:options.id});
                this.collection = this.model.versionsCollection;
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(App.FormMediator, 'deleteAttachmentById', this.model.deleteAttachmentById.bind(this));
                this.model.fetch();
            },
            template: Handlebars.compile(itemTmpl),
            className: 'card card_attach',
            childViewContainer: '.js-attach-versions',
            childView: AttachmentsVersionsView,
            childViewOptions: function(){
                return {attachmentId: this.model.get('id')};
            },
            events: {
                'click .js-attach-author': 'onAuthorClick'
            },
            onAuthorClick: function(e){
                e.preventDefault();
                e.stopPropagation();
                App.FormMediator.updateItem(false, {
                    type: 'attachmentAuthor',
                    userId: this.model.get('userId'),
                    attachmentId: this.model.get('id')
                });
            }
        });
    });
