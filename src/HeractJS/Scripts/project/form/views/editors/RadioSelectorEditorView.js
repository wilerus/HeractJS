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

define(['form/App', 'form/templates/editors/radioSelectorEditor.html', './BaseEditorView'],
    function (App, template, EditorBaseView) {
        'use strict';

        return EditorBaseView.extend({
            ui: {
                radiobutton: ".js-radio_button"
            },

            template: Handlebars.compile(template),

            mixinTemplateHelpers: function () {
                var data = this.value;
                data.isEditable = this.isEditable;
                data = this.setPlaceholder(data);
                if (this.getAccess() === 'Hidden') {
                    data.isPlaceholder = true;
                } else {
                    data.isPlaceholder = false;
                }
                if (data.orientation == 'Vertical') {
                    data.isVertical = true;
                }

                var currentItemId = this.__getValue()[0];
                for (var i = 0; i < data.variants.length; i++) {
                    var it = data.variants[i];
                    it.isEditable = this.isEditable;
                    if (currentItemId && it.id === currentItemId) {
                        it.selected = true;
                    }
                }
                return data;
            },

            events: {
                'click @ui.radiobutton': '__radioClicked'
            },

            __radioClicked: function (e) {
                var newId = e.currentTarget.value;
                var oldId = this.__getValue()[0];
                if (newId != oldId) {
                    this.__setValue([newId]);
                }
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