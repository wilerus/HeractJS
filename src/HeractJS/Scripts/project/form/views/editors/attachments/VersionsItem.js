/**
 * Developer: Roman Shumskiy
 * Date: 26/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/editors/attachments/versions.html'],
    function (App, itemTemplate) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (opts) {
                _.bindAll(this, "template");
                this.attachmentId = opts.attachmentId;
            },

            events: {
                'click .js-attach-author': 'onAuthorClick'
            },

            template: Handlebars.compile(itemTemplate),
            className: 'card__i card__i_attach-version',

            onAuthorClick: function(e){
                e.preventDefault();
                e.stopPropagation();
                var author = this.model.get('author');
                App.FormMediator.updateItem(false, {
                    type: 'attachmentAuthor',
                    userId: author.id,
                    attachmentId: this.attachmentId
                });
            }
        });
    });
