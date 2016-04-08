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
                this.url = this.urlRoot + id;
                this.fetch({
                    success: this.onDataLoaded.bind(this)
                });
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
                    Description: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.MODULES.COMMON.FORM.ITEMFORM.DESCRIPTION'),
                    Comments: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.COMMENTSTAB'),
                    ProcessView: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.WORKFLOWTAB'),
                    History: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.HISTORYTAB'),
                    Subtasks: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.SUBTASKSTAB'),
                    Timespent: App.Localizer.get('ELEGANCE.FORM.DEFAULTFORM.ATM.DEFAULTFORM.TABS.TIMESPENTTAB')
                };

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