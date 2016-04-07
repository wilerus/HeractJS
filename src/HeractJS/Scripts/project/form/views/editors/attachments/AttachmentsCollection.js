/**
 * Developer: Roman Shumskiy
 * Date: 17/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, Backbone */

define(['../../../App','./AttachmentsSelect', '../../EmptyView'],
    function (App, AttachmentsItemView, EmptyView) {
        'use strict';
        return Marionette.CollectionView.extend({
            initialize: function (options) {
                this.collection = new Backbone.Collection();
                this.collection.set(options.attachmentsCollection);
            },
            childView: AttachmentsItemView,
            emptyView: EmptyView,
	        className: 'tab-list',
            emptyViewOptions: function(){
                return {mode: 'attachments'};
            }
        });
    });
