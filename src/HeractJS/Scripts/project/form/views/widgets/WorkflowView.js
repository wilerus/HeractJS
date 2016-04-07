/**
 * Developer: Roman Shumskiy
 * Date: 27/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../../App', '../../templates/widgets/workflow.html', /*'util/WFView'*/],
    function (App, tmpl/*,WFView*/) {
        'use strict';

        return Marionette.ItemView.extend({
            attributes: {id: 'formWorkflowWrapper'},
            template: Handlebars.compile(tmpl),

            onShow: function () {
                return;
                var workflowContainerId = '#formWorkflowContainer';
                //WFView.buildWorkflow(workflowContainerId, this.model);
                this.listenTo(App.FormMediator, 'downloadWorkflow', this.model.downloadWorkflow.bind(this.model));
            }
        });
    });
