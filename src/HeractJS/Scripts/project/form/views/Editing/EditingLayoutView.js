/**
 * Developer: Daniil Korolev
 * Date: 12/03/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['../../App', './EditingContentView', '../widgets/CustomTab'],
    function (App, ContentView, CustomTab) {
        'use strict';

        var TabsCollection = Marionette.CollectionView.extend({
            initialize: function (opts) {
                this.mode = opts.mode;
            },
            childView: CustomTab,
            className: 'js-tabs-container',
            childViewOptions: function () {
                return {
                    isEdit:  this.mode === 'edit',
                    isCreate:  this.mode === 'create',
                    mode: this.mode
                };
            }
        });

        return Marionette.LayoutView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                this.formModel = options.formModel;
                this.formSchema = options.formSchema;
                this.formTemplate = options.formTemplate;
                this.tabsCollection = options.tabsCollection;
                this.mode = options.mode;
                this.isCustomTab = options.isCustomTab;
            },
            regions: {
                contentRegion: '#editingContent-region',
                tabsRegion: '#editingTabs-region'
            },
            template: Handlebars.compile("<div id='editingContent-region'></div><div id='editingTabs-region'></div>"),

            className: 'card card_edit',

            onRender: function () {
                this.showEditingForm();
            },

            showEditingForm: function () {
                this.contentRegion.show(new ContentView({
                    model: this.formModel,
                    schema: this.formSchema,
                    template: Handlebars.compile(this.formTemplate)
                }));

                if (!this.isCustomTab) {
                    this.tabsRegion.show(new TabsCollection({
                        collection: this.tabsCollection,
                        mode: this.mode
                    }));
                }
            }
        });
    });
