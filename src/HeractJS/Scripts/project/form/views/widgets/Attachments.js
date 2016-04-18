/**
 * Developer: Roman Shumskiy
 * Date: 01/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/widgets/attachments.html'],
    function (App, itemTmpl) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function () {
                this.setHiddenClassNameIfNeeded();
                _.bindAll(this, 'template');
                this.render();
            },
            template: Handlebars.compile(itemTmpl),
            className: 'card__i',
            events: {
                'click': 'showAttachments'
            },
            setHiddenClassNameIfNeeded: function () {
                this.isVisible = this.model.get('isVisible');
                !this.isVisible && (this.className += ' hidden');
            },
            onRender: function(){
                this.$el.addClass(this.className);
                var length = this.model.get('dataValue') ? this.model.get('dataValue').length : false;
                if(length){
                    this.$el.children().attr('data-num', length);
                } else {
                    this.$el.children().attr('data-num', '0');
                }
            },
            showAttachments: function(){
                App.FormMediator.updateItem(false, {
                    type: 'attachments'
                });
            }
        });
    });
