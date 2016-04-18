/**
 * Developer: Roman Shumskiy
 * Date: 26/09/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['form/App'],
    function (App) {
        'use strict';
        return Backbone.Model.extend({
            urlRoot: '/EleganceForm/GetLayout/',

            getData: function (id) {
                this.getMockData();
                return;

                this.url = this.urlRoot + id;
                this.fetch({
                    success: this.onDataLoaded.bind(this)
                });
            },

            getMockData: function() {
                var layoutData = { "id": "40c8ef39ef70473c9e83677913e0284c", "root": { "id": "997351fd422d4b8e810d456d0a4b0172", "type": "Panel", "layout": { "height": 719, "minHeight": 0, "minWidth": 0, "autoHeight": false, "stretchHeight": true, "autoWidth": true, "orientation": "Vertical" }, "children": [{ "id": "fcc390e05bad4a6896bff5dbc5b2223d", "parent": "997351fd422d4b8e810d456d0a4b0172", "type": "SingleLineText", "layout": { "height": 36, "minHeight": 36, "minWidth": 0, "autoHeight": true, "stretchHeight": false, "autoWidth": true, "orientation": "Vertical" }, "field": { "datasource": { "id": "title", "text": "Title", "isMultivalue": false, "isSystem": false, "dataType": "String", "dataFormat": "Undefined", "accessType": "Undefined" }, "label": { "hidden": false, "text": "Title", "align": "Left", "width": 100 } } }, { "id": "b991b85ab7f44e3b82e99f80a1ae3540", "parent": "997351fd422d4b8e810d456d0a4b0172", "type": "SingleLineText", "layout": { "height": 23, "minHeight": 23, "minWidth": 0, "autoHeight": true, "stretchHeight": false, "autoWidth": true, "orientation": "Vertical" }, "field": { "datasource": { "id": "textField", "text": "TextField", "isMultivalue": false, "isSystem": false, "dataType": "String", "dataFormat": "Undefined", "accessType": "Undefined" }, "label": { "hidden": false, "text": "TextField", "align": "Left", "width": 100 } } }] }, "datasources": { "id": { "id": "id", "isMultivalue": false, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "cmw.ui.exportTemplates": { "id": "cmw.ui.exportTemplates", "isMultivalue": false, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "container": { "id": "container", "text": "systemContainerProperty", "isMultivalue": false, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "cmw.possibleResolutions": { "id": "cmw.possibleResolutions", "isMultivalue": true, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "currentSubtask": { "id": "currentSubtask", "isMultivalue": true, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "workflowState": { "id": "workflowState", "isMultivalue": true, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "cmw.workflowEvent": { "id": "cmw.workflowEvent", "isMultivalue": true, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "cmw.workflow.currentWorkflowStepRestrictions": { "id": "cmw.workflow.currentWorkflowStepRestrictions", "isMultivalue": true, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "cmw.ui.commentsObjectId": { "id": "cmw.ui.commentsObjectId", "isMultivalue": false, "isSystem": true, "dataType": "Undefined", "dataFormat": "Undefined", "accessType": "Undefined" }, "title": { "id": "title", "text": "Title", "isMultivalue": false, "isSystem": false, "dataType": "String", "dataFormat": "Undefined", "accessType": "Undefined" }, "textField": { "id": "textField", "text": "TextField", "isMultivalue": false, "isSystem": false, "dataType": "String", "dataFormat": "Undefined", "accessType": "Undefined" } }, "itemType": "TrackerObject" };
                this.prepareData(layoutData);
                this.set(layoutData);
                this.trigger('formLayoutLoaded');
            },

            parse: function (resp) {
                var data = resp.data;
                this.prepareData(data);
                return data;
            },

            onDataLoaded: function () {
                this.trigger('formLayoutLoaded');
            },

            prepareData: function(data) {
                var map = {
                    Description: 'Description',
                    Comments: 'Comments',
                    ProcessView: 'Workflow',
                    History: 'History',
                    Subtasks: 'Subtasks',
                    Timespent: 'Timespent'
                };

                //var map = {
                //    Description: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.MODULES.COMMON.FORM.ITEMFORM.DESCRIPTION'),
                //    Comments: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.COMMENTSTAB'),
                //    ProcessView: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.WORKFLOWTAB'),
                //    History: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.HISTORYTAB'),
                //    Subtasks: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.SUBTASKSTAB'),
                //    Timespent: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.TIMESPENTTAB')
                //};

                var root = data.root,
                    descriptionPanel;
                for (var i = root.children.length - 1; i >= 0; i--) {
                    var child = root.children[i];

                    if (child.type === 'AcceptDecline') {
                        root.children.splice(i, 1);
                    }

                    if (child.type === 'TabContainer' && child.children && child.children.length > 0) {
                        var n = child.children.length - 1;
                        for (var j = n; j >= 0; j--) {
                            var grandChild = child.children[j];
                            if (grandChild.type === 'Panel' && grandChild.children && grandChild.children.length > 0) {
                                if (grandChild.children[0].field && grandChild.children[0].field.datasource && grandChild.children[0].field.datasource.id === 'description') {
                                    grandChild.children[0].field.label = {
                                        hidden: false,
                                        align: "Left",
                                        text: map['Description']
                                    }
                                    grandChild.field = grandChild.children[0].field;
                                }
                            }
                            if (grandChild.field && grandChild.field.datasource && grandChild.field.datasource.id == 'description') {
                                grandChild.parent = 'descriptionPanel';
                                if (!grandChild.field.label) {
                                    grandChild.field.label = {
                                        hidden: false,
                                        align: "Left",
                                        text: grandChild.field.datasource.text ? _.clone(grandChild.field.datasource.text) : map['Description']
                                    }
                                }
                                descriptionPanel = {
                                    parent: child.id,
                                    type: 'Panel',
                                    layout: {
                                        autoHeight: true,
                                        autoWidth: true,
                                        minHeight: 0,
                                        minWidth: 0,
                                        orientation: "Vertical"
                                    },
                                    children: [_.clone(grandChild)],
                                    id: grandChild.id,
                                    field: _.clone(grandChild.field)
                                };
                                child.children[j] = descriptionPanel;
                            }
                            if (!(grandChild.field && grandChild.field.label) && grandChild.type && map[grandChild.type]) {
                                if (!grandChild.field) {
                                    grandChild.field = {};
                                }
                                grandChild.field.label = {
                                    hidden: false,
                                    align: "Left",
                                    text: map[grandChild.type]
                                }
                            }
                        }
                    }
                }
            }

        });
    });