/**
 * Developer: Grigory Kuznetsov
 * Date: 6/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define(['../../App', '../../templates/widgets/subtaskItem.html', '../../templates/widgets/subtasksCollection.html'],
    function (App, SubtaskItemTmpl, SubtasksTmpl) {
        'use strict';

        var SubtaskItemView = Marionette.ItemView.extend({
            tagName: 'div',
            className: 'card__i',
            template: Handlebars.compile(SubtaskItemTmpl, {noEscape: true}),
            mixinTemplateHelpers: function (data) {
                if (data.completionDate) {
                    data.completionDate = App.DateFormatter.getFullDate(data.completionDate);
                }

                return data;
            },
            events: {
                'click': 'onClick'
            },
            onClick: function (e) {
                e.preventDefault();
                e.stopPropagation();
                App.StateManager.updateItem({ id: this.model.get('id') });
            }
        });

        return Marionette.CompositeView.extend({
            template: Handlebars.compile(SubtasksTmpl),
            childViewContainer: '.js-subtasks-container',
            tagName: 'div',
            className: 'card card_tab',
            childView: SubtaskItemView,
            mixinTemplateHelpers: function (data) {
                data.showPlaceholder = this.collection.length < 1;
                return data;
            }
        });
    });
