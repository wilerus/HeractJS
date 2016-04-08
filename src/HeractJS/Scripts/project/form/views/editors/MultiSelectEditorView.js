/**
 * Developer: Daniil Korolev
 * Date: 27/04/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/editors/multiSelectEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        return EditorBaseView.extend({
            template: Handlebars.compile(template),

            mixinTemplateHelpers: function () {
                var data = this.value;
                data = this.setPlaceholder(data);
                data.isEditable = this.isEditable;
                if (this.getAccess() === 'Hidden') {
                    data.isPlaceholder = true;
                } else {
                    data.isPlaceholder = false;
                }
                if (data.orientation == 'Vertical') {
                    data.isVertical = true;
                }

                var currentItems = this.__getValue();
                _.each(data.variants, function (it) {
                    it.isEditable = data.isEditable;
                    if (currentItems && currentItems.length > 0 && _.contains(currentItems, it.id)) {
                        it.selected = true;
                    }
                });

                return data;
            },

            events: {
                'change :checkbox': '__checkboxClicked'
            },

            __checkboxClicked: function (e) {
                var clickedId = e.currentTarget.value;
                var currentItems = this.__getValue();
                var wasChecked = false;
                var newValues = [];

                for (var i = 0; i < currentItems.length; i++) {
                    var it = currentItems[i];
                    if (it === clickedId) {
                        wasChecked = true;
                    } else {
                        newValues.push(it);
                    }
                }

                if (!wasChecked) {
                    newValues.push(clickedId);
                }
                this.__setValue(newValues);
            },

            __getValue: function () {
                return this.value.data[0].dataValue;
            },

            __setValue: function (value, silent) {
                this.value.data[0].dataValue = value;
                if (!silent) {
                    this.__triggerChange();
                    this.refreshForm();
                }
            },

            getAccess: function () {
                return this.value.access;
            }
        });
    });