/**
 * Developer: Andrey Chepurenko
 * Date: 11/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../App'],
    function (App) {
        'use strict';
        return Backbone.Model.extend({
            getWorkflow: function (workflowObject) {
                var self = this;
                this.set('states', workflowObject.states);
                this.set('id', workflowObject.id);
                $.ajax({
                    method: 'GET',
                    url: '/WorkflowView?id=' + workflowObject.id
                }).then(function(data){
                    self.set('svgElement', data.getElementsByTagName("svg")[0]);
                    self.trigger('workflowLoaded');
                });
            },

            downloadWorkflow: function () {
                var itemTitle = this.get('itemTitle');
                var fileName = (itemTitle || 'WorkflowScheme') + '.pdf';
                var inner = '<input type="hidden" name="name" value="' + fileName + '" />' +
                    '<input type="hidden" name="id" value="' + this.get('id') + '" />';
                var form = $("<form>").appendTo("body");
                form.hide()
                    .prop('method', 'POST')
                    .prop('action', '/WorkflowView/GetPdf')
                    .html(inner);

                form.submit();
            }
        });
    });