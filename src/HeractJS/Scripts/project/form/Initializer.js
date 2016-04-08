/**
 * Developer: Daniil Korolev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define([
    'shared',
    './views/DefaultContentView',
    './controllers/FormController',
    './widget/WidgetComposite'
], function (
    shared, DefaultContentView, FormController, FieldModel, WidgetComposite
) {
    'use strict';

    return shared.application.Module.extend({
        contentView: DefaultContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.init();
            this.formController = new FormController();

            this.moduleRegion.show(this.formController.formLayoutView);
            this.formController.formLayoutView.reDraw(this.layout, this.models, {});
        },

        init() {
            this.widgetsLib = {
                Instance: WidgetComposite,
                Account: WidgetComposite,
                Date: WidgetComposite,
                DateTime: WidgetComposite,
                Duration: WidgetComposite,
                Selector: WidgetComposite,
                Number: WidgetComposite,
                Checkbox: WidgetComposite,
                HtmlText: WidgetComposite,
                MultiLineText: WidgetComposite,
                SingleLineText: WidgetComposite,
            };

            this.models = this.getTestModels();
            this.layout = this.getTestLayout();
        },

        getTestModels() {
            var models = [];

            var title = new Backbone.Model({
                widgetType: "SingleLineText",
                multiValue: false,
                id: "titleid123",
                dataType: "String",
                dataId: "textField",
                access: "Editable",
                dataValue: [{ dataValue: "I am just a text field" }]
            });
            var textWidgetModel = new Backbone.Model({
                widgetType: "SingleLineText",
                multiValue: false,
                id: "123123123",
                dataType: "String",
                dataId: "title",
                access: "Editable",
                dataValue: [{ dataValue: "Title of the object. hahaha" }]
            });

            models.push(title);
            models.push(textWidgetModel);

            return models;
        },

        getTestLayout() {
            var layout = {
                cfg: [
                    {
                        id: "46546546546546546",
                        isVisible: true,
                        parent: "997351fd422d4b8e810d456d0a4b0172",
                        type: "SingleLineText",
                        widgetData: {
                            accessType: "Editable",
                            attributes: ["Indexed"],
                            id: "title",
                            type: "String",
                            values: ["title"]
                        }
                    },
                    {
                        id: "84651651981981981",
                        isVisible: true,
                        parent: "997351fd422d4b8e810d456d0a4b0172",
                        type: "SingleLineText",
                        widgetData: {
                            accessType: "Editable",
                            attributes: ["Indexed"],
                            id: "123123123",
                            type: "String",
                            values: ["title"]
                        }
                    }
                ],
                id: "layoutId"
            };

            return layout;
        },
    });
});
