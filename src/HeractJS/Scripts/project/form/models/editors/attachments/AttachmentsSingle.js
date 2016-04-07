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

/* global define */

define(['../../../App'],
    function (App) {
        'use strict';

        return Backbone.Model.extend({
            initialize: function(options) {
                this.url = this.baseUrl + options.id;
                this.versionsCollection = new Backbone.Collection();
                this.listenTo(this, 'sync', this.onSync);
            },

            parse: function(resp){
                var data = resp.data;
                data.extension = (/[.]/.exec(data.name)) ? /[^.]+$/.exec(data.name) : 'bin';
                data.date = App.DateFormatter.getFullDateTime(data.date);
                if (data.revisions && data.revisions.length > 0) {
                    for (var i = 0; i < data.revisions.length; i++) {
                        var revision = data.revisions[i];
                        revision.date = App.DateFormatter.getFullDateTime(revision.date);
                    }
                }
                data.userFullName = data.revisions[0].author.name;
                data.userId = data.revisions[0].author.id;

                return data;
            },

            onSync: function(){
                this.versionsCollection.set(this.get('revisions'));
            },

            deleteAttachmentById: function(attachmentId){
                App.API.post('/EleganceAttachment/Delete/' + attachmentId).done(function (resp) {
                    if (resp.success) {
                        App.FormMediator.updateItem(false, {
                            type: 'attachments'
                        });
                    }
                }.bind(this));
            },

            baseUrl: '/EleganceAttachment/Get/'
        });
    });