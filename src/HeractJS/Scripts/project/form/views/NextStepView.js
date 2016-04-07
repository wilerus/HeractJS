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

define(['../App', '../templates/nextStep.html', '../views/NextStepItemView'],
    function (App, itemTmpl, NextStepItemView) {
        'use strict';
        return Marionette.CompositeView.extend({
            initialize: function (options) {
                _.bindAll(this, "template");
                var Model =  Backbone.Model.extend();
                this.model = new Model({
                    title: 'Next Step'
                });
                var Collection = Backbone.Collection.extend();
                this.collection = new Collection(options.resolutions);
                this.render();
            },
            template: Handlebars.compile(itemTmpl),
            childView: NextStepItemView,
            childViewContainer: '#nextstep-content',
            className: 'wmodal',
            events: {
                'click #nextstep-header-back': 'triggerBack'
            },
            childEvents: {
                'itemSelected': 'itemSelected'
            },
            onRender: function() {
                this.$el.addClass(this.className);
            },
            triggerBack: function(){
                this.trigger('triggerBack');
            },
            itemSelected: function(child){
                this.trigger('itemSelected', child.model);
            }
        });
    });
