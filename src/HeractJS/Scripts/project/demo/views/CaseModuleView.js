/**
 * Developer: Alexander Makarov
 * Date: 13.07.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer, Prism */

define(['../templates/caseModule.hbs', 'comindware/core', 'prism', 'markdown'],
    function (template, core, prism, markdown) {
        'use strict';

        return Marionette.LayoutView.extend({
            initialize: function (options) {
            },

            modelEvents: {
                'change': 'render'
            },

            template: template,

            templateHelpers: function () {
                return {
                    description: markdown.markdown.toHTML(this.model.get('description') || '')
                };
            },

            regions: {
                caseRepresentationRegion: '.js-case-representation-region'
            },

            ui: {
                code: '.js-code'
            },

            onRender: function () {
                prism.highlightElement(this.ui.code[0]);
                this.loadCaseData();
            },

            loadCaseData: function () {
                var path;
                if (this.model.id) {
                    path = this.model.get('sectionId') +'/' + this.model.get('groupId') + '/' + this.model.id;
                } else {
                    path = this.model.get('sectionId') +'/' + this.model.get('groupId');
                }
                var caseScriptPath = 'text!./cases/' + path + '.js';
                var caseScript = './cases/' + path;

                var contextRequire = require.context('rootpath/demo/');
                //var caseSourceText = contextRequire(caseScriptPath);
                //this.model.set('sourceCode', caseSourceText);

                var caseFactory = contextRequire(caseScript);
                var representationView = caseFactory();
                this.caseRepresentationRegion.show(representationView);
            }
        });
    });
