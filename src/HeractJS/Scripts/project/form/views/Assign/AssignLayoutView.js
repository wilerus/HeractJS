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

define(['form/App', 'form/templates/popups/assignPopup/assignLayout.hbs', './AssignHeaderView', './AssignContentView'],
    function (App, layoutTmpl, HeaderView, ContentView) {
        'use strict';
        return Marionette.LayoutView.extend({
            initialize: function () {
                _.bindAll(this, "template");
            },

            regions: {
                headerRegion: '#assignPopupHeader-region',
                contentRegion: '#assignPopupContent-region'
            },

            onRender: function () {
                this.headerRegion.show(new HeaderView());
                this.contentRegion.show(new ContentView());
            },
            template: layoutTmpl,
            events: {
            }
        });
    });
