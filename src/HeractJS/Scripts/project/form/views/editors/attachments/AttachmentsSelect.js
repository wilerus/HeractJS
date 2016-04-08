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

define(['form/App', 'form/templates/editors/attachments/attachmentsSelect.html'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                _.bindAll(this, "template");
                this.render();
            },
            template: Handlebars.compile(itemTmpl),
            className: 'tab-list__i doc-icon',
            events: {
                'click': 'itemSelected'
            },

            onRender: function(){
                var extension = this.getExtension();
                var date = this.model.get('date');
                this.model.set('date', App.DateFormatter.getFullDateTime(date));
                if(extension){
                    this.$el.attr('data-extension', extension);
                } else {
                    this.$el.addClass('js-undefined-extension');
                }

            },

            itemSelected: function(){
                if(!App.StateManager.state.isEdit && !App.StateManager.state.isCreate){
                    App.FormMediator.updateItem(false, {
                        fieldId: this.model.get('id'),
                        type: 'attachment'
                    });
                }
            },

            getExtension: function(){
                return (/[.]/.exec(this.model.get('name'))) ? /[^.]+$/.exec(this.model.get('name')) : false;
            }
        });
    });
